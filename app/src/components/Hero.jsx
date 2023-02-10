import { heroImg } from '../assets';
import CustomButton from './CustomButton';

const Hero = ({ onActionClick, onLearnClick, actionTitle, learnTitle }) => {
	
	return (
		<div className="flex flex-col-reverse md:flex-row flex-nowrap p-8 mb-[16px] justify-center md:justify-between align-center">
			<div className="flex flex-col w-[80%] md:w-[40%] justify-center align-center lg:flex-start">
				<h2 className="mb-6 text-2xl text-gray-500 text-bold sm:text-center text-gray">EASY, SAFE, FAST, NO THIRD PARTIES</h2>
				<h1 className="text-4xl font-bold tracking-tight sm:text-center sm:text-6xl text-white"><span className="text-[#8c6dfd]">Inherit</span>s web3<span className="text-[#8c6dfd]"> as</span>sets</h1>
				
				<p className="mt-4 mb-6 text-lg leading-2 text-gray-300 text-bold sm:text-center ">Inheritas, the easiest way to manage the inheritance of web3 assets. Ensure that your loved ones receive their assets without any problems. No third parties, no paperwork, safe, fast, simple, decentralised.</p>
				<div className="flex flex-row justify-around">
					<CustomButton
						btnType="button"
						title={actionTitle}
						styles={'bg-[#8c6dfd] w-[40%]'}
						handleClick={() => onActionClick()}
					/>
					<CustomButton
						btnType="button"
						title={learnTitle}
						handleClick={() => onLearnClick()}
					/>
				</div>
			</div>
			<div className="w-[80%] md:w-[50%] mb-[12px] rounded-[64px]">
				<img src={heroImg} alt="" className="w-full h-full rounded-[10px] object-contain" />
			</div>
		</div>		
	);
}

export default Hero;
