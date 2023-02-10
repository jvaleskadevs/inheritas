import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';

import { ethers } from 'ethers';
import { Network, Alchemy } from "alchemy-sdk";

import { Logout, AddAsset, AssetDetails, ClaimAsset, Learn, BuyLifeTimePass } from './pages';
import { Navbar, Sidebar, Hero, AccordionFAQ, Guides, DisplayNfts, Footer } from './components';
import { inheritasAbi, inheritasAddress, erc721Abi, erc1155Abi } from './constants';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";


function App() {
	const settings = { 
		apiKey: process.env.REACT_APP_API,
		network: Network.ETH_GOERLI
	}
	const alchemy = new Alchemy(settings);	
	
	const [provider, setProvider] = useState({});
	const [signer, setSigner] = useState({});
	const [address, setAddress] = useState("");
	const [inheritas, setInheritas] = useState({});
	
	const [nfts, setNfts] = useState([]);
	const [inheritasNfts, setInheritasNfts] = useState([]);
	const [hasLifeTimePass, setHasLifeTimePass] = useState(false);
	
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [learnMore, setLearnMore] = useState(false);
	
	async function connect() {
		setIsLoading(true);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		await provider.send("eth_requestAccounts", []);
		setProvider(provider);
		
		const signer = await provider.getSigner();
		setSigner(signer);
		
		const address = await signer.getAddress();
		setAddress(address);
		
		setInheritas(await getInheritasContract(signer));
		
		//await fecthNfts();
	}
	
	function disconnect() {
		setSigner({});
		setAddress("");
		setInheritas({});
		setNfts([]);
		setInheritasNfts([]);
	}
	
	async function getInheritasContract(signer) {
		return new ethers.Contract(inheritasAddress, inheritasAbi, signer);
	}
	
	async function fetchNfts() {
		/*
		const userNfts = await fetchUserNfts(address);
		setNfts([...nfts, ...userNfts]);
		
		const userInheritasNfts = await fetchInheritasNfts(ownedNfts);
		setInheritasNfts([...inheritasNfts, ...userInheritasNfts]);
		*/
		
		
		let ownedNfts = [];
		let page = "";
		while (page !== undefined) {
			const data = await fetchOwnedNftsBy(page);
			ownedNfts.push(...data.ownedNfts);
			page = data.pageKey;
		}

		setNfts(ownedNfts);
		
		console.log(ownedNfts);
		
		const userInheritasNfts = await fetchInheritasNfts(ownedNfts);
		setInheritasNfts(userInheritasNfts);
		
		setIsLoading(false);	
	}
	
	async function fetchOwnedNftsBy(page) {
		console.log("Fetching: ", page);
		
		const data = await alchemy.nft.getNftsForOwner(address, { pageKey: page });
		
		// Use this address to check a wallet with +100 nfts, search for CHANGETHIS
		// to find  another address variable reference. It must be changed too. 
		//const data = await alchemy.nft.getNftsForOwner("0x3032CdFdE2f7f2a4a6fEBc88661150AD73471Bac", { pageKey: page });
		
		console.log("Next: ", data.pageKey);

		return data;
	}

	async function fetchInheritasNfts(ownedNfts) {
		const items = [];
		for (let i = 0; i < ownedNfts.length; i++) {
			const data = await fetchInheritasData(ownedNfts[i]);
			// CHANGETHIS - change address reference to the same wallet
			// "0x3032CdFdE2f7f2a4a6fEBc88661150AD73471Bac" (to check +100 nfts)
			if (data.deadline > 0 && data.owner === address) {
				items.push({...ownedNfts[i], ...data});
			} else {
				items.push({...ownedNfts[i]});
			}
		}
		return items;
		//setInheritasNfts(items);
	}
	
	async function fetchInheritasData(nft) {
		const assetID = ethers.utils.solidityKeccak256(["address", "uint"], [nft.contract.address, nft.tokenId]);
		const data = await inheritas.assets(assetID);
		return data;
	}
	
	async function approveAsset(asset) {
		if (asset.tokenType === "ERC721") {
			const assetContract = new ethers.Contract(asset.contract.address, erc721Abi, signer);
			await assetContract.approve(inheritasAddress, asset.tokenId);		
		} else if (asset.tokenType === "ERC1155") {
			const assetContract = new ethers.Contract(asset.contract.address, erc1155Abi, signer);
			await assetContract.setApprovalForAll(inheritasAddress, true);		
		}
	}
	
	async function fecthLifeTimePassData() {
		const hasLifeTime =  await inheritas.lifeTimePass(address);
		setHasLifeTimePass(hasLifeTime);
	}
	
	// Listeners
	
	const onLearnClick = () => {
		setLearnMore(prevLearnMore => !prevLearnMore);
	}

	
	const onNewAssetEvent = () => {
		const event = inheritas.filters.NewAsset();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new ethers.utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.owner) {
				setToast(true, "Asset Registered Successfully");
				setRefresh((prevRef) => prevRef + 1);
			}
		});
	}
	
	const onClaimedEvent = () => {
		const event = inheritas.filters.Claimed();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new ethers.utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.to) {
				setToast(true, "Asset Claimed Successfully!");
				setRefresh((prevRef) => prevRef + 1);
			}
		});	
	}
	
	const onAliveEvent = () => {
		const event = inheritas.filters.Alive();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new ethers.utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.owner) {
				setToast(true, "Asset Updated Successfully!");
				setRefresh((prevRef) => prevRef + 1);
			}
		});
	}
	
	const onLifeTimePassSoldEvent = () => {
		const event = inheritas.filters.LifeTimePassSold();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new ethers.utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.buyer) {
				setToast(true, "LifeTime Pass Bought Successfully!");
				setRefresh((prevRef) => prevRef + 1);
			}
		});	
	}
	
	const setToast = (state, message) => {
		if (message.includes("user rejected")) {
			message = "Transaction Rejected"
		} else if (message.includes("reason=")) {
			message = message.slice(message.indexOf('reason="')+8, message.indexOf('", method="'));
		}
		if (state) {
			toast.success(message, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark"
			});
		} else {
			toast.error(message, {
				position: "top-center",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				theme: "dark"
			});		
			setIsLoading(false);
		}
		setIsLoading(false);
	}
	
	useEffect(() => {
		if (address) fetchNfts();
		// eslint-disable-next-line
	}, [address, refresh]);

	useEffect(() => {
		if (inheritas) fecthLifeTimePassData();
		// eslint-disable-next-line
	}, [inheritas, refresh]);

	useEffect(() => {
		if (!address) connect();
		// eslint-disable-next-line
	}, []);

	return (
	<div className="min-h-screen flex flex-col">
		<div className="bg-[#1dc071] min-w-screen flex justify-center">
			<Link to="/lifetimepass">
				Buy a <u>LifeTime Pass</u> and get FREE access to the Inheritas service. Unlimited assets by only 0.1 eth
			</Link>
		</div>
	
		<div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row">
			
			<div className="sm:flex hidden mr-10 relative">
				<Sidebar address={address} isLoading={isLoading} />
			</div>
			
			<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
				
				<Navbar 
					address={address}
					connect={connect}  
				/>
				
				{ !address &&
					<>
						<Hero 
							onActionClick={connect}
							onLearnClick={onLearnClick}
							actionTitle="Connect"
							learnTitle={learnMore ? "Hide Guides" : "Learn More"} 
						/>
						{learnMore && <Guides />}
						<AccordionFAQ />
					</>
				}
			
			 	{ address &&
					<Routes>
						<Route path="/" element={<Navigate to="/portfolio" />} />
					
						<Route default path="/portfolio" element={
							<DisplayNfts 	
								nfts={inheritasNfts.filter(nft => nft.deadline > 0)} 
								title="Inheritas Assets"
								msg="No assets registered. Press Register Asset to register an asset into the Inheritas service."
								isLoading={isLoading}
							/>
						} />
						
						<Route path="/select-asset" element={
							<DisplayNfts 
								nfts={nfts} 
								title="Select an asset to register into the Inheritas service"
								msg="No assets found. Try refreshing the site or connecting another wallet."
								isLoading={isLoading}
							/>
						} />
						
						<Route path="/add-asset" element={
							<AddAsset 
								inheritas={inheritas} 
								approveAsset={approveAsset}
								hasLifeTimePass={hasLifeTimePass}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								setToast={setToast}
								onNewAssetEvent={onNewAssetEvent}
							/>
						} />
						
						<Route path="/asset-details/:id" element={
							<AssetDetails 
								inheritas={inheritas}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								setToast={setToast}
								onAliveEvent={onAliveEvent}
							/>
						} />
						
						<Route path="/claim-asset" element={
							<ClaimAsset 
								inheritas={inheritas} 
								address={address}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								setToast={setToast}
								onClaimedEvent={onClaimedEvent}
							/>
						} />
						
						<Route path="/lifetimepass" element={
							<BuyLifeTimePass 
								inheritas={inheritas} 
								hasLifeTimePass={hasLifeTimePass}
								setToast={setToast}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								onLifeTimePassSoldEvent={onLifeTimePassSoldEvent}
							/>
						} />
						
						<Route path="/faq" element={<Learn />} />
						
						<Route path="/logout" element={
							<Logout disconnect={disconnect} />
						} />
						
						<Route path="*" element={<Navigate to="/portfolio" />} />
					</Routes>
				}
			</div>   
		</div>
		
		<Footer />

		<ToastContainer
			position="top-center"
			autoClose={5000}
			hideProgressBar={false}
			newestOnTop={false}
			closeOnClick
			rtl={false}
			pauseOnFocusLoss={false}
			draggable
			pauseOnHover={true}
			theme="dark"
		/>
	</div>
	);
}

export default App;
