// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";


contract InheritasDiamondPass is ERC721, ERC721Burnable {
    using Counters for Counters.Counter;

	uint public MAX_SUPPLY = 10; // TODO: 10 for test, change to 1000?
	uint public PRICE = 0.01 ether; // TODO 0.01 for test, change to 0.1 ether?
	
	address public owner;
	bool public paused = false; // TODO: false for test, set to True
	string public BASE_URI = "https://baseuri/"; // TODO: add base uri

    Counters.Counter private _tokenIdCounter;

    constructor() ERC721("InheritasDiamondPass", "IDP") {
    	owner = msg.sender;
    	_tokenIdCounter.increment(); // tokenId #0 must be free
    }
    
    // Mint tokens

    function safeMint(address to) public payable {
    	require(msg.value == PRICE);
        uint256 tokenId = _tokenIdCounter.current();
    	_tokenIdCounter.increment();
        require(!paused || tokenId < MAX_SUPPLY);
        _safeMint(to, tokenId);
    }


    // Burn
    
    function burn(uint _tokenId) public override(ERC721Burnable) {
    	super._burn(_tokenId);
    }

    
    // Token URI
    
    function _baseURI() internal view override returns (string memory) {
        return BASE_URI; 
    }
    
    
    // Only owner
    
    function pause() public {
    	require(msg.sender == owner);
    	paused = !paused;
    }
    
    function setOwner(address _owner) public {
    	require(msg.sender == owner);
    	owner = _owner;
    }
}
