import { formatUnits, parseEther, encodeAbiParameters, parseAbiParameters, getAddress } from 'viem'
import { useState, useEffect } from 'react'
import { account, publicMainnetClient, walletClient } from 'src/config/'
import { wagmiAbi } from 'src/config/abi'
import { useParams } from 'react-router-dom'
import { graphEndpoint } from 'src/config/'
import { request, gql } from 'graphql-request'
import { format } from 'date-fns';
import { find } from 'lodash-es' 

interface FlagDetail {
    flagUid: `0x${string}`,
    flagRecord_title: string,
    flagRecord_description: string,
    flagRecord_depositValue: bigint,
    flagRecord_startTime: string,
    flagRecord_expireTime: string,
    flagRecord_creator: `0x${string}`,
    flagRecord_maxParticipants: number,
}

function convertUnixTimestamp(unixTimestamp:any) {
    const date = new Date(Number(unixTimestamp) * 1000); // 将 UNIX 时间戳转换为毫秒
    const formattedDate = format(date, 'yyyy-MM-dd HH:mm:ss'); // 使用 date-fns 格式化日期
    return formattedDate;
}

function Flag() {
    const [ens, setEns] = useState('');
    const [joined, setJoined] = useState(false);
    const [flagData, setFlagData] = useState<FlagDetail>({})

    const { flagId } = useParams();

    const queryFlagDetail = gql`
    query getFlag($flagId: String!) {
        registered(
          id: $flagId
        ) {
            flagUid
            flagRecord_title
            flagRecord_description
            flagRecord_depositValue
            flagRecord_creator
            flagRecord_maxParticipants
            flagRecord_startTime
            flagRecord_expireTime
        }
    }
    `
    const queryFlagUser = gql`
    query getFlagUser($flagId: String!) {
        joineds(
            where: {flagUid: $flagId }
        ) {
            participant
        }
    }
    `

    const getFlagDetail = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagDetail, { flagId } );
        setFlagData(data.registered)
        const name = await ensName(data.registered.flagRecord_creator);        
        setEns(name === null ? data.registered.flagRecord_creator : name)
        getFlagUser(data.registered.flagUid)

    }

    const getFlagUser = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagUser, { flagId } );
        const isJoined = find(data.joineds, function(o:any) {
            const addr1 = getAddress(account);
            const addr2 = getAddress(o.participant);
            return addr1 === addr2;
        });
        setJoined(isJoined ? true : false);
        console.log(isJoined);
    }

    const ensName = async (address: any) => {
        return await publicMainnetClient.getEnsName({
            address: address,
        })
    }

    useEffect(function(){
        getFlagDetail(flagId ?? '')
        
    },[])

    const stacking = async () => {

        const encodedData = encodeAbiParameters(
            parseAbiParameters('bytes32 flagUid'),
            [flagData.flagUid]
        )

        await walletClient.writeContract({
            address: '0xa2c504BdE79a807E2b6F2717DDd5b6C7967B38d4',
            abi: wagmiAbi,
            functionName: "joinFlag",
            args: [encodedData],
            account,
            value: parseEther(formatUnits(flagData.flagRecord_depositValue, 18))
        })
    }

    const complateFlag = async () => {
        
        const encodedData = encodeAbiParameters(
            parseAbiParameters('bytes32 flagUid'),
            [flagData.flagUid]
        )

        await walletClient.writeContract({
            address: '0xa2c504BdE79a807E2b6F2717DDd5b6C7967B38d4',
            abi: wagmiAbi,
            functionName: "completeFlag",
            args: [encodedData],
            account,
        })
    }

    return (
        <div className="relative flex flex-col justify-start items-center w-full min-h-100vh">
            <div className="relative w-full h-300px px-15% box-border bg-blue-5">
                <div className="relative h-full flex flex-col justify-end pb-50px box-border">
                    <p className="relative mb-30px text-5xl font-bold text-white">Flag名称：{flagData.flagRecord_title}</p>
                    <p className="relative mt-5px text-xl font-semibold text-white">创建人：{ens}</p>
                    <p className="relative mt-5px text-xl font-semibold text-white">结束时间：{flagData.flagRecord_expireTime ? convertUnixTimestamp(flagData.flagRecord_expireTime) : ''} (UTC)</p>
                </div>
            </div>
            <div className="relative w-70% mt-50px">
                <div className="relative mb-30px">
                    <h2 className="relative mb-4 text-xl font-semibold text-gray-900">质押金额</h2>
                    <span className="relative px-2 py-1 text-xl text-blue-800 bg-blue-200 border-blue-800 border-1 border-solid box-border rounded">
                    {formatUnits(flagData.flagRecord_depositValue ?? 0, 18)} ETH
                    </span>
                </div>
                <h2 className="text-xl font-semibold text-gray-900">活动要求</h2>
                <p className="mt-1 text-sm leading-6 text-gray-600">
                   {/* {blockNumer} */}
                </p>
                <div className="relative w-full mt-30px border border-solid border-gray-300 rounded p-24px box-border">
                    <p className="text-lg text-black">{flagData.flagRecord_description}</p>
                </div>
            </div>
            <div className="relative mt-30px flex justify-center">
                {joined ? 
                    <div className="flex flex-col text-xl font-bold justify-center items-center">
                        <span className="relative mb-10 text-green-4">您已参加本次Flag</span>
                        <div onClick={complateFlag} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">完成本次 Flag</div>
                    </div>
                    :
                    <div onClick={stacking} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">参与本次 Flag</div>
                }
            </div>
        </div>
    )
}


export default Flag