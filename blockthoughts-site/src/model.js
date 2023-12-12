
class UserData {
    constructor(username, image){
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
    this.username = get_alias(op);
  }
}

class Comment {
  constructor (text, address) {
    this.comment = text;
    this.address = address;
    this.alias = get_alias(address);
  }

}

class Model {
  constructor() {  
    this.key = 0;
    this.userData = new UserData(null, null);
    this.threads = [];
    this.currentThreadId = -1;
    this.currentThreadComments = [];

    this.contractABI = ""/* Your Contract ABI */;
    this.contractAddress = ""/* Your Contract Address */;
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
    // Just for tests
  }

  submitUserData(username, image){
    this.userData.username = username;
    this.userData.image = image;

    console.log(username);
  }

  async getThreads() {
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

  get_alias(address) {
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