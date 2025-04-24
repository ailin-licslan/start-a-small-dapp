// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

import {console} from "hardhat/console.sol";

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {

    //解除锁定时间
    uint public unlockTime;
    //合约拥有者（合约首次部署者）
    address payable public owner;

    //取款事件  amount: 取多少  when: 什么时间 
    event Withdrawal(uint amount, uint when);
    //存款事件  from:来自哪个地址 amount: 存多少  when: 什么时间
    event Deposit(address indexed from, uint amount, uint when);

    //构造方法 只执行一次  部署时执行
    constructor(uint _unlockTime) payable {

        //时间约束 判断是否到了解除时间  check to see if the current time is less than the unlock time 
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        console.log("_unlockTime is:", _unlockTime);
        console.log("msg.sender is:", msg.sender);
        unlockTime = _unlockTime;
        //存多少钱  
        owner = payable(msg.sender);

        console.log("contract address is same as msg.sender the first time to deploay contract: ", msg.sender);
    }


//  console.log:
//     _unlockTime is: 1745474035
//     msg.sender is: 0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266
//     contract address is same as msg.sender the first time to deploay contract:  0xf39fd6e51aad88f6f4ce6ab8827279cfffb92266

    //取款 时间
    function withdraw() public {

        // when the user tiggers the withdraw function we need to check the two things
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        console.log("msg.sender is:", msg.sender);
        console.log("owner is:", owner);
        require(msg.sender == owner, "You aren't the owner");

        //发射取款事件 
        emit Withdrawal(address(this).balance, block.timestamp);
        //将余额转到合约拥有者账户
        owner.transfer(address(this).balance);
    }

    //存款
    function deposit() public payable {

        
        
        //要存的金额必须大于0
        require(msg.value > 0, "Deposit amount must be greater than zero");
        console.log("msg.value :", msg.value);

        emit Deposit(msg.sender, msg.value, block.timestamp);
    }

    //lock time is 2025-04-24 12:35:10  1745469310
}
