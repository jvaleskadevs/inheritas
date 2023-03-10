import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { CustomButton } from './';
import { navLinks } from '../routes';
import { logo, menu, profile, inheritasW } from '../assets';

const Navbar = ({ address, connect }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [currentRoute, setCurrentRoute] = useState('portfolio');
	const [toggleDrawer, setToggleDrawer] = useState(false);
	
	let buttonText = address ? location.pathname === '/portfolio' ? "Register Asset" : "Back" : "Connect";
	//let isSearchBarVisible = location.pathname === '/portfolio' || location.pathname === '/select-asset';
	console.log(address);
	console.log(location.pathname);
	
	return (
		<div className="flex md:flex-row flex-col-reverse justify-between mb-[55px] gap-6">
			<div className="hidden sm:flex">
				<img src={inheritasW} alt="inheritas" className="w-[90%] h-[90%] object-contain" />
			</div>
{/*			
			{ isSearchBarVisible && (
				<div className="lg:flex-1 flex flex-row max-w-[458px] py-2 pl-4 pr-2 h-[52px] bg-[#1c1c24] rounded-[100px]">
					
					<input 
						type="text" 
						placeholder="Search for assets" 
						className="flex w-full font-epilogue font-normal text-[14px] placeholder:text-[#4b5264] text-white bg-transparent outline-none"
						handleChange={(e) => onSearchBarTextChanged(e)}
					/>
					<div className="w-[72px] h-full rounded-[20px] bg-[#4acd8d] flex justify-center items-center cursor-pointer">
						<img src={search} alt="search" className="w-[15px] h-[15px] object-contain" />
					</div>
				</div>
			)}
*/}			
			<div className="sm:flex hidden flex-row justify-end gap-4 w-[20%]">
				<CustomButton
					btnType="button"
					title={buttonText}
					styles={address ? 'bg-[#1dc071] w-full' : 'bg-[#8c6dfd] w-full'}
					handleClick={() => {
						if (address) {
							if (location.pathname === '/portfolio') {
								navigate('select-asset');
							} else {
								navigate(-1);
							}
						}
						else connect();
					}}
				/>
				{ address && (	
				<Link to="/portfolio">
					<div className="w-[52px] h-[52px] rounded-full bg-[#2c2f32] flex justify-center items-center cursor-pointer">
						<img src={profile} alt="user" className="w-[60%] h-[60%] object-contain"/>
					</div>
				</Link>
				)}
			</div>
			
			{/* small screen navigation */}
			<div className="sm:hidden flex justify-between items-center relative">
				<div className="w-[40px] h-[40px] rounded-[10px] bg-[#2c2f32] flex justify-center items-center cursor-pointer">
					<img src={logo} alt="logo" className="w-[60%] h-[60%] object-contain" />
				</div>
				<div>
					<img src={inheritasW} alt="inheritas" className="w-[90%] h-[90%] object-contain" />
				</div>				
				<img src={menu} alt="menu" className="w-[34px] h-[34px] object-contain cursor-pointer" onClick={() => setToggleDrawer((prev) => !prev)}/>
				
				<div className={`absolute top-[60px] right-0 left-0 bg-[#1c1c24] z-10 shadow-secondary py-4 ${!toggleDrawer ? '-translate-y-[100vh]' : 'translate-y-0'} transition-all duration-700`}>
					<ul className="mb-4">
						{navLinks.map((link) => (
							<li
								key={link.name}
								className={`flex p-4 ${currentRoute === link.name && 'bg-[#3a3a43]'}`}
								onClick={() => {
									setCurrentRoute(link.name);
									setToggleDrawer(false);
									navigate(link.link);
								}}
							>
								<img 
									src={link.imgUrl}
									alt={link.name}
									className={`w-[24px] h-[24px] object-contain ${currentRoute === link.name ? 'grayscale-0' : 'grayscale'}`}
								/>
								
								<p className={`ml-[20px] font-epilogue font-semibold text-[14px] ${currentRoute === link.name ? 'text-[#1dc071]' : 'text-[#808191]'}`}>
									{link.name}
								</p>
							</li>
						))}
					</ul>
					
					<div className="flex mx-4">
						<CustomButton 
							btnType="button"
							title={buttonText}
							styles={address ? 'bg-[#1dc071]' : 'bg-[#8c6dfd]'}
							handleClick={() => {
								if (address) {
									if (currentRoute === 'portfolio') {
										navigate('select-asset');
									} else {
										navigate(-1);
									}
								}
								else connect();
							}}
						/>
					</div>
				</div>
			</div>			
		</div>
	);
}

export default Navbar;
