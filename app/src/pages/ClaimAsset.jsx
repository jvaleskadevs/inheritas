/* global BigInt */
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CustomButton, FormField, Loader } from '../components';


const ClaimAsset = ({ inheritas, address, setToast, isLoading, setIsLoading, onClaimedEvent }) => {
	const navigate = useNavigate();

	const [assetID, setAssetID] = useState("");
	
	const handleFormFieldChange = (e) => {
		setAssetID(e.target.value);
	}

	const handleSubmit = async (e) => {
		e.preventDefault();
		
		try {
			const asset = await inheritas.assets(assetID);
			
			const now = BigInt(Math.floor(new Date().getTime() / 1000));
			if (asset.deadline > now) {
				setToast(false, "The date limit has not yet been reached");
				return;
			}
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
	
	return (
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
	);
}

export default ClaimAsset;
