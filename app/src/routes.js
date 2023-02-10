import { portfolio, selectAsset, claimAsset, faq, pass } from './assets';

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
		name: 'faq',
		imgUrl: faq,
		link: '/faq'
	},
	{
		name: 'lifetimepass',
		imgUrl: pass,
		link: '/lifetimepass'
	}
];
