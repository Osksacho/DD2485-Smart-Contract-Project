import { ethers } from 'ethers';
import { ref } from 'vue';
import { create } from 'ipfs-http-client';

class UserData {
    constructor(username, image) {
        this.username = username;
        this.image = image;
    }
}
function BlockChainTimeToJSDate(time) {
    return new Date(time.toNumber() * 1000);
}

class Thread {
    constructor(id, subject, time, username) {
        this.id = parseInt(id);
        this.subject = subject;
        this.time = BlockChainTimeToJSDate(time).toLocaleString();
        this.comments = [];
        this.username = !username ? "Unknown" : username;
    }
}

class Comment {
    constructor(text, time, username, ipfsImageCid = "") {
        this.text = text;
        this.time = BlockChainTimeToJSDate(time).toLocaleString();
        this.username = !username ? "Unknown" : username;
        this.ipfsImageCid = ipfsImageCid;
    }

}

class Model {
    constructor() {
        // IPFS 
        try {
            this.ipfs = create({ host: 'localhost', port: '5001', protocol: 'http' });
        } catch (error) {
            console.error('Failed to connect to IPFS:', error);
            this.ipfs = null;
        }

        this.userData = ref(new UserData(null, null));
        this.threads = ref([]);
        this.selectedThreadId = ref(-1); // -1 means no thread selected
        this.currentThreadComments = ref([]);

        this.contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';
        this.contractABI = [
    {
      "inputs": [
        {
          "internalType": "uint64",
          "name": "threadId",
          "type": "uint64"
        },
        {
          "internalType": "string",
          "name": "value",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "cid",
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
          "name": "subject",
          "type": "string"
        },
        {
          "internalType": "bytes32",
          "name": "cid",
          "type": "bytes32"
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
          "name": "threadId",
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
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "string",
              "name": "value",
              "type": "string"
            },
            {
              "internalType": "bytes32",
              "name": "ipfsImageRef",
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
              "internalType": "uint256",
              "name": "time",
              "type": "uint256"
            },
            {
              "internalType": "bytes32",
              "name": "ipfsImageRef",
              "type": "bytes32"
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
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        },
        {
          "internalType": "string",
          "name": "value",
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
          "internalType": "uint256",
          "name": "time",
          "type": "uint256"
        },
        {
          "internalType": "bytes32",
          "name": "ipfsImageRef",
          "type": "bytes32"
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
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

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

    async getUserData(userAddress) {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

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
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).createUserData(username, ipfsImageRef);
            await tx.wait();

            this.userData.username = username;
            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async convertThread(threadFromContract) {
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
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

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

    async addThread(subject, file) {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }
            
            const cid = "";
            if (file != null) {
                const added = await this.ipfs.add(file);
                cid = added.cid.toString();
                console.log("ADDED CID: ", cid);
            }

            const ipfsImageRef = ethers.utils.formatBytes32String(cid);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).addThread(subject, ipfsImageRef);
            await tx.wait();
            await this.getThreads();
            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async convertComment(commentFromContract) {
        try {
            const userdata = await this.getUserData(commentFromContract.poster);
            return new Comment(commentFromContract.value, commentFromContract.time, userdata.username);
        } catch (error) {
            console.error('Error converting comment:', error);
            return null;
        }
    }

    async getComments() {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);
            const comments = await contract.getComments(this.selectedThreadId);

            const commentsPromises = comments.map(comment => this.convertComment(comment));
            this.currentThreadComments = await Promise.all(commentsPromises);
            console.log('Comment Data:', this.currentThreadComments);
        } catch (error) {
            console.error('Error fetching thread data:', error);
        }
    }

    async addComment(comment) {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).addComment(this.selectedThreadId, comment);
            await tx.wait();
            await this.getComments();
            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export default Model;