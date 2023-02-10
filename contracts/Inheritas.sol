// Inheritas.sol
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;
/**
*
*  #### ##    ## ##     ## ######## ########  #### ########    ###     ######  
* 	##  ###   ## ##     ## ##       ##     ##  ##     ##      ## ##   ##    ## 
* 	##  ####  ## ##     ## ##       ##     ##  ##     ##     ##   ##  ##       
* 	##  ## ## ## ######### ######   ########   ##     ##    ##     ##  ######  
* 	##  ##  #### ##     ## ##       ##   ##    ##     ##    #########       ## 
* 	##  ##   ### ##     ## ##       ##    ##   ##     ##    ##     ## ##    ## 
*  #### ##    ## ##     ## ######## ##     ## ####    ##    ##     ##  ###### 
*
* 
* 	Inheritas Service
*	
*	Inherit assets in a decentralized way. Inheritas is a service to make assets
*	inheritance easy, safe, fast, cheap and decentralized. Currently the service
*	only accepts ERC721 and ERC1155 NFTs. In the future, support for ERC20 and
*	others will be added.
*
*	How-to
*
*	The mechanism is easy and simple. The owner of an asset should call the active
*	function to register an asset in the service. He/She must set a deadline and a
*	beneficiary. When the deadline will be reached, the beneficiary will be able to
* 	claim the asset calling the claim function. This deadline could be extended and
*	the beneficiary could be changed calling the alive function. Assets never leave
*	the registrants wallet until the beneficiaries claim them.
*
*	Price
*
*	Currently the Inheritas service has a fee of 0.01 ether but an user could buy
*	a lifeTimePass in order to get FREE access to the service paying 0.1 ether.
*	That's your choice, pay 0.01 ether per asset or unlimited assets per 0.1 ether.
*
*	WARNING!
*
*	To avoid assets to reach the unclaimable state: Don't interact with the asset
*	in none of the following ways: transfer, burn, approve, revoke-approval.
*	In case of the asset reached the unclaimable state, please re-approve this 
*	contract as operator. If the contract has no capabilities to transfer the asset,
*	the claim function will revert, making the asset unclaimable.
*
*	Technichal Details
*	
*	This contract relies in the approval feature, the registrant must approve this
*	contract as operator to transfer the asset to the beneficiary when the deadline
*	will be reached, in order to be able to register it in the Inheritas service.
*	If before claims the asset, it's transferred, burnt, or the approval is revoked,
*	the claim function will reverts and the asset will not ever be claimable. The
*	only way to re-activate the asset to be claimable is to set the approval again.
*	Due to the nature of the approval feature in the ERC721, if the registrant
*	approves the asset to another operator, the previously approved operator (this
*	contract), will be revoked making the claim function reverts too and the asset
*	unclaimable. To avoid assets to be unclaimable the right behaviour after a
*	successfully register into the service should be: Don't interact with the
*	asset in none of the following ways: transfer, burn, approve, revoke-approval.
*
*	If you think your asset reached the unclaimable state, just approve this 
*	contract as operator to the asset again. This will fix the unclaimable state, 
* 	making the asset claimable again.
*
*	Devs & Security Contact
*	
*	Tag Me on the Alchemy University discord to comment anything about the code!
*						@MaestroCripto @J.Valeska
**/

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC1155/IERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

error InvalidParams();
error FeePriceError();
error Forbidden();
error NotApproved();

contract Inheritas is Ownable, ReentrancyGuard {
	using Counters for Counters.Counter;	
	
	uint serviceFee = 0.01 ether;		// A fee must be paid to use the service
	uint lifeTimePassPrice = 0.1 ether;	// The price of a lifeTimePass to the Inheritas service
	
	// Keep track of the type of assets allowed by the Inheritas service
	enum assetType {
		ERC721,
		ERC1155
	}
	// Store info about an asset registered into the Inheritas service
	struct Asset {
		uint assetID;				// The assetID to identify the asset in the service
		uint deadline;				// The deadline to claim the asset by the beneficiary
		address owner;				// Owner/operator registering the asset in the service
		address beneficiary;		// The beneficiary of the asset after the deadline
		address contractAddress;	// The contract address of the asset
		uint tokenID;				// The tokenID of the asset in its contract
		assetType erc;				// The ERC of the asset
	}
	
	// Keep track of every asset registered in the Inheritas service by ID
	mapping (uint256 => Asset) public assets;
	// Keep track of the address of every LifeTime Pass buyer
	mapping (address => bool) public lifeTimePass;
	// The total number of assets registered into the service, claimed ones included
	Counters.Counter public _totalAssets;
	// The total number of assets claimed using the service
	Counters.Counter public _claimedAssets;
	
	// Emit an event after successfully register an asset into the service
	event NewAsset(
		uint assetID,
		uint deadline,
		address indexed owner,
		address indexed beneficiary,
		address indexed contractAddress,
		uint tokenID,
		assetType erc
	);
	// Emit an event after successfully update an asset registered into the service
	event Alive(
		uint assetID,
		uint deadline,
		address indexed owner,
		address indexed beneficiary,
		address indexed contractAddress,
		uint tokenID,
		assetType erc
	);
	// Emit an event after successfully claim an asset from the service
	event Claimed(
		uint assetID,
		address indexed from,
		address indexed to,
		address indexed contractAddress,
		uint tokenID,
		assetType erc
	);
	// Emit an event after successfully buy a LifeTime Pass to the service
	event LifeTimePassSold(address indexed buyer);
	// Emit an event after successfully revoke a LifeTime Pass
	event LifeTimePassRevoked(address indexed banned);
	
	constructor () {
		// Set contract deployer as owner and beneficiary from fees
		transferOwnership(msg.sender);
	}
	
	// Register the specified asset into the Inheritas service
	function active(
		uint _deadline, 
		address _beneficiary, 
		address _assetContract, 
		uint _assetID, 
		assetType _assetType
	) external payable nonReentrant {
		
		if (block.timestamp > _deadline) revert InvalidParams();
		if (_beneficiary == address(0)) revert InvalidParams();
		if (_assetContract == address(0)) revert InvalidParams();
		if (!lifeTimePass[msg.sender]) {
			if (msg.value != serviceFee) revert FeePriceError();
		}
		if (!_isApproved(_assetContract, _assetID, _assetType, msg.sender)) revert NotApproved();
		// Increment total assets count...
		_totalAssets.increment();
		// ... and use the current value as assetID
		//uint256 assetID = _totalAssets.current();
		// Using the hash make things easier to the frontend and the users
		uint256 assetID = uint(keccak256(abi.encodePacked(_assetContract, _assetID)));
		// Store info about the new registered asset
		assets[assetID] = Asset(
			assetID,
			_deadline,
			msg.sender,
			_beneficiary,
			_assetContract,
			_assetID,
			_assetType
		);
		
		// Emit an event after successfully register an asset into the service
		emit NewAsset(
			assetID,
			_deadline,
			msg.sender,
			_beneficiary,
			_assetContract,
			_assetID,
			_assetType
		);
	}
	
	// Extends the current deadline and/or change the beneficiary
	function alive(uint256 _assetID, uint _deadline, address _beneficiary) nonReentrant external {
		if (assets[_assetID].owner != msg.sender) revert Forbidden();
		if (block.timestamp > _deadline) revert InvalidParams();
		if (_beneficiary == address(0)) revert InvalidParams();
		// Update the deadline and the beneficiary, even if they did not change
		assets[_assetID].deadline = _deadline;
		assets[_assetID].beneficiary = _beneficiary;
		
		emit Alive(
			_assetID,
			_deadline,
			msg.sender,
			_beneficiary,
			assets[_assetID].contractAddress,
			assets[_assetID].tokenID,
			assets[_assetID].erc		
		);
		// A registrant still could call this function after transferring the asset,
		// but it will just be a waste of gas, the claim function will revert.
		// The same applies to burn, revoke approval, approve another operator...
	}
	
	// The beneficiary will be able to claim the asset after reach the deadline
	// This function will revert if the registrant tranfers, burns, revokes
	// approval, approves another operator, and/or asset is not claimable
	function claim(uint256 _assetID) external nonReentrant {
		if (!_isClaimable(_assetID, msg.sender)) revert Forbidden();
		
		// Checks if an asset is an ERC721
		if (assets[_assetID].erc == assetType.ERC721) {
			// Transfers the asset to the beneficiary
			IERC721(assets[_assetID].contractAddress)
				.safeTransferFrom(
					assets[_assetID].owner,
					assets[_assetID].beneficiary,
					assets[_assetID].tokenID
			);		
		}

		// Checks if an asset is an ERC1155
		if (assets[_assetID].erc == assetType.ERC1155) {
			// Transfers the asset to the beneficiary
			IERC1155(assets[_assetID].contractAddress)
				.safeTransferFrom(
					assets[_assetID].owner,
					assets[_assetID].beneficiary,
					assets[_assetID].tokenID,
					1,
					""
			);
		}

		// Emit an event after successfully claim an asset
		emit Claimed(
			_assetID,
			assets[_assetID].owner,
			assets[_assetID].beneficiary,
			assets[_assetID].contractAddress,
			assets[_assetID].tokenID,
			assets[_assetID].erc
		);
		
		// Increment the total claimed assets count
		_claimedAssets.increment();
		// Remove the asset from the Inheritas service registry
		delete assets[_assetID];
	}
	
	// A registrant may cancel the service to an specified asset
	function remove(uint _assetID) external {
		if (assets[_assetID].owner != msg.sender) revert Forbidden();
		delete assets[_assetID];
	}
	
	// Users may buy a LifeTimePass to get FREE access to the service
	function buyLifeTimePass() external payable {
		require(!lifeTimePass[msg.sender], "Already have a LifeTime Pass!");
		if (msg.value != lifeTimePassPrice) revert FeePriceError();
		lifeTimePass[msg.sender] = true;
		emit LifeTimePassSold(msg.sender);
	}

	// Check whether an asset is claimable or not based in deadline & beneficiary
	function _isClaimable(uint _assetID, address _beneficiary) internal view returns (bool) {
		return block.timestamp > assets[_assetID].deadline && 
				_beneficiary == assets[_assetID].beneficiary;
	}
	
	// Checks for approvals after check whether it is an ERC721 or ERC1155 asset
	function _isApproved(address _assetContract, uint _assetID, assetType _assetType, address _by) internal view returns (bool) {
		// Check if asset is an ERC721
		if (_assetType == assetType.ERC721) {
			IERC721 iface = IERC721(_assetContract);
			// Check if the contract is approved to transfer the token
			return iface.ownerOf(_assetID) == _by &&
					iface.getApproved(_assetID) == address(this);
		}
		// Check if asset is an ERC115
		if (_assetType == assetType.ERC1155) {
			IERC1155 iface = IERC1155(_assetContract);
			// Check if the contract is approved to transfer the token
			return iface.balanceOf(_by, _assetID) > 0 &&
					iface.isApprovedForAll(_by, address(this));	
		}
		return false;
		// This works with assets using the ERC721/ERC1155 OpenZeppelin Standards
		// A mallory could bypass this function, but this is here to protect users
		// from register assets without approve them before. The security of
		// the contract will not be affected if this function is bypassed.
		// ERC721 reverts if sender isn't the owner or approved, tokenId does
		// not exist, contract is not approved.
		// ERC1155 will do in theses cases, excluding the tokenID

	}
	
	// The owner is able to change the serviceFee and the lifeTimePassPrice
	function setPrices(uint _serviceFee, uint _lifeTimePassPrice) public onlyOwner {
		serviceFee = _serviceFee;
		lifeTimePassPrice = _lifeTimePassPrice;
	}
	
	// Security function to ban malicious users. If the owner abuse it, users could
	// stop to register assets into the service, while the claim function will be
	// continously working without problems. This incentives the owner to non abuse.
	function revokeLifeTimePass(address banedUser) public onlyOwner {
		lifeTimePass[banedUser] = false;
	}
	
	
	// Withdraw contract funds (onlyOwner)
	function withdraw() public onlyOwner {
		(bool sent, ) = payable(owner()).call{ value: address(this).balance }("");
		require(sent);
	}
	// Receive fallback
	event Received(address indexed sender, uint amount);
	receive() external payable {
		emit Received(msg.sender, msg.value);
	}
}
