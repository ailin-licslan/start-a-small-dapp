import React, { useState, useEffect } from 'react'
import ConnectWalletButton from './components/ConnectWalletButton'
import ContractInfo from './components/ContractInfo'
import ContractActions from './components/ContractActions'
import { requestAccount } from './utils/contractServices'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { CONTRACT_ADDRESS } from './utils/constants'

function App() {
    //定义账号
    const [account, setAccount] = useState(null)
    //const [address, setAddress] = useState(null)
    //const address = CONTRACT_ADDRESS
    //连接账号
    useEffect(() => {
      const fetchCurAccount = async () => {
        const account = await requestAccount()
        setAccount(account)
      }
      fetchCurAccount().then((r) => {})
    }, [])
    //监听账号切换动作
    useEffect(() => {
      const handleAccountChanged = (newAccounts) =>
        setAccount(newAccounts.length > 0 ? newAccounts[0] : null)
      if (window.ethereum) {
        window.ethereum.on('accountsChanged', handleAccountChanged)
      }
      return () => {
        window.ethereum?.removeListener('accountsChanged', handleAccountChanged)
      }
    })

  return (
    <div className="app">
      <ToastContainer />
      {!account ? (
        <ConnectWalletButton setAccount={setAccount} />  //没有账号 显示连接账户按钮
      ) : (
        <div className="contract-interactions">
          <ContractInfo account={account} address={CONTRACT_ADDRESS} />
          <ContractActions />
        </div>
      )}
    </div>
  )
}

export default App
