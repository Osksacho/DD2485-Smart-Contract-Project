pragma solidity ^0.8.19;

/// @title BlockThoughts
/// @author Oskar Svanström & Felix Qvarfordt
contract BlockThoughts {
    struct UserData {
        string username;
        bytes32 ipfsImageRef;
    }
    
	struct Comment {
		address poster;
        uint time;
        string value;
	}
	
	struct FullComment {
		address poster;
        uint time;
        string value;
		bytes32 ipfsImageRef;
	}
	
	struct ThreadInfo {
		uint64 id;
        string subject;
        uint time;
		address poster;
	}

	struct Thread {
		uint64 id;
        string subject;
        uint time;
		address poster;
		bytes32 ipfsImageRef;
	}

    mapping(uint => ThreadInfo) public threads;
	mapping(uint => Comment[]) public threadComments;
    mapping(address => UserData) public usersData;
    mapping(string => bool) private usernameExists;
	mapping(uint => bytes32) public threadImage;
	mapping(uint => bytes32) public commentImage;
	
    uint64 threadCounter;


    /// @notice Add a thread. The poster will be the sender address.
    /// @param subject The subject of the thread.
    /// @param cid Content id to ipfs image
    function addThread(string memory subject, bytes32 cid) public {
        require(bytes(subject).length > 0, "Thread must have a subject.");
        
        ThreadInfo memory newThreadInfo = ThreadInfo({
            id: threadCounter,
            subject: subject,
            time: block.timestamp,
            poster: msg.sender
        });
		
		if (cid != bytes32(0)) {
			threadImage[threadCounter] = cid;
		}
        
        // The comments array is automatically initialized as an empty array in storage
        threads[threadCounter] = newThreadInfo;
        threadCounter++;

        if(threadCounter == 1){
            addComment(0, "You made the first comment! Have this: \xf0\x9f\xa5\x9a", bytes32(0));
        }
    }

    /// @notice Get all threads.
    /// @return Array of ThreadInfo (id, subject, poster)
    function getThreads() public view returns (Thread[] memory) {
		Thread[] memory infos = new Thread[](threadCounter);

		for (uint64 i = 0; i < threadCounter; i++) {
			infos[i].id = threads[i].id;
			infos[i].subject = threads[i].subject;
			infos[i].time = threads[i].time;
			infos[i].poster = threads[i].poster;
			
			if (threadImage[i] != bytes32(0)) {
				infos[i].ipfsImageRef = threadImage[i];
			}
		}

		return infos;
	}

    /// @notice Add a comment. The poster will be the sender address.
    /// @param threadId The id of the thread.
    /// @param value content of the comment.
    /// @param cid Content id to ipfs image
    function addComment(uint64 threadId, string memory value, bytes32 cid) public {
        require(threadId < threadCounter, "Invalid thread id.");
        
        Comment memory newComment = Comment({
            poster: msg.sender,
            time: block.timestamp,
            value: value
        });
		
		if (cid != bytes32(0)) {
			uint id = threadComments[threadId].length;
			commentImage[id] = cid;
		}
	
        threadComments[threadId].push(newComment);
    }

    /// @notice Get all comments for a thread with id.
    /// @param threadId The id of the thread. Can fetch this with getThreads()
    /// @return Array of Comments (poster, time, value)
    function getComments (uint64 threadId) public view returns (FullComment[] memory) {
        require(threadId < threadCounter, "Invalid thread id.");
		
		uint length = threadComments[threadId].length;
		FullComment[] memory comments = new FullComment[](length);

		for (uint i = 0; i < length; i++) {
			comments[i].value = threadComments[threadId][i].value;
			comments[i].time = threadComments[threadId][i].time;
			comments[i].poster = threadComments[threadId][i].poster;
			
			if (commentImage[i] != bytes32(0)) {
				comments[i].ipfsImageRef = commentImage[i];
			}
		}

		return comments;
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