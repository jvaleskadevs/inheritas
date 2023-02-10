const { loadFixture, time } = require("@nomicfoundation/hardhat-network-helpers");
const { expect } = require("chai");


describe("Inheritas - ERC721", function () {

	async function deploySigners() {
		const [ owner, user, beneficiary ] = await ethers.getSigners(); 
		console.log(`Owner: ${owner.address}`);
		console.log(`User: ${user.address}`);
		console.log(`Beneficiary: ${beneficiary.address}`);
		return { owner, user, beneficiary };
	}
	async function deployInheritas() {
		const Inheritas = await ethers.getContractFactory("Inheritas");
		const inheritas = await Inheritas.deploy();
		await inheritas.deployed();
		console.log(`Inheritas deployed to ${inheritas.address}`);
		return { inheritas };
	}
	async function deployERC721MockUp() {
		const ERC721MockUpFactory = await ethers.getContractFactory("ERC721MockUp");
		const ERC721MockUp = await ERC721MockUpFactory.deploy();
		await ERC721MockUp.deployed();
		console.log(`ERC721MockUp deployed to ${ERC721MockUp.address}`);
		return { ERC721MockUp };
	}
	async function deployERC721MockUpEvil(inheritasAddress) {
		const ERC721MockUpFactory = await ethers.getContractFactory("ERC721MockUpEvil");
		const ERC721MockUp = await ERC721MockUpFactory.deploy(inheritasAddress);
		await ERC721MockUp.deployed();
		console.log(`ERC721MockUpEvil deployed to ${ERC721MockUp.address}`);
		return { ERC721MockUp };
	}
	async function deployERC1155MockUp() {
		const ERC1155MockUpFactory = await ethers.getContractFactory("ERC1155MockUp");
		const ERC1155MockUp = await ERC1155MockUpFactory.deploy();
		await ERC1155MockUp.deployed();
		console.log(`ERC1155MockUp deployed to ${ERC1155MockUp.address}`);
		return { ERC1155MockUp };
	}
	
	
	async function fixture() {
		const { inheritas } = await deployInheritas();
		const { ERC721MockUp } = await deployERC721MockUp();
		//const { ERC721MockUp } = await deployERC721MockUpEvil(inheritas.address);
		const { ERC1155MockUp } = await deployERC1155MockUp();
		const { owner, user, beneficiary } = await deploySigners();
		let tx = await ERC721MockUp.safeMint(user.address, "");
		await tx.wait();
		console.log(`Total ERC721 supply: ${await ERC721MockUp.totalSupply()}`);
		tx = await ERC1155MockUp.mint(user.address, 0, 1, 0x0000000000000000000000000000000000000000000000000000000000000000);
		await tx.wait();
		console.log(`Total ERC1155 supply: ${await ERC1155MockUp.balanceOf(user.address, 0)}`);
		return { inheritas, ERC721MockUp, ERC1155MockUp, owner, user, beneficiary };
	}
	
	it("Fixture should deploy the contracts", async function () {
		const { inheritas, ERC721MockUp } = await loadFixture(fixture);
		expect(inheritas.address && ERC721MockUp.address);
	});
	
	it("Fixture should get the accounts", async function () {
		const { owner, user, beneficiary } = await loadFixture(fixture);
		expect(owner.address && user.address && beneficiary.address);
	});
	
	it("Should allow users to active the service paying the fee", async function () {
		const { inheritas, ERC721MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		
		const activeReceipt = await tx.wait();
		const activeEvent = activeReceipt.events.find(e => e.event === "NewAsset");
		expect(activeEvent.length > 0);
	});
	
	it("Should allow users to buy a lifetimePass & active the service", async function () {
		const { inheritas, ERC721MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		tx = await inheritas.connect(user).buyLifeTimePass({ value: ethers.utils.parseEther("0.1")});
		await tx.wait();
		
		expect(await inheritas.connect(user).lifeTimePass(user.address) === true);
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0 // ERC721
		);
		
		const activeReceipt = await tx.wait();
		const activeEvent = activeReceipt.events.find(e => e.event === "NewAsset");
		expect(activeEvent.length > 0);
	});
	
	it("Should revert if the asset is not approved", async function () {
		const { inheritas, ERC721MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		await expect(inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		)).to.be.revertedWithCustomError(inheritas, "NotApproved");
	});
	
	it("Should allow beneficiary to claim the asset after deadline", async function () {
		const { inheritas, ERC721MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		tx = await inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		);
		
		const claimReceipt = await tx.wait();
		const claimEvent = claimReceipt.events.find(e => e.event === "Claimed");
		expect(await ERC721MockUp.ownerOf(0) === beneficiary.address);
		expect(claimEvent.length > 0);
		

		console.log("final owner:");
		console.log(await ERC721MockUp.ownerOf(0));
	});
	
	it("Claim should revert before reach deadline", async function () {
		const { inheritas, ERC721MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWithCustomError(inheritas, "Forbidden");
	});	
	
	it("Only the beneficiary should be able to claim the asset", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(owner).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWithCustomError(inheritas, "Forbidden");
	});
	
	it("Should revert if the owner revoke the asset approval", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC721MockUp.connect(user).approve(ethers.constants.AddressZero, 0);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWith("ERC721: caller is not token owner or approved");
	});
	
	it("Claim should revert if the owner transfers the asset", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC721MockUp.connect(user).approve(ERC721MockUp.address, 0);
		await tx.wait();
		// Thanks to "thatguyintech" stack overflow answer. small world.
		tx = await ERC721MockUp.connect(user)["safeTransferFrom(address,address,uint256)"](user.address, owner.address, 0);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWith("ERC721: caller is not token owner or approved");
	});
	
	it("Claim should revert if the owner approves the asset to other operator", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC721MockUp.connect(user).approve(ERC721MockUp.address, 0);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWith("ERC721: caller is not token owner or approved");
	});
	
	it("Claim should revert if the owner burns the asset", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC721MockUp.connect(user).burn(0);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC721MockUp.address, 0])//1
		)).to.be.revertedWith("ERC721: invalid token ID");
	});
	
	it("The owner should be able to withdraw funds", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		
		const beforeBalance = await ethers.provider.getBalance(owner.address); 
		
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await inheritas.connect(owner).withdraw();
		await tx.wait();
		
		const afterBalance = await ethers.provider.getBalance(owner.address); 
		expect(afterBalance > beforeBalance);
	});
	
	it("Only the owner should be able to withdraw funds", async function () {
		const { inheritas, ERC721MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		
		const beforeBalance = await ethers.provider.getBalance(owner.address); 
		
		// Approve the asset
		let tx = await ERC721MockUp.connect(user).approve(inheritas.address, 0);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC721MockUp.address,
			0, // tokenID
			0, // ERC721
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		await expect(inheritas.connect(beneficiary).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
	});
});




describe("Inheritas - ERC1155", function () {

	async function deploySigners() {
		const [ owner, user, beneficiary ] = await ethers.getSigners(); 
		console.log(`Owner: ${owner.address}`);
		console.log(`User: ${user.address}`);
		console.log(`Beneficiary: ${beneficiary.address}`);
		return { owner, user, beneficiary };
	}
	async function deployInheritas() {
		const Inheritas = await ethers.getContractFactory("Inheritas");
		const inheritas = await Inheritas.deploy();
		await inheritas.deployed();
		console.log(`Inheritas deployed to ${inheritas.address}`);
		return { inheritas };
	}
	async function deployERC721MockUp() {
		const ERC721MockUpFactory = await ethers.getContractFactory("ERC721MockUp");
		const ERC721MockUp = await ERC721MockUpFactory.deploy();
		await ERC721MockUp.deployed();
		console.log(`ERC721MockUp deployed to ${ERC721MockUp.address}`);
		return { ERC721MockUp };
	}
	async function deployERC1155MockUp() {
		const ERC1155MockUpFactory = await ethers.getContractFactory("ERC1155MockUp");
		const ERC1155MockUp = await ERC1155MockUpFactory.deploy();
		await ERC1155MockUp.deployed();
		console.log(`ERC1155MockUp deployed to ${ERC1155MockUp.address}`);
		return { ERC1155MockUp };
	}
	
	
	async function fixture() {
		const { inheritas } = await deployInheritas();
		const { ERC721MockUp } = await deployERC721MockUp();
		const { ERC1155MockUp } = await deployERC1155MockUp();
		const { owner, user, beneficiary } = await deploySigners();
		let tx = await ERC721MockUp.safeMint(user.address, "");
		await tx.wait();
		console.log(`Total ERC721 supply: ${await ERC721MockUp.totalSupply()}`);
		tx = await ERC1155MockUp.mint(user.address, 0, 1, 0x0000000000000000000000000000000000000000000000000000000000000000);
		await tx.wait();
		console.log(`Total ERC1155 supply: ${await ERC1155MockUp.balanceOf(user.address, 0)}`);
		return { inheritas, ERC721MockUp, ERC1155MockUp, owner, user, beneficiary };
	}
	
	it("Fixture should deploy the contracts", async function () {
		const { inheritas, ERC1155MockUp } = await loadFixture(fixture);
		expect(inheritas.address && ERC1155MockUp.address);
	});
	
	it("Fixture should get the accounts", async function () {
		const { owner, user, beneficiary } = await loadFixture(fixture);
		expect(owner.address && user.address && beneficiary.address);
	});
	
	it("Should allow users to active the service paying the fee", async function () {
		const { inheritas, ERC1155MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		
		const activeReceipt = await tx.wait();
		const activeEvent = activeReceipt.events.find(e => e.event === "NewAsset");
		expect(activeEvent.length > 0);
	});
	
	it("Should allow users to buy a lifetimePass & active the service", async function () {
		const { inheritas, ERC1155MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		tx = await inheritas.connect(user).buyLifeTimePass({ value: ethers.utils.parseEther("0.1")});
		await tx.wait();
		
		expect(await inheritas.connect(user).lifeTimePass(user.address) === true);
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1 // ERC1155
		);
		
		const activeReceipt = await tx.wait();
		const activeEvent = activeReceipt.events.find(e => e.event === "NewAsset");
		expect(activeEvent.length > 0);
	});
	
	it("Should revert if the asset is not approved", async function () {
		const { inheritas, ERC1155MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		await expect(inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		)).to.be.revertedWithCustomError(inheritas, "NotApproved");
	});
	
	it("Should allow beneficiary to claim the asset after deadline", async function () {
		const { inheritas, ERC1155MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		/*
		const isApproveForAll = await ERC1155MockUp.isApprovedForAll(user.address, inheritas.address);
		console.log("Is Approved? -> ", isApproveForAll);
		*/
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		const activeReceipt = await tx.wait();
		const activeEvent = activeReceipt.events.find(e => e.event === "NewAsset");
		//console.log(activeEvent);
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		tx = await inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		);
		
		const claimReceipt = await tx.wait();
		const claimEvent = claimReceipt.events.find(e => e.event === "Claimed");
		expect(await ERC1155MockUp.balanceOf(beneficiary.address, 0) === 1);
		expect(claimEvent.length > 0);
		//console.log(claimEvent);
		//console.log(ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1);
		console.log("beneficiaty balance:");
		console.log(await ERC1155MockUp.balanceOf(beneficiary.address, 0));
	});
	
	it("Claim should revert before reach deadline", async function () {
		const { inheritas, ERC1155MockUp, _owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 300; // 5 minutes
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		)).to.be.revertedWithCustomError(inheritas, "Forbidden");
	});	
	
	it("Only the beneficiary should be able to claim the asset", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(owner).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		)).to.be.revertedWithCustomError(inheritas, "Forbidden");
	});
	
	it("Should revert if the owner revoke the asset approval", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, false);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		)).to.be.revertedWith("ERC1155: caller is not token owner or approved");
	});
	
	it("Claim should revert if the owner transfers the asset", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC1155MockUp.connect(user).setApprovalForAll(ERC1155MockUp.address, true);
		await tx.wait();
		tx = await ERC1155MockUp.connect(user).safeTransferFrom(user.address, owner.address, 0, 1, 0x0);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		)).to.be.revertedWith("ERC1155: insufficient balance for transfer");
	});
	
	it("Claim should not revert if the owner approves the asset to other operator", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC1155MockUp.connect(user).setApprovalForAll(ERC1155MockUp.address, true);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		tx = await inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		);
		
		const claimReceipt = await tx.wait();
		const claimEvent = claimReceipt.events.find(e => e.event === "Claimed");
		expect(await ERC1155MockUp.balanceOf(beneficiary.address, 0) === 1);
		expect(claimEvent.length > 0);
	});
	
	it("Claim should revert if the owner burns the asset", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await ERC1155MockUp.connect(user).burn(user.address, 0, 1);
		await tx.wait();
		
		const delay = ms => new Promise(res => setTimeout(res, ms));
		await delay(2000);
		
		await expect(inheritas.connect(beneficiary).claim(
			// assetID -> Keccak from asset contract address and asset tokenID
			ethers.utils.solidityKeccak256(["address", "uint"], [ERC1155MockUp.address, 0])//1
		)).to.be.revertedWith("ERC1155: insufficient balance for transfer");
	});
	
	it("The owner should be able to withdraw funds", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		
		const beforeBalance = await ethers.provider.getBalance(owner.address); 
		
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		tx = await inheritas.connect(owner).withdraw();
		await tx.wait();
		
		const afterBalance = await ethers.provider.getBalance(owner.address); 
		expect(afterBalance > beforeBalance);
	});
	
	it("Only the owner should be able to withdraw funds", async function () {
		const { inheritas, ERC1155MockUp, owner, user, beneficiary } = await loadFixture(fixture);
		
		const beforeBalance = await ethers.provider.getBalance(owner.address); 
		
		// Approve the asset
		let tx = await ERC1155MockUp.connect(user).setApprovalForAll(inheritas.address, true);
		await tx.wait();
		
		const deadline = await (time.latest()) + 1; // 1 second to test
		
		tx = await inheritas.connect(user).active(
			deadline,
			beneficiary.address,
			ERC1155MockUp.address,
			0, // tokenID
			1, // ERC1155
			{ value: ethers.utils.parseEther("0.01") }
		);
		await tx.wait();
		
		await expect(inheritas.connect(beneficiary).withdraw()).to.be.revertedWith("Ownable: caller is not the owner");
	});
});
