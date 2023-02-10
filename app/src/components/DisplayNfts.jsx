import { useNavigate } from 'react-router-dom';

import NftCard from './NftCard';
import { loader } from '../assets';
//import InfiniteScroll from "react-infinite-scroll-component";

const DisplayNfts = ({ title, isLoading, nfts, msg }) => {
	const navigate = useNavigate();
	
	//const inheritasNFTs = nfts.filter(nft => nft.deadline > 0);
	
	const handleNavigate = (nft) => {
		if (nft.deadline) {
			navigate(`/asset-details/${nft.title}`, { state: nft });
		} else {
			navigate(`/add-asset`, { state: nft });
		}	
	}
	
	return (
		<div>
			{ nfts && (
				<div>
					<h2 className="font-epilogue font-semibold text-[18px] text-white opacity-[80%] text-left mt-[36px]">{title}</h2>
		
					<div className="flex flex-wrap mt-[20px] gap-[26px]">
				
						{ isLoading && (
							<>
								<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
									This could take a while depending on the number of assets in your wallet.
								</p>
								<img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
							</>
						)}
						
						{ !isLoading && nfts.length === 0 && (
							<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
								{msg}
							</p>
						)}
						
						{ !isLoading && nfts.length > 0 && nfts.map((nft, index) => nft && (
						

							<NftCard
								key={index}
								{...nft}
								handleClick={() => handleNavigate(nft)}
							/>
						))}

					</div>
{/*					

					{ isLoading && (
					<>
						<img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain" />
						<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
							Loading. This could take a while depending on the number of assets in your wallet.
						</p>
					</>
					)}
					
					{ !isLoading && nfts.length === 0 && (
						<p className="font-epilogue font-semibold text-[14px] leading-[30px] text-[#818183]">
							{msg}
						</p>
					)}
					
					<InfiniteScroll
						dataLength={nfts.length} 
						next={fetchNfts}
						hasMore={pageKey}
						loader={<img src={loader} alt="loader" className="w-[100px] h-[100px] object-contain grayscale" />}
						className="flex flex-wrap mt-[20px] gap-[26px]"
					>						
						{ nfts.map((nft, index) => nft && (
						

							<NftCard
								key={index}
								{...nft}
								handleClick={() => handleNavigate(nft)}
							/>
						))}
					</InfiniteScroll>		
*/}			
				</div>
			)}
		</div>	
	);
}

export default DisplayNfts;
