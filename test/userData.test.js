const { expect } = require('chai');
const { ethers } = require('hardhat');

describe('BlockThoughs Contract Userdata tests', function () {
  let BlockThoughts;
  let blockThoughts;
  let owner;
  let addr1;
  let addr2;

  // Before each test, deploy the contract
  beforeEach(async function () {
    BlockThoughts = await ethers.getContractFactory('BlockThoughts');
    [owner, addr1, addr2] = await ethers.getSigners();
    
    blockThoughts = await BlockThoughts.deploy();
  });

  it('Should create user data', async function () {
    const username = 'oskar felixsson';
    const username2 = 'oskar felixsson2'
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');
    
    await blockThoughts.createUserData(username, ipfsImageRef);
    await blockThoughts.connect(addr1).createUserData(username2, ipfsImageRef);

    const userData = await blockThoughts.getUserData(owner.address);

    expect(userData.username).to.equal(username);
    expect(userData.ipfsImageRef).to.equal(ipfsImageRef);
  });

  it('Should not allow empty username', async function () {
    const username = '';
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');
    
    await expect(blockThoughts.createUserData(username, ipfsImageRef)).to.be.revertedWith(
        'Username cannot be empty'
      );
  });

  it('Should not allow creation of duplicate username', async function () {
    const username = 'oskar felixsson';
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');

    await blockThoughts.createUserData(username, ipfsImageRef);

    const duplicateUsername = 'oskar felixsson';
    const duplicateIpfsImageRef = ethers.encodeBytes32String('ipfsHash2');

    await expect(blockThoughts.connect(addr1).createUserData(duplicateUsername, duplicateIpfsImageRef)).to.be.revertedWith(
      'Username already exists'
    );
  });
  
  it('Should be possible to add and retrieve threads', async function () {
    const time = new Date().toISOString();
    await blockThoughts.addThread("My thoughts on tests", time);
	await blockThoughts.addThread("Everything about cars", time);
	
	[id, sub] = (await blockThoughts.getThreads())[0];
	
    await expect(id).to.equal(0);
	await expect(sub).to.equal("My thoughts on tests");
  });
  
  it('Should be possible to add and retrieve comments', async function () {
	const value = "This is a comment";
    const time = new Date().toISOString();

    await blockThoughts.addThread("My thoughts on tests", time);
	await blockThoughts.addThread("Everything about cars", time);
	
	await blockThoughts.addComment(1, value, time);
	
    await expect((await blockThoughts.getComments(1))[0].value).to.equal(value);

  });
  
  it('Cannot get comments with invalid thread ids', async function () {
	const value = "This is a comment";
    const time = new Date().toISOString();

    await blockThoughts.addThread("My thoughts on tests", time);
	await blockThoughts.addThread("Everything about cars", time);
	
	await blockThoughts.addComment(1, value, time);

	await expect(blockThoughts.getComments(2)).to.be.revertedWith(
		'Invalid thread id.'
	);
  });
  
  it('Cannot add comments with invalid thread ids', async function () {
	const value = "This is a comment";
    const time = new Date().toISOString();

    await blockThoughts.addThread("My thoughts on tests", time);
	await blockThoughts.addThread("Everything about cars", time);
	
	await expect(blockThoughts.addComment(2, value, time)).to.be.revertedWith(
		'Invalid thread id.'
	);
  });
  
  it('Should not be possible to add threads with no subject line', async function () {
    const time = new Date().toISOString();
	await expect(blockThoughts.addThread("", time)).to.be.revertedWith(
		'Thread must have a subject.'
	);
  });
  
});