import { useEffect } from 'react';
import { Navigate } from 'react-router-dom';


const Logout = ({ disconnect }) => {
	
	useEffect(() => {
		disconnect();
	// eslint-disable-next-line
	}, []);
	
	return (
		<Navigate to="/" />
	);
}

export default Logout;
