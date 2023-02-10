import React from 'react';

function Guides() {

	const summaryClass = "flex justify-between items-center font-medium cursor-pointer text-neutral-400 list-none my-6";
	
	return (
		<div className="flex flex-col">
			<h2 className="font-bold text-5xl mt-5 text-neutral-300 tracking-tight">
				HOW TO - OWNERS
			</h2>
			<p className="text-neutral-500 text-xl mt-3">
				A step-by-step guide to register an asset in the Inheritas service
			</p>
			<details className="group max-w-[60%]">
				<summary className={summaryClass}>
					<span>Owners Guide - How to register an asset</span>
					<span className="transition group-open:rotate-180">
						<svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
						</svg>
					</span>
				</summary>
				<div className="flex flex-col text-neutral-300 text-lg mt-3 group-open:animate-fadeIn leading-[38px]">
					<ol className="px-5">
						<li className="mb-2">
							1 - Connect your wallet to login in the Inheritas service
						</li>
						<li className="mb-2">
							2 - Press the Register Button
						</li>
						<li className="mb-2">
							3 - Select the asset and press the Register button
						</li>
						<li className="mb-2">
							4 - Set the date after the asset will be claimable
						</li>
						<li className="mb-2">
							5 - Set the wallet address of the beneficiary
						</li>
						<li className="mb-2">
							6 - Press Register button. A wallet pop-up will appear
						</li>
						<li className="mb-2">
							7 - Approve the Inheritas contract to manage the asset. One more pop-up.
						</li>
						<li className="mb-2">
							8 - Sign the transaction to register the asset in the Inheritas service
						</li>
						<li className="mb-2">
							9 - Go to your Inheritas portfolio and select the asset
						</li>
						<li className="mb-3">
							10 - Share the assetID with the beneficiary
						</li>
						<li className="mb-2">
							- Well done! Your inherit is secured now! Your loved ones will get your asset with no cost (only gas fees) in a secure, fast, easy and decentralised way.
						</li>
					</ol>
				</div>
			</details>
			
			
			<h2 className="font-bold text-5xl mt-5 text-neutral-300 tracking-tight">
				HOW TO - BENEFICIARIES
			</h2>
			<p className="text-neutral-500 text-xl mt-3">
				A step-by-step guide to claim an asset from the Inheritas service
			</p>
			<details className="group max-w-[60%]">
				<summary className={summaryClass}>
					<span>Beneficiaries Guide - How to claim an asset</span>
					<span className="transition group-open:rotate-180">
						<svg fill="none" height="24" shapeRendering="geometricPrecision" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" width="24"><path d="M6 9l6 6 6-6"></path>
						</svg>
					</span>
				</summary>
				<div className="flex flex-col text-neutral-300 mt-3 text-lg group-open:animate-fadeIn leading-[38px]">
					<ol className="px-5">
						<li className="mb-2">
							1 - Connect your wallet to login in the Inheritas service
						</li>
						<li className="mb-2">
							2 - Select the diamond icon from the menu, go to the claim section
						</li>
						<li className="mb-2">
							3 - Insert the assetID of the asset you want to claim
						</li>
						<li className="mb-2">
							4 - Press Claim, a wallet pop-up will appear
						</li>
						<li className="mb-3">
							5 - Sign the transaction to claim your asset
						</li>
						<li className="mb-2">
							- Well done! Your inherited asset is in your wallet now!
						</li>
					</ol>
				</div>
			</details>
		</div>
	);
}

export default Guides;
