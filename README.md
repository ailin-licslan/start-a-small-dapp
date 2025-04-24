# Start-A-Small-Dapp

#### This project demonstrates a basic Hardhat use case. It comes with a sample contract,

#### a test for that contract, and a Hardhat Ignition module that deploys that contract.

#### build solidity contract using hardhat

#### compile smart contract use hardhat

#### test contract using test unit

#### set up react application to connect it with smart contract

#### deploy solidity code test it with metamask

#### contract-part is to store smart contract

```shell
cd contract-part npm init -t set up package

npm install --save-dev hardhat

npx hardhat init

npm install --save-dev prettier (if you need to)

npx hardhat compile (generate the artifacts[abi here] and cahe dir)

npx hardhat test , npx hardhat coverage

#### Let's build our web part by
npx create-react-app web-part

cd web-part npm install --save ethers && npm install --save react-toastify
```

```shell
//Init project
npx hardhat init

//Test
npx hardhat test   &  npx hardhat coverage

//Compile after a change,  genreate abi
npx hardhat compile

//Start node
npx hardhat node

//Make sure that ./ignition/parameters.json has the correct params

//Deploy
npx hardhat ignition deploy ./ignition/modules/Lock.ts --network localhost --parameters ./ignition/parameters.json

//Copy ./artifacts/contracts/Lock.sol/Lock.json abi list to client/src/utils/Lock_ABI.json

//Copy deployed address to client/src/utils/constants.js


//front end
npx create-react-app  web-part

npm install --save ethers
```
