import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter as Router } from 'react-router-dom';
import './index.css';
import App from './App';

import '@rainbow-me/rainbowkit/styles.css';
import { getDefaultWallets, RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit';
import { configureChains, createClient, WagmiConfig } from 'wagmi';
import { goerli } from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';


const { chains, provider, webSocketProvider } = configureChains(
  [
    goerli,
  ],
  [
  	alchemyProvider({
  	  apiKey: process.env.REACT_APP_API,
  	  priority: 0
  	}),
  	publicProvider({ priority: 1 })
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'RainbowKit demo',
  chains,
});

const wagmiClient = createClient({
  autoConnect: true,
  connectors,
  provider,
  webSocketProvider,
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider 
      	chains={chains} 
      	theme={darkTheme({
				  accentColor: '#7b3fe4',
				  accentColorForeground: 'white',
				  borderRadius: 'small',
				  fontStack: 'system',
				  overlayBlur: 'large',
    	})}>
    		<Router>
        		<App />
    		</Router>
      </RainbowKitProvider>
    </WagmiConfig>
  </React.StrictMode>
);
