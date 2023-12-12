
class UserData {
    constructor(username, image){
        this.username = username;
        this.image = image;
    }
}

class Thread {
  constructor(username, subject) {
    this.username = username;
    this.subject = subject;
  }
}

class Model {
  constructor() {  
    this.key = 0;
    this.userData = new UserData(null, null);
    this.threads = [];
    this.currentThreadId = -1;
    this.currentThreadComments = [];

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

   // Placeholder
   submitUserData(username, image){
    this.userData.username = username;
    this.userData.image = image;

    console.log(username);
   }

   getThreads() {
    return [];
   }

   getComment(ipfsHash) {

   }

   getComments(threadId) {
    
   }
}

export default Model;