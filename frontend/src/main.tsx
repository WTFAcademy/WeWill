import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import AppRouter from 'src/routes'
import 'virtual:uno.css'
import 'src/index.css'
import '@rainbow-me/rainbowkit/styles.css';

import {
  getDefaultWallets,
  RainbowKitProvider,
} from '@rainbow-me/rainbowkit';
import { configureChains, createConfig, WagmiConfig } from 'wagmi';
import {
  mainnet,
  polygon,
  optimism,
  arbitrum,
  base,
  zora,
} from 'wagmi/chains';
import { alchemyProvider } from 'wagmi/providers/alchemy';
import { publicProvider } from 'wagmi/providers/public';

const { chains, publicClient } = configureChains(
  [mainnet, polygon, optimism, arbitrum, base, zora],
  [
    alchemyProvider({ apiKey: '8kSe5qW0tl9fqjXfV3l3aLqzTdFx6EAR' }),
    publicProvider()
  ]
);

const { connectors } = getDefaultWallets({
  appName: 'We Will',
  projectId: '035da14e8bd0d35f0b64973804831e54',
  chains
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <WagmiConfig config={wagmiConfig}>
    <RainbowKitProvider chains={chains}>
      <BrowserRouter>
        <AppRouter />
      </BrowserRouter>
    </RainbowKitProvider>
  </WagmiConfig>
)
