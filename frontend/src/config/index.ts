import { createWalletClient, custom } from 'viem'
import { mainnet } from 'viem/chains'

export const walletClient = createWalletClient({
    chain: mainnet,
    transport: custom(window.ethereum)
})

// JSON-RPC Account
export const [account] = await walletClient.getAddresses()