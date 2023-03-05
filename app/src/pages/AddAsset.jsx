/* global BigInt */
import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';

import { Utils } from 'alchemy-sdk';

import { CustomButton, FormField, Loader } from '../components';


const AddAsset = ({ inheritas, approveAsset, hasDiamondPass, hasIDPNFT, setToast, isLoading, setIsLoading, onNewAssetEvent }) => {
	const navigate = useNavigate();
	const { state } = useLocation();

	const [form, setForm] = useState({
		deadline: "",
		beneficiary: "",
		amount: state.tokenType === 'ERC721' ? "1" : ""
	});	
	
	const handleFormFieldChange = (fieldName, e) => {
		if (fieldName === "amount" && state.tokenType === 'ERC721') return;
		setForm({ ...form, [fieldName]: e.target.value });
	}
	
	const handleSubmit = async (e) => {
		e.preventDefault();
		
		if (form.beneficiary === "0x0000000000000000000000000000000000000000") {
			setToast(false, "Invalid address");
			return;
		}
		if (new Date(form.deadline).getTime() <= new Date().getTime()) {
			setToast(false, "The date limit must be in the future");
			return;
		}
		
		setIsLoading(true);
		
		try {
			state.amount = (form.amount * (10**state.decimals)).toString();
			await approveAsset({...state});
			await inheritas.active(
				BigInt(Math.floor(new Date(form.deadline).getTime() / 1000).toString()),
				form.beneficiary,
				state.contractAddress || state.contract?.address,
				state.tokenId || 0,
				state.tokenType === "ERC721" ? 0 : state.tokenType === "ERC1155" ? 1 : state.tokenBalance ? 2 : null,
				state.decimals ? (form.amount * (10**state.decimals)).toString() : form.amount,
				!hasDiamondPass ? { value: Utils.parseEther("0.01") } : { value: 0}
			);
			setToast(true, "Transaction sent");
			
			onNewAssetEvent();
			
			setIsLoading(false);
			navigate('/');		
		} catch (err) {
			setToast(false, err.message);
			console.log(err);
		}
	}
	
	return (
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{isLoading && <Loader />}
			
			<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Register an Asset</h1>
			</div>
			
					
			
			<form onSubmit={handleSubmit} className="w-full mt-[65px] flex flex-col gap-[30px]">
				<FormField 
					labelName="The beneficiary will be able to claim the asset after"
					placeholder="Insert Date"
					inputType="date"
					value={form.deadline}
					handleChange={(e) => handleFormFieldChange('deadline', e)}
				/>
				<FormField
					labelName="Beneficiary Address"
					placeholder="0x0000000000000000000000000000000000000000"
					inputType="text"
					value={form.beneficiary}
					handleChange={(e) => handleFormFieldChange('beneficiary', e)}
				/>
				
				{ //state.tokenBalance && (
					<FormField
						labelName="Amount"
						placeholder={`Max: ${state.tokenBalance / Math.pow(10, state.decimals)}`}
						inputType="value"
						value={form.amount}
						handleChange={(e) => handleFormFieldChange('amount', e)}
					/>					
				}
				
				<FormField
					labelName="Price"
					placeholder=""
					inputType="text"
					value={ hasDiamondPass 
							? 'FREE · DiamondPass'
							: '0.01 ether'
					}
					readOnly
				/>
				
				{ hasIDPNFT ? 
				<h3 className="font-epilogue font-normal text-[14px] text-[#808191] leading-[22px] text-justify mx-[16px] mt-[-24px]">
					* You can claim your <Link to="/diamondpass"><u>Diamond Pass</u></Link> and get unlimited FREE access to the Inheritas service (only for IDP holders)
				</h3>  : 
				<h3 className="font-epilogue font-normal text-[14px] text-[#808191] leading-[22px] text-justify mx-[16px] mt-[-24px]">
					* Buy a <Link to="/diamondpass"><u>Diamond Pass</u></Link> and get unlimited FREE access to the Inheritas service by only 0.1 ether
				</h3>				
				}
				
				
				<div className="flex justify-center items-center mt-[40px]">
					<CustomButton 
						btnType="submit"
						title="Register"
						styles="bg-[#1dc071] min-w-[50%]"
					/>
				</div>			
			</form>
		</div>
	);
}

export default AddAsset;
