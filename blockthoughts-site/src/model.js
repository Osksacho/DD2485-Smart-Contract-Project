
class Thread {
  constructor(id, subject) {
    this.id = id;
    this.subject = subject;
  }
}

class Model {
  constructor() {  
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


   getThreads() {
    return [];
   }

   getComment(ipfsHash) {

   }

   getComments(threadId) {
    
   }
}

export default Model;