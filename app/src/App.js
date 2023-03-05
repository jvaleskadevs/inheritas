import { useState, useEffect } from 'react';
import { Route, Routes, Navigate, Link } from 'react-router-dom';

import { ethers } from 'ethers';
import { Alchemy, Network, NftFilters, Utils } from "alchemy-sdk";

import { Logout, AddAsset, AssetDetails, ClaimAsset, Learn, BuyDiamondPass, History } from './pages';
import { Navbar, Sidebar, Hero, AccordionFAQ, Guides, DisplayNfts, DisplayTokens, Footer } from './components';
import { inheritasAbi, inheritasAddress, erc721Abi, erc1155Abi, erc20Abi, idpAddress } from './constants';

import { ToastContainer, toast } from 'react-toastify';
import "react-toastify/dist/ReactToastify.css";

import { useConnectModal } from '@rainbow-me/rainbowkit';
import { useAccount, useDisconnect, useSigner, useProvider } from 'wagmi';


function App() {
	const settings = { 
		apiKey: process.env.REACT_APP_API,
		network: Network.ETH_GOERLI
	}
	const alchemy = new Alchemy(settings);	
	
	//const [provider, setProvider] = useState({});
	//const [signer, setSigner] = useState({});
	//const [address, setAddress] = useState("");
	const [inheritas, setInheritas] = useState({});
	
	const [tokens, setTokens] = useState([]);
	const [nfts, setNfts] = useState([]);
	const [inheritasTokens, setInheritasTokens] = useState([]);
	const [inheritasNfts, setInheritasNfts] = useState([]);
	const [hasDiamondPass, setHasDiamondPass] = useState(false);
	const [hasIDPNFT, setHasIDPNFT] = useState(0);
	const [logs, setLogs] = useState([]);
	
	const [isLoading, setIsLoading] = useState(false);
	const [refresh, setRefresh] = useState(0);
	const [learnMore, setLearnMore] = useState(false);
	
	const { openConnectModal } = useConnectModal();
	const { data: signer } = useSigner({
		onSuccess(data) {
			console.log('Success-signer', data);
			setIsLoading(true);
			const inheritasContract = getInheritasContract(data);
			console.log(inheritasContract);
			setInheritas(inheritasContract);
		}
	});
	const { address, isConnected } = useAccount();
	const provider = useProvider();
	const disconnect = useDisconnect({
		onSuccess(data) {
			console.log('Success-disconnect', data);
			setInheritas({});
			setNfts([]);
			setInheritasNfts([]);
			setHasDiamondPass(false);
			setHasIDPNFT(0);
		}
	});
/*	
	async function connect() {
		setIsLoading(true);

		const provider = new ethers.providers.Web3Provider(window.ethereum);
		console.log(provider);
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
		//setSigner({});
		//setAddress("");
		setInheritas({});
		setNfts([]);
		setInheritasNfts([]);
	}
*/	
	const onConnectClick = () => {
		if (openConnectModal) openConnectModal();
	}
	
	const onDisconnectClick = () => {
		disconnect.disconnect();
	}
	
	
	function getInheritasContract(signerOrProvider) {
		return new ethers.Contract(inheritasAddress, inheritasAbi, signerOrProvider);
	}
	
	async function fetchTokens() {
		/*
		let ownedTokens = [{
			contractAddress: null,
			decimals: 18,
			logo: null,
			name: "Ethereum",
			symbol: "ETH",
			tokenBalance: (await alchemy.core.getBalance(address)).toHexString()
		}];
		*/
		let ownedTokens = [];
		const balances = await alchemy.core.getTokenBalances(address);
		for (let token of balances.tokenBalances) {
			if (token.tokenBalance > 0) {
				const metadata = await getTokenMetadata(token.contractAddress);
				ownedTokens.push({...token, ...metadata});
			}
		}
		setTokens(ownedTokens);
		console.log("tokens:", ownedTokens);
	}
	
	async function getTokenMetadata(contractAddress) {
		return await alchemy.core.getTokenMetadata(contractAddress);
	}
	
	async function getNftMetadata(contractAddress, tokenId, erc) {
		return await alchemy.nft.getNftMetadata(contractAddress, tokenId, erc);
	}
	
	async function fetchInheritasTokens(ownedTokens) {
		const items = [];
		for (let i = 0; i < ownedTokens.length; i++) {
			const data = await fetchInheritasData(ownedTokens[i]);
			if (data?.deadline > 0 && data?.owner === address) {
				items.push({...ownedTokens[i], ...data});
			} else {
				items.push({...ownedTokens[i]});
			}
		}
		setInheritasTokens(items);
		if (inheritasNfts) setIsLoading(false);
		return items;		
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
		
		//const userInheritasNfts = await fetchInheritasNfts(ownedNfts);
		//setInheritasNfts(userInheritasNfts);
		
		//setIsLoading(false);	
	}
	
	async function fetchOwnedNftsBy(page) {
		console.log("Fetching: ", page);
		
		const data = await alchemy.nft.getNftsForOwner(address, { 
			pageKey: page, 
			//excludeFilters: [NftFilters.SPAM]  
		});
		
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
			if (ownedNfts[i].contract.address === idpAddress.toLowerCase()) {
				setHasIDPNFT(ownedNfts[i].tokenId);
			}
		}
		setInheritasNfts(items);
		if (inheritasTokens) setIsLoading(false);
		return items;
	}
	
	async function fetchInheritasData(asset) {
		//if (asset.symbol === 'ETH') return; // TODO: remove eth or add support
		console.log(asset);
		if (!isConnected) return;
		const assetID = ethers.utils.solidityKeccak256(
			["address", "uint", "address"], 
			[
				asset.contractAddress || asset.contract?.address, 
				asset.tokenId || 0, 
				address
			]
		);
		const data = await inheritas.assets(assetID);
		console.log(data);
		return data;
	}
	
	async function approveAsset(asset) {
		if (asset.tokenType === "ERC721") {
			const assetContract = new ethers.Contract(asset.contract.address, erc721Abi, signer);
			if ((await assetContract.getApproved(asset.tokenId)) !== inheritasAddress) {
				await assetContract.approve(inheritasAddress, asset.tokenId);
			}		
		} else if (asset.tokenType === "ERC1155") {
			const assetContract = new ethers.Contract(asset.contract.address, erc1155Abi, signer);
			if (!(await assetContract.isApprovedForAll(inheritasAddress))) {
				await assetContract.setApprovalForAll(inheritasAddress, true);
			}	
		} else if (asset.tokenBalance) {
			const assetContract = new ethers.Contract(asset.contractAddress, erc20Abi, signer);
			await assetContract.approve(inheritasAddress, asset.amount);
		}
	}
	
	async function fetchDiamondPassData() {
		const hasDiamond =  await inheritas.diamondPass(address);
		console.log(hasDiamond)
		setHasDiamondPass(hasDiamond);
	}
	
	async function fetchLogs() {
		//const topics = new Utils.Interface(inheritasAbi).encodeFilterTopics('', []);
		const data = (await alchemy.core.getLogs({
			fromBlock: '0x0',
			toBlock: 'latest',
			address: inheritasAddress,
			//topics: topics
		})).filter(log => 
			log.topics.includes(Utils.hexZeroPad(address.toLowerCase(), 32))
		);
		const iface = new Utils.Interface(inheritasAbi);
		const parsedLogs = data.map(log => iface.parseLog(log));
		setLogs(parsedLogs);
	}
	
	// Listeners
	
	const onLearnClick = () => {
		setLearnMore(prevLearnMore => !prevLearnMore);
	}

	
	const onNewAssetEvent = () => {
		const event = inheritas.filters.NewAsset();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new Utils.Interface(inheritasAbi))
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
			const parsedLogs = (new Utils.Interface(inheritasAbi))
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
			const parsedLogs = (new Utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.owner) {
				setToast(true, "Asset Updated Successfully!");
				setRefresh((prevRef) => prevRef + 1);
			}
		});
	}
	
	const onDiamondPassSoldEvent = () => {
		const event = inheritas.filters.DiamondPassSold();
		provider.removeListener(event);
		
		provider.on(event, (logs) => {
			const parsedLogs = (new Utils.Interface(inheritasAbi))
									.parseLog(logs);
			
			console.log(parsedLogs);
			
			if (address === parsedLogs.args.buyer) {
				setToast(true, "Diamond Pass Bought Successfully!");
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
		if (address) fetchNfts() && fetchTokens() && console.log("Reloading");
		// eslint-disable-next-line
	}, [address, refresh]);
	
	useEffect(() => {
		if (nfts && inheritas) fetchInheritasNfts(nfts) && console.log("Reloading nfts");
		// eslint-disable-next-line
	}, [nfts, inheritas]);
	
	useEffect(() => {
		if (tokens && inheritas) fetchInheritasTokens(tokens) && console.log("Reloading tokens");
		// eslint-disable-next-line
	}, [tokens, inheritas]);

	useEffect(() => {
		if (inheritas?.diamondPass) fetchDiamondPassData() && fetchLogs() && console.log("Reloading logs");
		// eslint-disable-next-line
	}, [inheritas, refresh]);

	useEffect(() => {
		//if (!address) connect();
		// eslint-disable-next-line
	}, []);

	return (
	<div className="min-h-screen flex flex-col">
		<div className="bg-[#1dc071] min-w-screen flex justify-center">
			<Link to="/diamondpass">
				{ hasIDPNFT ? "Claim your" : "Buy a" } <u>Diamond Pass</u> now and get FREE unlimited assets inheritance { hasIDPNFT ? "" : "by only 0.1 ETH"} 
				{//Buy a <u>Diamond Pass</u> now and get FREE access to the Inheritas service. Unlimited assets inheritance by only 0.1 eth"}
				}
			</Link>
		</div>
	
		<div className="relative sm:-8 p-4 bg-[#13131a] min-h-screen flex flex-row  pb-[80px]">
			
			<div className="sm:flex hidden mr-10 relative">
				<Sidebar address={address} isLoading={isLoading} />
			</div>
			
			<div className="flex-1 max-sm:w-full max-w-[1280px] mx-auto sm:pr-5">
				
				<Navbar 
					address={address}
					connect={openConnectModal}  
				/>
				
				{ !address &&
					<>
						<Hero 
							onActionClick={onConnectClick}
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
							<>
								<DisplayTokens
									tokens={inheritasTokens.filter(token => token.deadline > 0)}
									title="Your Inheritas tokens"
									msg="No ERC20 assets found. Try refreshing the site or connecting another wallet."
									isLoading={isLoading}
								/>
								<DisplayNfts 	
									nfts={inheritasNfts.filter(nft => nft.deadline > 0)} 
									title="Your Inheritas NFTs"
									msg="No assets registered. Press Register Asset to register an asset into the Inheritas service."
									isLoading={isLoading}
								/>
							</>
						} />
						
						<Route path="/select-asset" element={
							<>
								<DisplayTokens
									tokens={tokens}
									title="Select an asset to register into the Inheritas service"
									msg="No ERC20 assets found. Try refreshing the site or connecting another wallet."
									isLoading={isLoading}
								/>
								<DisplayNfts 
									nfts={nfts} 
									title="Select an asset to register into the Inheritas service"
									msg="No assets found. Try refreshing the site or connecting another wallet."
									isLoading={isLoading}
								/>
							</>
						} />
						
						<Route path="/add-asset" element={
							<AddAsset 
								inheritas={inheritas} 
								approveAsset={approveAsset}
								hasDiamondPass={hasDiamondPass}
								hasIDPNFT={hasIDPNFT}
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
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								setToast={setToast}
								onClaimedEvent={onClaimedEvent}
								logs={logs}
								getTokenMetadata={getTokenMetadata}
								getNftMetadata={getNftMetadata}
							/>
						} />
						
						<Route path="/diamondpass" element={
							<BuyDiamondPass 
								inheritas={inheritas} 
								hasDiamondPass={hasDiamondPass}
								hasIDPNFT={hasIDPNFT}
								setToast={setToast}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
								onDiamondPassSoldEvent={onDiamondPassSoldEvent}
							/>
						} />
						
						<Route path="/history" element={
							<History
								address={address}
								logs={logs}
								isLoading={isLoading}
								setIsLoading={setIsLoading}
							/>
						} />
						
						<Route path="/faq" element={<Learn />} />
						
						<Route path="/logout" element={
							<Logout disconnect={onDisconnectClick} />
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
