import {
  time,
  loadFixture,
} from '@nomicfoundation/hardhat-toolbox/network-helpers'
import { anyValue } from '@nomicfoundation/hardhat-chai-matchers/withArgs'
import { expect } from 'chai'
import hre from 'hardhat'

// 智能合约测试用例
describe('Lock', function () {
  // We define a fixture to reuse the same setup in every test.
  // We use loadFixture to run this setup once, snapshot that state,
  // and reset Hardhat Network to that snapshot in every test.
  async function deployOneYearLockFixture() {
    const ONE_YEAR_IN_SECS = 365 * 24 * 60 * 60 // 1 year
    const ONE_GWEI = 1_000_000_000 //锁定的数额 1 gwei

    const lockedAmount = ONE_GWEI
    const unlockTime = (await time.latest()) + ONE_YEAR_IN_SECS //合约部署的时间 + 一整年之后到达解锁合约时间

    // Contracts are deployed using the first signer/account by default   we take first signer as our owner
    const [owner, otherAccount] = await hre.ethers.getSigners()

    //get the contract
    const Lock = await hre.ethers.getContractFactory('Lock')
    //then we deploy the contract, we give the constructor function value(parameters) unlockTime and how much amount we want to lock in
    const lock = await Lock.deploy(unlockTime, { value: lockedAmount })

    //we return the stuff we want to have , reuse it in the next a few tests step
    return { lock, unlockTime, lockedAmount, owner, otherAccount }
  }

  //测试部署合约
  describe('Deployment', function () {
    //解除锁定时间判断
    it('Should set the right unlockTime', async function () {
      const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

      expect(await lock.unlockTime()).to.equal(unlockTime)
    })

    //合约拥有者判断
    it('Should set the right owner', async function () {
      const { lock, owner } = await loadFixture(deployOneYearLockFixture)

      expect(await lock.owner()).to.equal(owner.address)
    })

    //余额和存款做比较是否一致
    it('Should receive and store the funds to lock', async function () {
      const { lock, lockedAmount } = await loadFixture(deployOneYearLockFixture)

      expect(await hre.ethers.provider.getBalance(lock.target)).to.equal(
        lockedAmount
      )
    })

    //判断当前时间到了（超过）取款时间
    it('Should fail if the unlockTime is not in the future', async function () {
      // We don't use the fixture here because we want a different deployment
      const latestTime = await time.latest()
      const Lock = await hre.ethers.getContractFactory('Lock')
      await expect(Lock.deploy(latestTime, { value: 1 })).to.be.revertedWith(
        'Unlock time should be in the future'
      )
    })
  })

  //测试取款
  describe('Withdrawals', function () {
    //校验
    describe('Validations', function () {
      it('Should revert with the right error if called too soon', async function () {
        const { lock } = await loadFixture(deployOneYearLockFixture)

        await expect(lock.withdraw()).to.be.revertedWith(
          "You can't withdraw yet"
        )
      })

      it('Should revert with the right error if called from another account', async function () {
        const { lock, unlockTime, otherAccount } = await loadFixture(
          deployOneYearLockFixture
        )

        // We can increase the time in Hardhat Network  假设我们到达了取款的锁定时间 （hardhat 网络支持增加时间）
        await time.increaseTo(unlockTime)

        // We use lock.connect() to send a transaction from another account  非owner取不了款的判断检查
        await expect(lock.connect(otherAccount).withdraw()).to.be.revertedWith(
          "You aren't the owner"
        )
      })

      it("Shouldn't fail if the unlockTime has arrived and the owner calls it", async function () {
        const { lock, unlockTime } = await loadFixture(deployOneYearLockFixture)

        // Transactions are sent using the first signer by default  this time is owner to withdraw the balance which is okay for that
        await time.increaseTo(unlockTime)

        await expect(lock.withdraw()).not.to.be.reverted
      })
    })

    //事件
    describe('Events', function () {
      it('Should emit an event on withdrawals', async function () {
        const { lock, unlockTime, lockedAmount } = await loadFixture(
          deployOneYearLockFixture
        )

        //增加时间到锁定时间到期时间
        await time.increaseTo(unlockTime)

        //判断触发取款事件
        await expect(lock.withdraw())
          .to.emit(lock, 'Withdrawal')
          .withArgs(lockedAmount, anyValue) // We accept any value as `when` arg
      })
    })

    //转账
    describe('Transfers', function () {
      it('Should transfer the funds to the owner', async function () {
        const { lock, unlockTime, lockedAmount, owner } = await loadFixture(
          deployOneYearLockFixture
        )

        await time.increaseTo(unlockTime)

        //判断余额变化是否符合预期
        await expect(lock.withdraw()).to.changeEtherBalances(
          [owner, lock],
          [lockedAmount, -lockedAmount] //lockedAmount： 看owner是否增加了  lockedAmount , -lockedAmount： 看合约（lock）是否减少了lockedAmount
        )
      })
    })
  })
})
