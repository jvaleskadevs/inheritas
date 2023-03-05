import { useNavigate } from 'react-router-dom';
import { loader } from '../assets';


const DisplayTokens = ({ title, tokens, isLoading, msg }) => {
	const navigate = useNavigate();
	
	const handleNavigate = (token) => {
		if (token.deadline) {
			navigate(`/asset-details/${token.symbol.toLowerCase()}`, { state: token });
		} else {
			navigate(`/add-asset`, { state: token });
		}
		
	}

	return (
		<div>
			{ tokens && (
				<div>
					<h2 className="font-epilogue font-semibold text-[18px] text-white opacity-[80%] text-left mt-[36px]">{title}</h2>
					
					<div className="flex flex-row mt-[20px] gap-[26px]">
						{ isLoading && ( 
							<img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" /> 
						)}
						{/*
						<div 
							className="bg-[#8c6dfd] py-2 px-8 rounded-[10px] text-white font-epilogue text-[20px] opacity-[90%] cursor-pointer"
							onClick={() => handleNavigate()}
						>
							<h2>ETH</h2>
						</div>
						*/}
						{ !isLoading && tokens.length > 0 && tokens.map((token, i) => (
							/*
							<img
								key={token.name}
								src={token.logo}
								alt={token.name}
								onClick={() => handleNavigate(token)}
							/>
							*/
							<div 
								key={i} 
								className="bg-[#8c6dfd] py-2 px-8 rounded-[10px] text-white font-epilogue text-[20px] opacity-[90%] cursor-pointer"
								onClick={() => handleNavigate(token)}
							>
								<h2>{token.symbol}</h2>
							</div>
						))}
						
						{ !isLoading && tokens.length === 0 && (
							<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
								{msg}
							</p>
						) }
					</div>
				</div>
			)}
		</div>
	);
}

export default DisplayTokens;
