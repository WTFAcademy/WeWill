import { useAccount } from 'wagmi'
import { createPublicClient, http } from 'viem'
import { mainnet } from 'viem/chains'
import { useState, useEffect } from 'react'

import { account, walletClient } from 'src/config/'
import { wagmiAbi } from 'src/config/abi'

function Flag() {
    const [blockNumer, setBlockNumber] = useState<bigint>();

    const { address, isConnected } = useAccount()

    const client = createPublicClient({
        chain: mainnet,
        transport: http(),
    })

    const getDDD = async () => {
        const nnn = await client.getBlockNumber();
        setBlockNumber(nnn);
    }

    // const { request } = await publicClient.simulateContract({
    //     account,
    //     address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
    //     abi: wagmiAbi,
    //     functionName: 'mint',
    // })
    // await walletClient.writeContract(request)

    useEffect(function(){
        getDDD();
    },[])

    const stacking = async () => {
        await walletClient.writeContract({
            address: '0xFBA3912Ca04dd458c843e2EE08967fC04f3579c2',
            abi: wagmiAbi,
            functionName: 'mint',
            account,
        })
    }

    return (
        <div className="relative flex flex-col justify-start items-center w-full min-h-100vh">
            <div className="relative w-full h-300px px-15% box-border bg-red-5">
                <div className="relative h-full flex flex-col justify-end pb-50px box-border">
                    <p className="relative mb-30px text-5xl font-bold text-white">Flag名称：先赚一个亿</p>
                    <p className="relative mt-5px text-xl font-semibold text-white">创建人：{address}</p>
                    <p className="relative mt-5px text-xl font-semibold text-white">活动周期：2023.10.13-2023.10.16</p>
                </div>
            </div>
            <div className="relative w-70% mt-50px">
                <div className="relative mb-30px">
                    <h2 className="text-xl font-semibold leading-3 text-gray-900">质押金额</h2>
                    <h1 className="mt-1 text-2xl leading-6 text-blue-700">
                    0.05 ETH
                    </h1>
                </div>
                <h2 className="text-xl font-semibold leading-3 text-gray-900">活动要求</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                   {/* {blockNumer} */}
                </p>
                <div className="relative w-full mt-30px border border-solid border-gray-300 rounded p-24px box-border">
                    <p className="text-lg text-black">1. XXXXXXXXXX</p>
                    <p className="text-lg text-black">2. XXXXXXXXXX</p>
                    <p className="text-lg text-black">3. XXXXXXXXXX</p>
                    <p className="text-lg text-black">4. XXXXXXXXXX</p>
                    <p className="text-lg text-black">5. XXXXXXXXXX</p>
                    <p className="text-lg text-black">6. XXXXXXXXXX</p>
                    <p className="text-lg text-black">7. XXXXXXXXXX</p>
                </div>
            </div>
            <div className="relative mt-30px flex justify-center">
                <div onClick={stacking} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                参与本次 Flag
                </div>
            </div>
        </div>
    )
}


export default Flag