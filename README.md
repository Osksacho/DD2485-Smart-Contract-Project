# BlockThoughts
BlockThoughts is a chat forum service. A user can add their username, post threads and comment on other peoples threads. BlockThoughts is decentralized and data is stored on a blockchain. Specifically, the protocol is written in Solidity and can run on Ethereum, however it is not deployed on mainnet yet. The repo contains a guide for deploying locally and hosting an example website to show how the protocol could be used in practice.

There have been many implementations of decentralized chat forums using peer-to-peer networks such as https://retroshare.cc/ and https://getaether.net/. However, a decentralized chat forum on a blockchain network has yet to be practically implemented. This is likely due to a variety of issues regarding gas fees and scalability.
## Deploy locally

Start by cloning the repository and install all dependencies 

```
git clone git@github.com:Osksacho/DD2485-Smart-Contract-Project.git
npm install
```


Now you can start a local blockchain using
```
npx hardhat node
```

In another terminal you can now compile and deploy the contract with the command (use network-name "localhost" to deploy on local blockchain).
```
npx hardhat compile
npx hardhat run scripts/deploy.js --network [network-name]
```

## Tests and code coverage

You can run the tests and get a coverage report of 100% by using

```
npx hardhat coverage
```

## Host website locally
There are a few extra steps here. First, to host the site locally you can go inte blockthoughts-site folder and
```
npm run dev
```

To interact with the local blockchain you will need to have metamask installed in your browser and add your localhost as the blockchain network

![image](https://github.com/Osksacho/DD2485-Smart-Contract-Project/assets/65446534/6f42c7d4-cd02-49aa-addb-1506ba5dde97)

You will also need to copy one of the private keys of an address generated by the local hardhat chain and create an account on metamask. This account will be given 10000 ETH by default.

![image](https://github.com/Osksacho/DD2485-Smart-Contract-Project/assets/65446534/92e9ce96-b08a-4048-b0e1-56ca9ea06409)

Finally, make sure that the contract address on the local blockchain is correctly specified in model.js. The ABI should be up to date.

![image](https://github.com/Osksacho/DD2485-Smart-Contract-Project/assets/65446534/2ba43628-3b33-4b44-b3ab-e68cf16593cd)

Now you should be able to enter the site on http://127.0.0.1:5173/. Metamask will prompt you to allow access from the site.

## Potential error
When signing a transaction, you might get an RPC error. This often happens after restarting the hardhat network. Fix this error by clearing activity in Metamask (clearing browser cache might also work)

![image](https://github.com/Osksacho/DD2485-Smart-Contract-Project/assets/65446534/d077b6a3-c8f3-45d3-8997-277637df8eac)

