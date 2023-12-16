pragma solidity ^0.8.9;

/// @title BlockThoughts
/// @author Oskar Svanström & Felix Qvarfordt
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

    /// @notice Add a thread. The poster will be the sender address.
    /// @param subject The subject of the thread.
    /// @param time The posting time of the thread (iso string format)
    function addThread(string memory subject, string memory time) public {
        require(bytes(subject).length > 0, "Thread must have a subject.");
        
        ThreadInfo memory newThreadInfo = ThreadInfo({
            id: threadCounter,
            subject: subject,
            time: time,
            poster: msg.sender
        });
        
        // The comments array is automatically initialized as an empty array in storage
        threads[threadCounter] = newThreadInfo;
        threadCounter++;
    }
    
    /// @notice Get all threads.
    /// @return Array of ThreadInfo (id, subject, time, poster)
    function getThreads() public view returns (ThreadInfo[] memory) {
		ThreadInfo[] memory infos = new ThreadInfo[](threadCounter);

		for (uint64 i = 0; i < threadCounter; i++) {
			infos[i] = threads[i];
		}

		return infos;
	}

    /// @notice Add a comment. The poster will be the sender address.
    /// @param threadId The id of the thread.
    /// @param value content of the comment.
    /// @param time The time of the comment (iso string format)
    function addComment(uint64 threadId, string memory value, string memory time) public {
        require(threadId < threadCounter, "Invalid thread id.");
        
        Comment memory newComment = Comment({
            poster: msg.sender,
            time: time,
            value: value
        });
        
        threadComments[threadId].push(newComment);
    }

    /// @notice Get all comments for a thread with id.
    /// @param threadId The id of the thread. Can fetch this with getThreads()
    /// @return Array of Comments (poster, time, value)
    function getComments (uint64 threadId) public view returns (Comment[] memory) {
        require(threadId < threadCounter, "Invalid thread id.");
		return threadComments[threadId];
    }

    /// @notice Get address user data, returns empty data if not defined.
    /// @param adr The Ethereum address corresponding to the user data to retrieve
    /// @return UserData The user data (username, ipfsImageRef)
    function getUserData(address adr) public view returns(UserData memory) {
        return usersData[adr];
    }

    /// @notice Creates user data for the sender address. Can only call this once.
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