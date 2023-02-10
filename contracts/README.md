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
