// scripts/interactWithLock.js
const hre = require("hardhat");

async function main() {
    // Your contract's deployed address
    const deployedAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    // Getting the contract's ABI
    const contractABI = await hre.artifacts.readArtifact("Lock");

	// Get the first signer from hardhat env
	const [signer] = await hre.ethers.getSigners();
	

    // Creating a contract instance with ethers.js
    const contract = new hre.ethers.Contract(deployedAddress, contractABI.abi, signer);

	
    // Interact with your contract
    // Example: Calling a function
    const tx = await contract.withdraw();
	await tx.wait(); // Wait for mining
    console.log(tx);
}

main().then(() => process.exit(0)).catch(error => {
    console.error(error);
    process.exit(1);
});
