# Hardhat_boilerplate

> It is just a boilerplate setup for hardhat,for writing upgradeable smart contracts.

## Usage

Install dependencies

```bash
npm install
```

### Customize .env file

Give your account mnemonic in TESTNET_MNEMONIC \
Give your etherscan api key for rinkeby in ETHERSCAN_API_FOR_RINKEBY. You can create it from [here](https://etherscan.io/). Its important for verification. \
Give your alchemy api key in ALCHEMY_API_KEY.Get it from [here](https://auth.alchemyapi.io/).\
Give your ethersacn api key for bscscan in ETHERSCAN_API_FOR_TESTNET. You can create it from [here](https://bscscan.com/myapikey). Its important for verification.

## Gas Reporter

Gas reporter can be enabled or disabled by setting gasReporter to true or false in hardhat.config.ts.

## Compile

```bash
npx hardhat compile
```

## Run tests

```bash
npx hardhat test
```

## Clean artifacts and cache

```bash
npx hardhat clean
```

## Deploy script

### For rinkeby

```bash
npx hardhat run --network rinkeby  scripts/deploy.ts
```

### For bscscan

```bash
npx hardhat run --network testnet  scripts/deploy.ts
```

### For local

```bash
npx hardhat run --network localhost  scripts/deploy.ts
```

### For others you can refer hardhat docs [here](https://forum.openzeppelin.com/t/verify-smart-contract-inheriting-from-openzeppelin-contracts/4119)

## Verify script

Replace the address with your deployed contract,replace constructor arguments with your contract constructor arguments,then in contracts give the path to your main solidity file and then your contract name in verify.ts file.

Note : Make sure to run the verify script after 2min of deployment either you can get an error.

### For bscscan

```bash
npx hardhat run --network testnet  scripts/verify.ts
```

### For rinkeby

```bash
npx hardhat run --network rinkeby  scripts/verify.ts
```
