pragma solidity ^0.8.9;

contract BlockThoughts {
    struct UserData {
        string username;
        bytes32 ipfsImageRef;
    }
    
	struct Comment {
		address poster;
        string time;
        string value;
	}
	
	struct ThreadInfo {
		uint64 id;
        string subject;
        string time;
		address poster;
	}

    mapping(uint64 => ThreadInfo) public threads;
	mapping(uint64 => Comment[]) public threadComments;
    mapping(address => UserData) public usersData;
    mapping(string => bool) private usernameExists;
	
    uint64 threadCounter;


    constructor() {
        addThread("First Thread Subject", "2023-12-01T10:30:00Z");
        addThread("Second Thread Subject", "2023-12-02T15:45:00Z");
    }

    /// @param _subject The subject of the thread.
    function addThread(string memory _subject, string memory _time) public {
        require(bytes(_subject).length > 0, "Thread must have a subject.");
        
        ThreadInfo memory newThreadInfo = ThreadInfo({
            id: threadCounter,
            subject: _subject,
            time: _time,
            poster: msg.sender
        });
        
        // The comments array is automatically initialized as an empty array in storage
        threads[threadCounter] = newThreadInfo;
        threadCounter++;
    }

    function addComment(uint64 _threadId, string memory _value, string memory _time) public {
        require(_threadId < threadCounter, "Invalid thread id.");
        
        Comment memory newComment = Comment({
            poster: msg.sender,
            time: _time,
            value: _value
        });
        
        threadComments[_threadId].push(newComment);
    }

    function getThreads() public view returns (ThreadInfo[] memory) {
		ThreadInfo[] memory infos = new ThreadInfo[](threadCounter);

		for (uint64 i = 0; i < threadCounter; i++) {
			infos[i] = threads[i];
		}

		return infos;
	}

    function getComments (uint64 _threadId) public view returns (Comment[] memory) {
        require(_threadId < threadCounter, "Invalid thread id.");
		return threadComments[_threadId];
    }

    /// @param adr The Ethereum address corresponding to the user data to retrieve
    /// @return UserData The user data (username and ipfsImageRef)
    function getUserData(address adr) public view returns(UserData memory) {
        return usersData[adr];
    }

    /// @param username The username of the user being created
    /// @param ipfsImageRef The IPFS hash reference for the user's image
    function createUserData(string memory username, bytes32 ipfsImageRef) public {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(!usernameExists[username], "Username already exists");
        
        UserData memory newUser = UserData(username, ipfsImageRef);
        usersData[msg.sender] = newUser;
        usernameExists[username] = true;
    }

}