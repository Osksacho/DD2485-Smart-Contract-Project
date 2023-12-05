# DD2485-Smart-Contract-Project
Concept: As a group of two, you scope, design, and implement a smart contract protocol. You choose a smart contract language of your choice. A DApp/UX is welcome but not mandatory. You present the protocol for 30 minutes (15 min presentation + 15 min questions) during the Smart Contract Grand Oral on December 18, 2023. 

The protocol proposal must be done through a pull-request before Nov 15, sunset in Stockholm.

|                                             | Yes | No | 
|-------------------------------------------- | ----|----|
|github: The protocol is hosted on GitHub, publicly available. The GitHub repository must have a root README file. | Mandatory | - | 
|tested: The protocol can be automatically executed from a test suite | Mandatory | - | 
|documented: The usage of the protocol is well documented | Mandatory | - | 
|timing: The length of the presentation is 15 minutes (hard limit)  | Mandatory | - |
|motivation: The protocol is clearly motivated | Yes | No | 
|background: The README gives enough background | Yes | No | 
|tech: The presentation focuses on the technical aspects of the protocol | Yes | No | 
|original: The protocol is original, the README discusses closely related work  | Yes | No |
|well-structured: the structure of the presentation is announced and graphically visible | Yes | No |
|code: The presentation contains valuable and readable code snippets | Yes | No |
|reflection: The presentation contains a reflective part  | Yes | No |
|sota: There is one good slide positioning the presentation in the state of the art| Yes | No |
|take-home: The last slide contains a good and concise take-home message | Yes | No |
|engagement: The speakers engage with the audience | Yes | No  |
|humour: The speakers are fun, have humour or the protocol contains an Easter egg | Yes | No |
|readable slides: The slides do not have too much text  | Yes | No |
|(BONUS) verification: the procotol contains some verification beyond testing (mutation testing with Gambit, formal verification) | Yes | No |
|(BONUS) perfect testing: the protocol has 100% statement coverage | Yes | No |
|(BONUS) fuzzing/symbolic execution: the protocol has a harness for fuzzing or [symbolic execution](https://twitter.com/trailofbits/status/1223386823084384256) | Yes | No |
|(BONUS) outreach: the students outreach to the crypto world about their protocol | Yes | No |
|(BONUS) real-world: the protocol is deployed on mainnet and IPFS | Yes | No |
|(BONUS) DApp/UX: the protocol contains user interface application | Yes | No |



## How to test

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
