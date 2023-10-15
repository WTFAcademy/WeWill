import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useNavigate } from 'react-router-dom'
import { graphEndpoint, publicClient } from 'src/config/'
import { formatUnits } from 'viem'
import { request, gql } from 'graphql-request'
import { useEffect, useState } from "react";
import toast from 'react-hot-toast';

interface FlagRecord {
  id: string,
  flagUid: string,
  flagRecord_title: string,
  flagRecord_description: string,
  flagRecord_depositValue: bigint,
  flagRecord_expireTime: number,
}

function Home() {
  const { isConnected } = useAccount();
  const navigate = useNavigate();
  const [flagList, setFlagList] = useState<FlagRecord[]>([])

  const queryFlagList = gql`
  {
    registereds {
      id
      flagUid
      flagRecord_title
      flagRecord_description
      flagRecord_depositValue
      flagRecord_expireTime
    }
  }
  `

  const getFlagList = async ()=>{
    const data:any = await request(graphEndpoint, queryFlagList);
    console.log(data.registereds);
    
    setFlagList(data.registereds);
  }

  useEffect(()=>{
    getFlagList();
  },[])

  const toCreateFlag = () => {
    if(!isConnected){
      toast.error('请先连接钱包！');
    }else{
      navigate(`/create`)
    }
  }

  const toDetailFlag = (id:string) => {
    if(!isConnected){
      toast.error('请先连接钱包！');
    }else{
      navigate(`/flag/${id}`)
    }
  }

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-2">
        <ConnectButton />
      </div>
        <div>
          <div className=" relative p-8 flex justify-between">
            <span className="text-xl font-black">活动列表</span>
            <div onClick={toCreateFlag} className="rounded-md cursor-pointer bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer">
            发起Flag
            </div>
          </div>
          <div className="relative flex flex-wrap gap-4 p-8 box-border justify-between" >
            {flagList && flagList.map((i, index) => (
              <div
                key={index}
                onClick={() => toDetailFlag(i.id)}
                className="relative p-4 w-300px h-200px hover:shadow-lg rounded-2 min-w-200px border-1px border-solid overflow-hidden border-#ccc/30 box-border cursor-pointer"
              >
                <div className="relative h-full flex flex-col justify-between">
                  <div>
                    <h2 className="relative mb-4">{i.flagRecord_title}</h2>
                    <p>{i.flagRecord_description}</p>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="px-2 py-1 text-base text-blue-800 bg-blue-200 border-blue-800 border-1 border-solid box-border rounded">
                      {formatUnits(i.flagRecord_depositValue, 18)} ETH
                    </div>
                    <div>
                      截止时间
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
    </div>
  );
}

export default Home;
