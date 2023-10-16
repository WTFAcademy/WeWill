import { formatUnits, parseEther, encodeAbiParameters, parseAbiParameters, getAddress } from 'viem'
import { useState, useEffect } from 'react'
import { getAccount, publicMainnetClient, walletClient } from 'src/config/'
import { wagmiAbi } from 'src/config/abi'
import { useNavigate, useParams } from 'react-router-dom'
import { graphEndpoint } from 'src/config/'
import { request, gql } from 'graphql-request'
import { convertUnixTimestamp } from 'src/utils/';
import { find } from 'lodash-es' 

interface FlagDetail {
    id: string,
    flagUid: `0x${string}`,
    flagRecord_title: string,
    flagRecord_description: string,
    flagRecord_depositValue: bigint,
    flagRecord_startTime: string,
    flagRecord_expireTime: string,
    flagRecord_creator: `0x${string}`,
    flagRecord_maxParticipants: number,
}

function Flag() {
    const { flagId } = useParams();
    const navigate = useNavigate();

    const [ens, setEns] = useState('');
    const [joined, setJoined] = useState(false);
    const [maxJoined, setMaxCurrentJoined] = useState(0);
    const [currentJoined, setCurrentJoined] = useState(0);
    const [complated, setComplated] = useState(false);
    const [claimed, setClaimed] = useState(false);
    const [flagData, setFlagData] = useState<FlagDetail>({})


    const toHome = () => {
        navigate('/');
    }

    const queryFlagDetailGql = gql`
    query queryFlagDetail($flagId: String!) {
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
    const queryFlagJoinUserGql = gql`
    query queryFlagJoinUser($flagId: String!) {
        joineds(
            where: {flagUid: $flagId }
        ) {
            participant
        }
    }
    `

    const queryFlagComplateUserGql = gql`
    query queryFlagComplateUser($flagId: String!) {
        completeds(
            where: {flagUid: $flagId }
        ) {
            participant
        }
    }
    `
    
    const queryFlagClaimUserGql = gql`
    query queryFlagClaimUser($flagId: String!) {
        claimeds(
            where: {flagUid: $flagId }
        ) {
            participant
        }
    }
    `

    const getFlagDetail = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagDetailGql, { flagId } );
        setFlagData(data.registered)
        const name = await ensName(data.registered.flagRecord_creator);
        setEns(name === null ? data.registered.flagRecord_creator : name);
        setMaxCurrentJoined(data.registered.flagRecord_maxParticipants);
        getFlagJoinUser(data.registered.flagUid);
        getFlagComplateUser(data.registered.flagUid);
        getFlagClaimUser(data.registered.flagUid);
    }

    const getFlagJoinUser = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagJoinUserGql, { flagId } );
        const account = await getAccount();
        const isJoined = find(data.joineds, function(o:any) {
            const addr1 = getAddress(account);
            const addr2 = getAddress(o.participant);
            return addr1 === addr2;
        });
        setCurrentJoined(data.joineds.length)
        setJoined(isJoined ? true : false);
    }

    const getFlagComplateUser = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagComplateUserGql, { flagId } );
        const account = await getAccount();
        const complated = find(data.completeds, function(o:any) {
            const addr1 = getAddress(account);
            const addr2 = getAddress(o.participant);
            return addr1 === addr2;
        });
        setComplated(complated ? true : false);
    }
    
    const getFlagClaimUser = async (flagId:string) => {
        const data:any = await request(graphEndpoint, queryFlagClaimUserGql, { flagId } );
        const account = await getAccount();
        const claimed = find(data.claimeds, function(o:any) {
            const addr1 = getAddress(account);
            const addr2 = getAddress(o.participant);
            return addr1 === addr2;
        });
        setClaimed(claimed ? true : false);
    }

    const ensName = async (address: any) => {
        return await publicMainnetClient.getEnsName({
            address: address,
        })
    }

    useEffect(function(){
        getFlagDetail(flagId ?? '')
    },[])

    // 质押方法
    const staking = async () => {

        const account = await getAccount();

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

    // 申请完成Flag
    const complateFlag = async () => {
        
        const account = await getAccount();

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

    // 取回保证金
    const cliam = async () => {
        
        const account = await getAccount();

        const encodedData = encodeAbiParameters(
            parseAbiParameters('bytes32 flagUid'),
            [flagData.flagUid]
        )

        await walletClient.writeContract({
            address: '0xa2c504BdE79a807E2b6F2717DDd5b6C7967B38d4',
            abi: wagmiAbi,
            functionName: "claimFlag",
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
                <h2 className="text-xl font-semibold text-gray-900">最大参与人数</h2>
                <p className="mt-1 mb-4 text-xl text-black">
                    {maxJoined}
                </p>
                <h2 className="text-xl font-semibold text-gray-900">当前参与人数</h2>
                <p className="mt-1 mb-4 text-xl text-black">
                    {currentJoined}
                </p>
                <h2 className="text-xl font-semibold text-gray-900">活动介绍</h2>
                <div className="relative w-full mt-30px border border-solid border-gray-300 rounded p-24px box-border">
                    <p className="text-lg text-black">{flagData.flagRecord_description}</p>
                </div>
            </div>
            <div className="relative mt-30px flex justify-center">
                {joined ?
                    complated ?
                        claimed ?
                            <div className="flex flex-col text-xl font-bold justify-center items-center">
                                <span className="relative mb-10 text-green-4">恭喜您，您已完成本次Flag并已取回保证金</span>
                                <div onClick={toHome} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">回到首页</div>
                            </div>
                            :
                            <div className="flex flex-col text-xl font-bold justify-center items-center">
                                <span className="relative mb-10 text-green-4">恭喜您，您已完成本次Flag</span>
                                <div onClick={cliam} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">取回保证金</div>
                            </div>
                        :
                        <div className="flex flex-col text-xl font-bold justify-center items-center">
                            <span className="relative mb-10 text-green-4">您已参加本次Flag</span>
                            <div onClick={complateFlag} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">完成本次 Flag</div>
                        </div>
                    :
                    <div onClick={staking} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">参与本次 Flag</div>
                }
            </div>
        </div>
    )
}


export default Flag