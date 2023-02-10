import { useNavigate } from 'react-router-dom';

import { ethers } from 'ethers';

import { Loader, CustomButton, FormField } from '../components';

const BuyLifeTimePass = ({ inheritas, hasLifeTimePass, setToast, isLoading, setIsLoading, onLifeTimePassSoldEvent }) => {
	const navigate = useNavigate();
	
	const handleBuyLifeTimePass = async () => {
		try {
			setIsLoading(true);
			
			if (hasLifeTimePass) {
				setToast(false, "Already have a LifeTime Pass!");
				return;
			}
			await inheritas.buyLifeTimePass(
				{ value: ethers.utils.parseEther("0.1") }
			);
			setToast(true, "Transaction sent");
			onLifeTimePassSoldEvent();
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
				<h1 className="font-epilogue font-bold sm:text-[25px] text-[18px] leading-[38px] text-white">Buy a LifeTime Pass</h1>
			</div>
			<div className="w-full mt-[65px] flex flex-col gap-[30px]">
					<h2 className="font-epilogue font-normal text-[16px] text-[#808191] leading-[26px] text-justify">Enjoy the FREE access to the Inheritas service by just 0.1 ETH. <br/>Register an unlimited number of assets and be assured that all your loved ones will receive their assets. <small>(This offer expirates in June)</small></h2>
					<FormField 
						labelName="Item"
						inputType="text"
						value={"Inheritas LifeTime Pass"}
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
						value={"0.1 ETH"}
						readOnly
					/>
					<div className="flex justify-center items-center mt-[40px]">
						<CustomButton 
							btnType="button"
							title="Buy LifeTime Pass"
							styles="bg-[#1dc071] min-w-[50%]"
							handleClick={() => handleBuyLifeTimePass()}
						/>
					</div>
			</div>
		</div>
	);
}

export default BuyLifeTimePass;
