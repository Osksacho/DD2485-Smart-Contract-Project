import { ethers } from 'ethers';

function getAlias(address) {
    return "";
}

class UserData {
    constructor(username, image) {
        this.username = username;
        this.image = image;
    }
}

class Thread {
    constructor(id, subject, op) {
        this.id = id;
        this.subject = subject;
        this.op = op;
        this.comments = [];
        this.username = getAlias(op);
    }
}

class Comment {
    constructor(text, address) {
        this.comment = text;
        this.address = address;
        this.alias = getAlias(address);
    }

}

class Model {
    constructor() {
        this.userData = new UserData(null, null);
        this.threads = [];
        this.currentThreadId = -1;
        this.currentThreadComments = [];

        if (!window.ethereum) {
            console.error("No ethereum provider available")
        }


        this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        this.contractABI = [
            {
              "inputs": [
                {
                  "internalType": "uint64",
                  "name": "_threadId",
                  "type": "uint64"
                },
                {
                  "internalType": "bytes32",
                  "name": "_commentLink",
                  "type": "bytes32"
                }
              ],
              "name": "addComment",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "_subject",
                  "type": "string"
                }
              ],
              "name": "addThread",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "bytes32",
                  "name": "ipfsImageRef",
                  "type": "bytes32"
                }
              ],
              "name": "createUserData",
              "outputs": [],
              "stateMutability": "nonpayable",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint64",
                  "name": "_threadId",
                  "type": "uint64"
                }
              ],
              "name": "getComments",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "address",
                      "name": "poster",
                      "type": "address"
                    },
                    {
                      "internalType": "bytes32",
                      "name": "commentLink",
                      "type": "bytes32"
                    }
                  ],
                  "internalType": "struct BlockThoughts.Comment[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [],
              "name": "getThreads",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "uint64",
                      "name": "id",
                      "type": "uint64"
                    },
                    {
                      "internalType": "string",
                      "name": "subject",
                      "type": "string"
                    },
                    {
                      "internalType": "address",
                      "name": "poster",
                      "type": "address"
                    }
                  ],
                  "internalType": "struct BlockThoughts.ThreadInfo[]",
                  "name": "",
                  "type": "tuple[]"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "adr",
                  "type": "address"
                }
              ],
              "name": "getUserData",
              "outputs": [
                {
                  "components": [
                    {
                      "internalType": "string",
                      "name": "username",
                      "type": "string"
                    },
                    {
                      "internalType": "bytes32",
                      "name": "ipfsImageRef",
                      "type": "bytes32"
                    }
                  ],
                  "internalType": "struct BlockThoughts.UserData",
                  "name": "",
                  "type": "tuple"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "userAddresses",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "address",
                  "name": "",
                  "type": "address"
                }
              ],
              "name": "usersData",
              "outputs": [
                {
                  "internalType": "string",
                  "name": "username",
                  "type": "string"
                },
                {
                  "internalType": "bytes32",
                  "name": "ipfsImageRef",
                  "type": "bytes32"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            }
          ]
        
        // Just for tests
        const test = ["This is a thread"
            , "I am a cool dude"
            , "Wow, you can have really long names in the name of the name thing nice."
            , "some more thread"
            , "fuck"
            , "ok hwat is this place"]

        function strToThread(str) {
            return new Thread(1, str);
        }

        this.threads = test.map(strToThread);
        
    }

    async getUserAddressAndData() {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);
                const userData = await contract.getUserData(userAddress);
                this.userData.username = userData.username;
                console.log('User Data:', this.userData);
            } else {
                console.error('No accounts found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    async createUserData(username) {
        const ipfsImageRef = ethers.utils.formatBytes32String('ipfsHash')

        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).createUserData(username, ipfsImageRef);
            await tx.wait();

            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    submitUserData(username, image) {
        this.createUserData(username)
        this.userData.username = username;
    }

    /*async getThreads() {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []); // Request access to MetaMask
      const signer = provider.getSigner();
     // Placeholder
  
      const contract = new ethers.Contract(this.contractAddress, this.contractABI, signer);
  
      try {
        const threadsData = await contract.getThreads();
        this.threads = threadsData.map(thread => new Thread(thread.id, thread.subject, thread.poster));
      } catch (error) {
        console.error("Error fetching threads:", error);
      }
    }
    */

    getAlias(address) {
        return "";
    }

    getThreads() {
        return [];
    }

    getComment(ipfsHash, address) {

        // GET Text from ipfs
        const text = "";



        return new Comment();
    }

    getComments(threadId) {
        // GET array of comments from contract
        const contractComments = [];

        const comments = contractComments.map(this.getComment);


    }
}

export default Model;