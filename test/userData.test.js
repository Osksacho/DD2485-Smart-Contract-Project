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

  // Tests createUserData and getUserdata
  it('Should create user data', async function () {
    const username = 'oskar felixsson';
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');
    
    await blockThoughts.createUserData(username, ipfsImageRef);

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

  // Tests _canCreateUserData
  it('Should not allow creation of duplicate user data', async function () {
    const username = 'oskar felixsson';
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');

    await blockThoughts.createUserData(username, ipfsImageRef);

    const duplicateUsername = 'oskar felixsson';
    const duplicateIpfsImageRef = ethers.encodeBytes32String('ipfsHash2');

    await expect(blockThoughts.connect(addr1).createUserData(duplicateUsername, duplicateIpfsImageRef)).to.be.revertedWith(
      'Username or address already exists'
    );
  });

  it('Should not allow user creation multiple times', async function () {
    const username = 'oskar felixsson';
    const ipfsImageRef = ethers.encodeBytes32String('ipfsHash');

    await blockThoughts.createUserData(username, ipfsImageRef);

    const username2 = 'oskar felixsson2';

    await expect(blockThoughts.createUserData(username2, ipfsImageRef)).to.be.revertedWith(
      'Username or address already exists'
    );
  });
});