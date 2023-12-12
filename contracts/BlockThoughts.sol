pragma solidity ^0.8.9;

contract BlockThoughts {
    struct UserData {
        string username;
        bytes32 ipfsImageRef;
    }
    
	struct Comment {
		address poster;
		bytes32 commentLink;
	}
	
	struct ThreadInfo {
		uint64 id;
        string subject;
		address poster;
	}
	
    struct Thread {
		ThreadInfo info;
        Comment[] comments;
	}

    mapping(address => UserData) public usersData;
    address[] public userAddresses;
    uint64 threadCounter;
	Thread[] threads;
	
    function addThread(string memory _subject) public {
		require(bytes(_subject).length > 0, "Thread must have a subject.");

		ThreadInfo memory newThreadInfo = ThreadInfo({
			id: threadCounter,
			subject: _subject,
			poster: msg.sender
		});

		// Push an empty thread and then initialize its fields
		threads.push();
		Thread storage newThread = threads[threads.length - 1];
		newThread.info = newThreadInfo;
		// The comments array is automatically initialized as an empty array in storage

		threadCounter++;
	}

    function addComment(uint64 _threadId, bytes32 _commentLink) public {
		require(_threadId < threadCounter, "Invalid thread id.");

		Thread storage thread = threads[_threadId];

		Comment memory newComment = Comment({
			poster: msg.sender,
			commentLink: _commentLink
		});

		thread.comments.push(newComment);
	}

    function getThreads() public view returns (ThreadInfo[] memory) {
		ThreadInfo[] memory infos = new ThreadInfo[](threadCounter);

		for (uint64 i = 0; i < threadCounter; i++) {
			infos[i] = threads[i].info;
		}

		return infos;
	}

    function getComments (uint64 _threadId) public view returns (Comment[] memory) {
        require(_threadId < threadCounter, "Invalid thread id.");
		return threads[_threadId].comments;
    }



    /// @notice Retrieves user data from an Ethereum address, or empty userdata if user does not exist
    /// @dev This function returns the user data associated with the provided address
    /// @param adr The Ethereum address for which data is being retrieved
    /// @return UserData The user data (username and ipfsImageRef)
    function getUserData(address adr) public view returns(UserData memory) {
        return usersData[adr];
    }

    /// @notice Create user data associating username and IPFS image reference with sender's address
    /// @dev This function creates user data using the provided username and IPFS image reference
    /// @param username The username of the user being created
    /// @param ipfsImageRef The IPFS hash reference for the user's image
    function createUserData(string memory username, bytes32 ipfsImageRef) public {
        require(bytes(username).length > 0, "Username cannot be empty");
        require(_canCreateUserData(username), "Username or address already exists");

        UserData memory newUser = UserData(username, ipfsImageRef);
        usersData[msg.sender] = newUser;
        userAddresses.push(msg.sender);
    }

    /// @dev This internal function verifies if the provided username is available for use, and an address has not already created a user
    /// @param username The username to be checked for availability
    /// @return bool Returns true if the username can be used; otherwise, returns false
    function _canCreateUserData(string memory username) private view returns (bool) {
        for (uint i = 0; i < userAddresses.length; i++) {
            address adr = userAddresses[i];
            if (adr == msg.sender) {
                return false;
            }
            if (keccak256(bytes(usersData[adr].username)) == keccak256(bytes(username))) {
                return false;
            }
        }
        return true;
    }

}