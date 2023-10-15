import { createPublicClient, createWalletClient, custom, http } from 'viem'
import { goerli, mainnet } from 'viem/chains'

export const walletClient = createWalletClient({
    chain: goerli,
    transport: custom(window.ethereum)
})

export const publicClient = createPublicClient({
    chain: goerli,
    transport: http()
})

export const publicMainnetClient = createPublicClient({
    chain: mainnet,
    transport: http()
})

// JSON-RPC Account
export const [account] = await walletClient.getAddresses()

export const graphEndpoint = 'https://api.studio.thegraph.com/query/37543/wewill_goerli/v0.0.1/';