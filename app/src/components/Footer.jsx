import { githubIcon, etherscanIcon, love, alchemy } from '../assets';
import { inheritasAddress } from '../constants';

const Footer = () => {
	
	return (
	<div className="bg-[#1dc071] min-w-screen flex flex-col items-center justify-center">
		<div className="flex flex-row justify-center gap-16 my-[16px]">
			<a href="https://github.com/jvaleskadevs/inheritas" rel="noopener noreferrer" target="_blank">
				<div className="w-[36px] h-[36px] rounded-[10px] flex justify-center items-center cursor-pointer">
					<img src={githubIcon} alt="github" />
				</div>
			</a>
			<a href={`https://goerli.etherscan.io/address/${inheritasAddress}`} rel="noopener noreferrer" target={"_blank"}>
				<div className="w-[36px] h-[36px] rounded-[10px] flex justify-center items-center cursor-pointer">
					<img src={etherscanIcon} alt="etherscan" />
				</div>
			</a>
		</div>
		<div className="flex flex-row bg-black text-white font-bold mb-2 px-4 py-2 rounded-[10px]">
			<span className="w-[24px] h-[24px] rounded-[10px] flex mx-1">
				<img src={alchemy} alt="love" />
			</span> <small className="font-medium">Powered by </small> Alchemy
			
		</div>
		<div className="flex flex-row text-white font-bold mb-2 ">
			Made with <span className="w-[24px] h-[24px] rounded-[10px] flex mx-1">
				<img src={love} alt="love" />
			</span> by @J.Valeska (AU) / @MaestroCripto (DISCORD) · Alchemy SDK Challenge · 2023
		</div>
	</div>
	);
}

export default Footer;
