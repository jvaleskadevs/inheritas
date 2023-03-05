import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

import { ethers } from 'ethers';
//import { useAccount } from 'wagmi';

import { Loader, CustomButton } from '../components';
import { copyIcon, copySuccess } from '../assets';


const AssetDetails = ({ inheritas, setToast, isLoading, setIsLoading, onAliveEvent }) => {
	const { state } = useLocation();
	//const { address } = useAccount();
	//console.log(state);
	const deadline = new Date(ethers.BigNumber.from(state.deadline).toNumber() * 1000).toISOString().split('T')[0];
	const amount = state.decimals ? (ethers.BigNumber.from(state.amount) / Math.pow(10, state.decimals)) : ethers.BigNumber.from(state.amount).toString();
	const navigate = useNavigate(); 
	
	const [form, updateForm] = useState({
		deadline: deadline,
		beneficiary: state.beneficiary,
		amount: amount
	});
		
	const [copiedSuccess, setCopiedSuccess] = useState(false);

/*
	const assetID = ethers.utils.solidityKeccak256(
		["address", "uint", "address"], 
		[
			state.contractAddress || state.contract?.address, 
			Number(state.tokenId) || 0, 
			address
		]
	);	
*/
	const assetID = ethers.BigNumber.from(state.assetID).toString();
	const handleUpdate = async (e) => {
		e.preventDefault();
		
		//console.log("Form:", form);
		//console.log(form.deadline);
		//console.log(new Date(form.deadline).getTime() / 1000);
		//console.log(new Date(form.deadline).getTime());
		try {
			setIsLoading(true);
			await inheritas.alive(
				assetID,
				ethers.BigNumber.from(new Date(form.deadline).getTime() / 1000),
				form.beneficiary,
				form.amount
			);
			setToast(true, "Transaction sent");
			onAliveEvent();
			setIsLoading(false);
			
			navigate('/');
		} catch (err) {
			setToast(false, err.message);
			console.log(err);
		}
	}
	
	const handleCopyAssetID = (e) => {
		setCopiedSuccess(true);
		navigator.clipboard.writeText(assetID);
	}

	return (
		<div>
			{ isLoading && <Loader/> }
			
			<div className="w-full flex md:flex-row flex-col mt-10 gap-[30px]">
				<div className="flex-1 flex-col">
					<img src={state.logo || state.rawMetadata?.image} alt="asset" className="w-[60%] h-[410px] object-cover rounded-xl object-contain"/>
				</div>
			</div>
			
			<div className="mt-[60px] flex lg:flex-row flex-col gap-5">
				<div className="flex-[2] flex flex-col gap-[40px]">
					<div>
						<h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">{state.title || state.symbol}</h4>
					</div>
					
					<div className="border-2 border-[#1dc071] rounded-xl p-4">
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase">Inheritas Asset ID</h4>
						<div className="flex flex-row">
							<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{assetID}</p>
							<button 
								className="mx-2 mx-2 text-violet-500 hover:text-violet-600 active:text-violet-700 w-[16px] h-[16px]"
								onClick={handleCopyAssetID}
							>
								<img src={copiedSuccess ? copySuccess : copyIcon} alt="copy" className="object-contain hover:grayscale" />
							</button>
						</div>
					</div>
					
					<div className="flex flex-col gap-1">
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase mt-4">Description</h4>
						<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.description || state.name}</p>
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase mt-4">Beneficiary</h4>
						<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.beneficiary}</p>
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase mt-4">Amount</h4>
						<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{amount}</p>
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase mt-4">Claimable after</h4>
						<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{deadline}</p>
						<h4 className="font-epilogue font-semibold text-[16px] text-white uppercase mt-4">Owner</h4>
						<p className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">{state.owner}</p>

					</div>
				</div>
				
				<div className="flex-1">
				  <h4 className="font-epilogue font-semibold text-[18px] text-white uppercase">Update Asset</h4>   
				  <div className="mt-[20px] flex flex-col p-4 bg-[#1c1c24] rounded-[10px]">
				      <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191] mb-[16px]">
				        Term
				      </p>
				    
				      <input 
				        type="date"
				        placeholder=""
				        className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
				        value={form.deadline}
				        onChange={(e) => updateForm({...form, deadline: e.target.value})}
				      />
				      <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191] my-[16px]">
				      Beneficiary
				      </p>
				      <input
				      	type="text"
				      	placeholder=""
				      	className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
				      	value={form.beneficiary}
				      	onChange={(e) => updateForm({...form, beneficiary: e.target.value})}
				      />
				      <p className="font-epilogue fount-medium text-[20px] leading-[30px] text-center text-[#808191] my-[16px]">
				      Amount
				      </p>
				      <input
				      	type="number"
				      	placeholder=""
				      	className="w-full py-[10px] sm:px-[20px] px-[15px] outline-none border-[1px] border-[#3a3a43] bg-transparent font-epilogue text-white text-[18px] leading-[30px] placeholder:text-[#4b5264] rounded-[10px]"
				      	value={form.amount}
				      	onChange={(e) => updateForm({...form, amount: state.tokenType !== "ERC721" ? e.target.value : 1})}
				      />

				      <div className="my-[20px] p-4 bg-[#13131a] rounded-[10px]">
				        <p className="font-epilogue font-normal leading-[22px] text-[#808191]">Extend the term, change the beneficiary or update the amount</p>
				      </div>

				      <CustomButton 
				        btnType="button"
				        title="Update"
				        styles="w-full bg-[#8c6dfd]"
				        handleClick={handleUpdate}
				      />
				  </div>	
			  </div>			
			</div>
		</div>
	);
}

export default AssetDetails;
