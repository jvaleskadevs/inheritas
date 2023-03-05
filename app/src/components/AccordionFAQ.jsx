import React from 'react';

function AccordionFAQ() {
	return (
		<div className="max-w-screen-xl mx-auto my-16 px-5 bg-[#13131a] text-neutral-400 min-h-sceen">
			<div className="flex flex-col items-center">
				<h2 className="font-bold text-5xl mt-5 text-neutral-300 tracking-tight">
					FAQ
				</h2>
				<p className="text-neutral-500 text-xl mt-3">
					Frequently asked questions
				</p>
			</div>
			<div className="grid divide-y divide-neutral-600 max-w-xl mx-auto mt-8">
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> What is Inheritas?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							 The Inheritas platform is a blockchain software service that allows users to manage the inheritance of their web3 assets.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> What kind of assets Inheritas support?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The Inheritas service supports every kind of web3 asset following the standards ERC20, ERC721 and ERC1155. But some limitations apply to fungible tokens.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> What kind of limitations do the fungible tokens have?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							While having 1 beneficiary per tokenID works well for non-fungible tokens. Fungible tokens should allow more flexibility, like multiple beneficiaries. But currently ERC20 tokens only supports 1 beneficiary per token (contract address) and ERC1155 tokens are limited to 1 beneficiary per tokenID (within the same contract). Multiple beneficiaries support will be added soon.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Why ether is not supported?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The native token of the Ethereum blockchain does not allow token allowances nor approvals. But Inheritas offers full support for ether inheritance trough the wrapped ether token, WETH.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How does Inheritas work?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The Inheritas service takes advantage of the approval method. As long as the approval is not revoked, the contract can send the asset from the registrant's wallet to the beneficiary's wallet when the beneficiary claims it after the date specified by the registrant has been reached. The beneficiary only needs the Inheritas assetID
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How does the claim asset work?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The beneficiary may claim the asset using the Inheritas assetID once the specified date has been reached. The date can be extended or modified as many times as the current owner wants.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> What happens if the beneficiary lose the Inheritas asssetID?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The Inheritas assetID is the keccak hash of the registrant wallet address, the asset contract address and the asset tokenID. The beneficiary could claim the asset just by knowing which asset it is and who owns it.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Is the Inheritas service free?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The Inheritas service charges a small fee for each new asset registered in the service. Current fee: 0.01 eth. Inheritas also offers a Diamond Pass with FREE access to register an unlimited number of assets in the service by 0.1 eth. The Inheritas Diamond Pass NFT holders may claim the Diamond Pass access by burning the IDP NFT.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How the claim works for IDP holders?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The Inheritas Diamond Pass NFT holders may claim the Diamond Pass access by burning the IDP NFT. Just go to the Diamond Pass section and press claim. After successfully claiming the Diamond Pass you will be able to register unlimited assets on the Inheritas service for FREE. 
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Can anyone revoke my Diamond Pass?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							The administrator has limited privileges over the contract, but may still be able to ban access to some malicious users who use a Diamond Pass.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Can I get a refund of my fee/Diamond Pass?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							No refunds are allowed.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How can I remove an asset from the Inheritas service?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							Currently, you only can remove the asset from the service by using the contract or revoking the approval to the Inheritas contract.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How does Inheritas compare with other similar services?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							 The Inheritas service is the most reliable way to inherit assets. We are safer, faster, easier and simpler than others. We are also the cheapest and totally decentralized. No admin privileges, no custody, no third parties and no paperwork.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Why Inheritas is safer than other similar services?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							 The Inheritas smart contract has been designed to be safe. Assets will never leave your wallet until they are claimed by the beneficiary when the specified data is reached. The contract is immutable, so no one can change the code.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Why Inheritas is faster than other similar services?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							 The Inheritas service was designed to be fast. The beneficiary only has to send a transaction to claim the asset, after completion the asset will be in the beneficiary's wallet. The estimated time is about 2 minutes depending on network congestion.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Why Inheritas is cheaper than other similar services?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							 Inheritas service is the cheapest one because the service does not require expensive costs. Yeah, we know that other teams are getting like 10$ monthly offerring low quality services but we are not here to take your money, we are here to build the future.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> Is the Inheritas service legal? What about the tax?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							Legally speaking, an inheritance is not taking place, but rather the beneficiary is transferring an asset that has previously been approved for transfer. The contract holds the approval until the date is reached. After that, the beneficiary can transfer the asset to their wallet. The use of this service is not limited to inheritances and could be used in many other ways.
						</p>
					</details>
				</div>
				<div className="py-5">
					<details className="group">
						<summary className="flex justify-between items-center font-medium cursor-pointer list-none">
							<span> How do I contact support?</span>
							<span className="transition group-open:rotate-180">
				        <svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
		</svg>
				      </span>
						</summary>
						<p className="text-neutral-500 mt-3 group-open:animate-fadeIn">
							If you need help with the service or have any other questions, you can contact the team in our Discord or trough any other social media. We are here to help.
						</p>
					</details>
				</div>
			</div>
		</div>	
	);
}

export default AccordionFAQ;
