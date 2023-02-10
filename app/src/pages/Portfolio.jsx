import { DisplayNfts } from '../components';

const Portfolio = ({ nfts, isLoading }) => {

	const msg = nfts.length > 0 && nfts[0].deadline
		?	"Inheritas Assets"
		:	nfts.length > 0
		?	"Select an asset to register into the Inheritas service"
		:	"No assets found. Try refreshing the site. Connecting another wallet or press the Register Asset button to register an asset into the Inheritas service.";
	
	return (
		<DisplayNfts 
			title={""}
			isLoading={isLoading}
			nfts={nfts}
			msg={msg}
		/>
	);
};

export default Portfolio;
