import React, { useState } from 'react'
import { depositFund } from '../utils/contractServices'
import { withdrawFund } from '../utils/contractServices'
import { toast } from 'react-toastify'

//存款 & 取款 操作
function ContractActions() {
  const [depositValue, setDepositValue] = useState('')

  const handleDeposit = async () => {
    try {
      console.log('存款是: ', depositValue)
      await depositFund(depositValue)
    } catch (error) {
      toast.error(error?.reason)
    }
    setDepositValue('')
  }

  const handleWithdraw = async () => {
    try {
      await withdrawFund()
    } catch (error) {
      toast.error(error?.reason)
    }
  }

  return (
    <div className="ContractActions">
      <div>合约操作项</div>
      <br />
      <div>
        <input
          type="text"
          value={depositValue}
          onChange={(e) => setDepositValue(e.target.value)}
          placeholder="Amount in ETH"
        />
        <button onClick={handleDeposit}>Deposit Funds</button>
      </div>
      <br />
      <div>
        <button onClick={handleWithdraw}>Withdraw Funds</button>
      </div>
    </div>
  )
}

export default ContractActions
