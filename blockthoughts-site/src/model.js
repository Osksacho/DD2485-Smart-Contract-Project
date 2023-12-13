import { ethers } from 'ethers';
import { ref } from 'vue';

class UserData {
    constructor(username, image) {
        this.username = username;
        this.image = image;
    }
}

class Thread {
    constructor(id, subject, time, username) {
        this.id = id;
        this.subject = subject;
        this.time = new Date(time).toLocaleString();
        this.comments = [];
        this.username = username;
    }
}

class Comment {
    constructor(text, time, address) {
        this.comment = text;
        this.time = new Date(time).toLocaleString();
        this.address = address;
    }

}

class Model {
    constructor() {
        this.userData = ref(new UserData(null, null));
        this.threads = ref([]);
        this.selectedThreadId = ref(-1); // -1 means no thread selected
        this.currentThreadComments = ref([]);;

        if (!window.ethereum) {
            console.error("No ethereum provider available")
        }


        this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        this.contractABI = [
            {
              "inputs": [],
              "stateMutability": "nonpayable",
              "type": "constructor"
            },
            {
              "inputs": [
                {
                  "internalType": "uint64",
                  "name": "_threadId",
                  "type": "uint64"
                },
                {
                  "internalType": "string",
                  "name": "_value",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "_time",
                  "type": "string"
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
                },
                {
                  "internalType": "string",
                  "name": "_time",
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
                      "internalType": "string",
                      "name": "time",
                      "type": "string"
                    },
                    {
                      "internalType": "string",
                      "name": "value",
                      "type": "string"
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
                      "internalType": "string",
                      "name": "time",
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
                  "internalType": "uint64",
                  "name": "",
                  "type": "uint64"
                },
                {
                  "internalType": "uint256",
                  "name": "",
                  "type": "uint256"
                }
              ],
              "name": "threadComments",
              "outputs": [
                {
                  "internalType": "address",
                  "name": "poster",
                  "type": "address"
                },
                {
                  "internalType": "string",
                  "name": "time",
                  "type": "string"
                },
                {
                  "internalType": "string",
                  "name": "value",
                  "type": "string"
                }
              ],
              "stateMutability": "view",
              "type": "function"
            },
            {
              "inputs": [
                {
                  "internalType": "uint64",
                  "name": "",
                  "type": "uint64"
                }
              ],
              "name": "threads",
              "outputs": [
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
                  "internalType": "string",
                  "name": "time",
                  "type": "string"
                },
                {
                  "internalType": "address",
                  "name": "poster",
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

        
    }

    async getClientAddressAndUpdateUserData() {
        try {
            const accounts = await window.ethereum.request({
                method: 'eth_requestAccounts',
            });

            if (accounts.length > 0) {
                const userAddress = accounts[0];
                const userData = await this.getUserData(userAddress);
                this.userData.username = userData.username;
            } else {
                console.error('No accounts found.');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    async getUserData(userAddress){
        try {
                const provider = new ethers.providers.Web3Provider(window.ethereum);
                const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);
                const userData = await contract.getUserData(userAddress);
                console.log('User Data:', userData);
                return userData;
        } catch (error) {
            console.error('Error fetching user data:', error);
            return new UserData("", "");
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

    async convertThread(threadFromContract){
        try {
            const userdata = await this.getUserData(threadFromContract.poster);
            return new Thread(threadFromContract.id, threadFromContract.subject, threadFromContract.time, userdata.username);
        } catch (error) {
            console.error('Error converting thread:', error);
            return null;
        }
    }

    async getThreads() {
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);
            const threads = await contract.getThreads();
            
            const threadPromises = threads.map(thread => this.convertThread(thread));
            this.threads = await Promise.all(threadPromises);
            console.log('Thread Data:', this.threads);
        } catch (error) {
            console.error('Error fetching thread data:', error);
        }
    }

    async addThread(subject){
        try {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const time = new Date().toISOString();
            const signer = provider.getSigner();
            const tx = await contract.connect(signer).addThread(subject, time);
            await tx.wait();
            await this.getThreads();
            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }

}

export default Model;