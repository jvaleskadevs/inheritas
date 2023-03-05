import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';

import { navLinks } from '../routes';
import { logo, logout } from '../assets';


const Sidebar = ({ address, isLoading }) => {
	const navigate = useNavigate();
	const location = useLocation();
	
	const [currentRoute, setCurrentRoute] = useState('');
	
	useEffect(() => {
		const defRoute = location.pathname.slice(1).replace("-", " ");
		setCurrentRoute(defRoute);
	}, [address, location.pathname]);
	
	return (
		<div className="flex justify-between items-center flex-col sticky top-5 h-[93vh] ">
				<Link to="/">
					<Icon styles="w-[52px] h-[52px] bg-[#2c2f32]" imgUrl={logo} />
				</Link>	
			<div className="flex-1 flex flex-col justify-between items-center bg-[#1c1c24] rounded-[20px] w-[76px] py-4 mt-12">
				<div className="flex flex-col justify-center items-center gap-3">
					{navLinks.map((link) => (
						<Icon 
							key={link.name}
							{...link}
							currentRoute={currentRoute}
							handleClick={() => {
								if(!link.disabled && address && !isLoading) {
									setCurrentRoute(link.name);
									navigate(link.link);
								} else if (!link.disabled && !address) {
									setCurrentRoute('');
								}
							}}
						/>
					))}
				</div>
			
				{ address &&
					<Icon 
						styles="bg-[#1c1c24] shadow-secondary" 
						imgUrl={logout} 
						currentRoute={currentRoute}
						handleClick={() => {
							setCurrentRoute('logout');
							navigate('/logout');
						}}
					/>
				}
			</div>
		</div>
	);
}


const Icon = ({ styles, name, imgUrl, currentRoute, disabled, handleClick, link }) => (
	<div className={`w-[48px] h-[48px] rounded-[10px] ${currentRoute && currentRoute === name && 'bg-[#2c2f32]'} flex justify-center items-center ${!disabled && 'cursor-pointer'} ${styles}`} onClick={handleClick}>
		{!link ? (
			<img src={imgUrl} alt={name} className="w-1/2 h-1/2" />					
		) : (
			<img src={imgUrl} alt={name} className={`w-1/2 h-1/2 ${currentRoute !== name && 'grayscale'}`} />
		)}
	</div>
)

export default Sidebar; 
