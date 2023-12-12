pragma solidity ^0.8.9;

contract BlockThoughts {
    struct UserData {
        string username;
        bytes32 ipfsImageRef;
    }
    
    struct Thread {
        uint64 id;
        string subject;
    }

    mapping(address => UserData) public usersData;
    address[] public userAddresses;
    uint64 threadCounter;
	Thread[] threads;
	bytes32[][] threadCommentLinks;
	
    /// @param _subject The subject of the thread.
    function addThread(string memory _subject) public {
        require(bytes(_subject).length > 0, "Thread must have a subject.");
        threads.push(Thread(threadCounter, _subject));
		threadCommentLinks.push(new bytes32[](0));
        threadCounter++;
    }

    /// @param _threadId The thread id for which to add a comment. _commentLink The ipfs hash to the stored comment
    function addComment(uint64 _threadId , bytes32 _commentLink) public {
        require(_threadId < threadCounter, "Invalid thread id.");
        threadCommentLinks[_threadId].push(_commentLink);
    }

    /// @return Thread[] An array of threads (id and subject)
    function getThreads () public view returns (Thread[] memory) {
        Thread[] memory result = new Thread[](threadCounter);
        for (uint64 i = 0; i < threadCounter; i++) {
            result[i] = threads[i];
        }
        return result;
    }

    /// @param _threadId The thread id. Recieve these get from getThreads()
    /// @return bytes32[] The ipfs hashes
    function getComments (uint64 _threadId) public view returns (bytes32[] memory) {
        require(_threadId < threadCounter, "Invalid thread id.");
		return threadCommentLinks[_threadId];
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
        require(_canCreateUserData(username), "Username or address already exists");

        UserData memory newUser = UserData(username, ipfsImageRef);
        usersData[msg.sender] = newUser;
        userAddresses.push(msg.sender);
    }

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