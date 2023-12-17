import { ethers } from 'ethers';
import { ref } from 'vue';
import { create } from 'ipfs-http-client';
import bs58 from 'bs58'
import { Buffer } from 'buffer';

let nullBytes32 = "0x" + "0".repeat(64);

class UserData {
    constructor(username, image) {
        this.username = username;
        this.image = image;
    }
}
function BlockChainTimeToJSDate(time) {
    return new Date(time.toNumber() * 1000);
}

function bytes32ToIpfsCid(bytes32) {
    // Ensure bytes32 starts with '0x' and is 66 characters long (64 hex + '0x')
    if (!bytes32.startsWith('0x') || bytes32.length !== 66 || bytes32 == nullBytes32) {
        return "";
    }

   // Convert bytes32 hex string to a Buffer
    const buffer = ethers.utils.arrayify(bytes32);

    // Add the multihash prefix for SHA-256 (0x12 for SHA-256, 0x20 for 32 bytes)
    const multihash = Buffer.concat([Buffer.from([0x12, 0x20]), buffer]);

    // Encode the Buffer to Base58 for CIDv0
    return bs58.encode(multihash);
}

function cidToBytes32(cid) {
    // Decode Base58 CID (for CID v0)
    if (cid == "")
      return nullBytes32;

    // Decode CIDv0 from Base58
    const decoded = bs58.decode(cid);

    // Extract the SHA-256 hash (32 bytes, skipping the multihash prefix)
    const hash = decoded.slice(2); // Assuming the multihash prefix is 2 bytes
    return ethers.utils.hexlify(hash).padEnd(66, '0');
    return '0x' + hash.toString('hex');
}


class Thread {
    constructor(id, subject, time, username, ipfsImageBytes32 = nullBytes32) {
        this.id = parseInt(id);
        this.subject = subject;
        this.time = BlockChainTimeToJSDate(time).toLocaleString();
        this.comments = [];
        this.username = !username ? "Unknown" : username;
        this.ipfsImageCid = bytes32ToIpfsCid(ipfsImageBytes32);
    }
}

class Comment {
    constructor(text, time, username, ipfsImageBytes32 = nullBytes32) {
        this.text = text;
        this.time = BlockChainTimeToJSDate(time).toLocaleString();
        this.username = !username ? "Unknown" : username;
        this.ipfsImageCid = bytes32ToIpfsCid(ipfsImageBytes32);
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
            return new Thread(threadFromContract.id, threadFromContract.subject, threadFromContract.time, userdata.username, threadFromContract.ipfsImageRef);
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
            console.log(this.threads);
        } catch (error) {
            console.error('Error fetching thread data:', error);
        }
    }

    async addThread(subject, file) {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }
            let cid = "";
            if (file != null) {
                const added = await this.ipfs.add(file);
                cid = added.cid.toString();
            }
            const cidBytes = cidToBytes32(cid);
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).addThread(subject, cidBytes);
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
            return new Comment(commentFromContract.value, commentFromContract.time, userdata.username, commentFromContract.ipfsImageRef);
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

    async addComment(comment, file) {
        try {
            if (!window.ethereum) {
                throw "No ethereum provider available";
            }

            let cid = "";
            if (file != null) {
                const added = await this.ipfs.add(file);
                cid = added.cid.toString();
            }
            const cidBytes = cidToBytes32(cid);

            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(this.contractAddress, this.contractABI, provider);

            const signer = provider.getSigner();
            const tx = await contract.connect(signer).addComment(this.selectedThreadId, comment, cidBytes);
            await tx.wait();
            await this.getComments();
            console.log('Transaction hash:', tx.hash);
        } catch (error) {
            console.error('Error:', error);
        }
    }
}

export default Model;