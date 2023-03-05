import { portfolio, selectAsset, claimAsset, faq, pass, recent } from './assets';

export const navLinks = [
	{
		name: 'portfolio',
		imgUrl: portfolio,
		link: '/portfolio'
	},
	{
		name: 'select asset',
		imgUrl: selectAsset,
		link: '/select-asset'
	},
	{
		name: 'claim asset',
		imgUrl: claimAsset,
		link: '/claim-asset'
	},
	{
		name: 'history',
		imgUrl: recent,
		link: '/history'
	},
	{
		name: 'faq',
		imgUrl: faq,
		link: '/faq'
	},
	{
		name: 'diamondpass',
		imgUrl: pass,
		link: '/diamondpass'
	}
];
