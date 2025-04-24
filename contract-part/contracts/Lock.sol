// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.28;

// Uncomment this line to use console.log
// import "hardhat/console.sol";

contract Lock {

    //解除锁定时间
    uint public unlockTime;
    //合约拥有者（合约首次部署者）
    address payable public owner;

    //取款事件  amount: 取多少  when: 什么时间 
    event Withdrawal(uint amount, uint when);

    //构造方法 只执行一次  部署时执行
    constructor(uint _unlockTime) payable {

        //时间约束 判断是否到了解除时间  check to see if the current time is less than the unlock time 
        require(
            block.timestamp < _unlockTime,
            "Unlock time should be in the future"
        );

        unlockTime = _unlockTime;
        //存多少钱  
        owner = payable(msg.sender);
    }

    //取款 时间
    function withdraw() public {

        // when the user tiggers the withdraw function we need to check the two things
        // Uncomment this line, and the import of "hardhat/console.sol", to print a log in your terminal
        // console.log("Unlock time is %o and block timestamp is %o", unlockTime, block.timestamp);

        require(block.timestamp >= unlockTime, "You can't withdraw yet");
        require(msg.sender == owner, "You aren't the owner");

        //发射取款事件 
        emit Withdrawal(address(this).balance, block.timestamp);
        //将余额转到合约拥有者账户
        owner.transfer(address(this).balance);
    }
}
