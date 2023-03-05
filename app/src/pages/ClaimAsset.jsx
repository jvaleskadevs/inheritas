/* global BigInt */
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useAccount} from 'wagmi';
import { CustomButton, DisplayTokens, DisplayNfts, FormField, Loader } from '../components';


const ClaimAsset = ({ inheritas, setToast, isLoading, setIsLoading, onClaimedEvent, logs, getTokenMetadata, getNftMetadata }) => {
	const navigate = useNavigate();
	
	const { address } = useAccount();

	const [assetID, setAssetID] = useState("");
	const [tokensLogs, setTokensLogs] = useState([]);
	const [nftsLogs, setNftsLogs] = useState([]);
	
	const filterLogs = async () => {
		let tokens = [];
		let nfts = [];
		for (let i = 0; i < logs.length; i++) {
			if (logs[i].name === 'NewAsset' || logs[i].name === 'Alive') {
				if (logs[i].args.beneficiary === address) {
					if (logs[i].args.erc === 2) {
						const metadata = await getTokenMetadata(
							logs[i].args.contractAddress
						);
						for (let j = 0; j < tokens.length; j++) {
							if (tokens[j].name === metadata.name) {
								tokens.splice(j, 1);
							}
						}
						console.log("here")
						tokens.push({ 
							...metadata, ...logs[i].args
						});
						console.log(tokens);
					} else {
						const metadata = await getNftMetadata(
							logs[i].args.contractAddress, 
							logs[i].args.tokenID,
							logs[i].args.erc === 0 ? 'ERC721' : 'ERC1155'
						);
						for (let j = 0; j < nfts.length; j++) {
							if (nfts[j].name === metadata.name) {
								nfts.splice(j, 1);
							}
						}
						nfts.push({
							...metadata, ...logs[i].args
						});
						console.log(nfts);
					}
				}
			}
		};
		
		setTokensLogs(tokens);
		setNftsLogs(nfts);
		
	}
	
	const handleFormFieldChange = (e) => {
		setAssetID(e.target.value);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const asset = await inheritas.assets(assetID);
			console.log(assetID);
			
			const now = BigInt(Math.floor(new Date().getTime() / 1000));
			if (asset.deadline > now) {
				setToast(false, "The date limit has not yet been reached");
				return;
			}
			console.log("add",address);
			console.log(asset);
			console.log(asset.beneficiary);
			if (asset.beneficiary !== address) {
				setToast(false, "Your are not the beneficiary of this asset");
				return;
			}
		
			setIsLoading(true);
			
			await inheritas.claim(
				assetID
			);
			
			setToast(true, "Transaction sent");
			onClaimedEvent();
			setIsLoading(false);
			navigate('/');
		} catch (err) {
			setToast(false, "Something went wrong");
			console.log(err);		
		}
	}
	
	useEffect(() => {
		if (tokensLogs.length === 0) filterLogs(logs);
		// eslint-disable-next-line
	}, [logs]);
	
	return (
	<div className="flex flex-col">
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{isLoading && <Loader />}
			
			<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Claim an Asset</h1>
			</div>			
			
			<form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
				<FormField
					labelName="Asset ID"
					placeholder="0x0000000000000000000000000000000000000000"
					inputType="text"
					value={assetID}
					handleChange={(e) => handleFormFieldChange(e)}
				/>
				
				<div className="flex justify-center items-center mt-[40px]">
					<CustomButton 
						btnType="submit"
						title="Claim"
						styles="bg-[#1dc071] min-w-[50%]"
					/>
				</div>			
			</form>
		</div>	
		
			{ logs && tokensLogs.length > 0 && <DisplayTokens title="You are the beneficiary of the following tokens" tokens={tokensLogs} />}
			
			{ nftsLogs && nftsLogs.length > 0 && <DisplayNfts title="You are the beneficiary of the following NFTs" nfts={nftsLogs} />}
	</div>	
	);
}

export default ClaimAsset;
