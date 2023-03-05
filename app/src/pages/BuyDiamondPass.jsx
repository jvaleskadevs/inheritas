import { useNavigate } from 'react-router-dom';

import { ethers } from 'ethers';

import { Loader, CustomButton, FormField } from '../components';

const BuyDiamondPass = ({ inheritas, hasDiamondPass, hasIDPNFT, IDPtokenID, setToast, isLoading, setIsLoading, onDiamondPassSoldEvent }) => {
	const navigate = useNavigate();
	
	if (!inheritas) navigate('/');
	
	const handleBuyDiamondPass = async () => {
		try {
			setIsLoading(true);
			
			if (hasDiamondPass) {
				setToast(false, "Already have a Diamond Pass!");
				return;
			}
			await inheritas.buyDiamondPass(
				{ value: ethers.utils.parseEther("0.1") }
			);
			setToast(true, "Transaction sent");
			onDiamondPassSoldEvent();
			setIsLoading(false);
			navigate('/');
		} catch (err) {
			setToast(false, err.message);
			console.log(err);			
		}
	}
	
	const handleClaimDiamondPass = async () => {
		try {
			setIsLoading(true);
			
			if (hasDiamondPass) {
				setToast(false, "Already have a Diamond Pass!");
				return;
			}
			await inheritas.claimDiamondPass(
				hasIDPNFT
			);
			setToast(true, "Transaction sent");
			onDiamondPassSoldEvent();
			setIsLoading(false);
			navigate('/');
		} catch (err) {
			setToast(false, err.message);
			console.log(err);			
		}
	}
	
	return (
		<div className="bg-[#1c1c24] flex justify-center items-center flex-col rounded-[10px] sm:p-10 p-4">
			{ isLoading && <Loader/> }
			
			
			<div className="flex justify-center items-center p-[16px] sm:min-w-[380px] bg-[#3a3a43] rounded-[10px]">
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">{ hasIDPNFT ? "Claim " : "Buy "} a Diamond Pass</h1>
			</div>
			<div className="w-full mt-[65px] flex flex-col gap-[30px]">
					<h2 className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Enjoy the unlimited FREE access to the Inheritas service by just 0.1 ETH. <br/>Register an unlimited number of assets and be assured that all your loved ones will receive their assets. <small>(This offer expirates in June)</small></h2>
					<FormField 
						labelName="Item"
						inputType="text"
						value={"Inheritas Diamond Pass"}
						readOnly
					/>
					<FormField 
						labelName="Amount"
						inputType="text"
						value={"1"}
						readOnly
					/>
					<FormField 
						labelName="Price"
						inputType="text"
						value={hasIDPNFT ? "FREE · Inheritas Diamond Pass Holder" : "0.1 ETH"}
						readOnly
					/>
					
					
					{ hasIDPNFT ? (<h3 className="font-epilogue font-normal text-[14px] text-[#808191] leading-[22px] text-justify mx-[16px] mt-[-24px]">* To claim your Diamond Pass, your IDP will be burned. This action will be irreversible.</h3>) : ""}
					
					
					<div className="flex justify-center items-center mt-[40px]">
						<CustomButton 
							btnType="button"
							title={ hasIDPNFT ? "Claim Diamond Pass" : "Buy Diamond Pass"}
							styles="bg-[#1dc071] min-w-[50%]"
							handleClick={() => { hasIDPNFT 
													? handleClaimDiamondPass() 
													: handleBuyDiamondPass() 
							}}
						/>
					</div>
			</div>
		</div>
	);
}

export default BuyDiamondPass;
