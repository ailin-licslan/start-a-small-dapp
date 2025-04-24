import React, { useEffect, useState } from 'react'
import { getContractBalanceInETH } from '../utils/contractServices'

//合约信息
function ContractInfo({ account, address }) {
  const [balance, setBalance] = useState(null)

  useEffect(() => {
    //获取合约地址余额
    const fetchBalance = async () => {
      const balanceInETH = await getContractBalanceInETH()
      setBalance(balanceInETH)
    }
    fetchBalance()
  }, [])

  //账户余额  & 当前连接的账户
  return (
    <div className='ContractInfo'>
      <p>当前合约地址: {address} </p>
      <p>当前合约地址余额: {balance} ETH</p>
      <p>当前连接的钱包账户: {account}</p>
    </div>
  )
}

export default ContractInfo
