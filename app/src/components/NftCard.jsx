import { CustomButton } from './';

const NftCard = ({ tokenId, rawMetadata, deadline, handleClick }) => {
	const name = rawMetadata?.name;
	const image = rawMetadata?.image;
	
	return (
		<div className="sm:w-[288px] w-full rounded-[15px] bg-[#1c1c24] cursor-pointer" onClick={handleClick}>
			<img src={image} alt={name} className="w-full h-[158px] object-cover rounded-[15px]"/>
			
			<div className="flex flex-col p-4">
				<div className="block w-full">
					<h3 className="font-epilogue font-semibold text-[16px] text-white text-left leading-[26px] truncate">{name} #{tokenId}</h3>
					{ !deadline && (
						<CustomButton
							btnType="button"
							title="Register"
							handleClick={handleClick}
							styles='bg-[#8c6dfd] w-full mt-[16px]'
						/>						
					)}
				</div>
			</div>
		</div>
	);
}

export default NftCard;
