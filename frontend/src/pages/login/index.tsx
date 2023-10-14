import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from "wagmi";
import { useNavigate } from 'react-router-dom'

function Login() {
  const { isConnected } = useAccount();
  const navigate = useNavigate()

  const identifies: {
    avatar: string;
    url: string;
    name: string;
    describe: string[];
  }[] = [
    {
      avatar: "",
      url: "/sponsor",
      name: "发起人",
      describe: ["创建Flag", "创建Flag", "创建Flag", "创建Flag"],
    },
    {
      avatar: "",
      url: "/user",
      name: "用户",
      describe: [
        "查看Flag列表",
        "查看Flag列表",
        "查看Flag列表",
        "查看Flag列表",
      ],
    },
  ];

  return (
    <div className="flex flex-col h-screen">
      <div className="flex justify-end p-2">
        <ConnectButton />
      </div>
      {isConnected && (
        <div className="flex flex-1 justify-center items-center gap-8" >
          {identifies.map((i, index) => (
            <div
              key={index}
              onClick={() => navigate(i.url)}
              className="hover:shadow-lg rounded-2 min-w-200px border-1px border-solid overflow-hidden border-#ccc/30"
            >
              <div className="flex justify-center py-4 flex-col items-center">
                <div className="bg-#ccc w-16 h-16 rounded-full" />
                <span className="mt-4">成为{i.name}</span>
              </div>
              <ul className="bg-#f5f5f5 py-8 text-center">
                {i.describe.map((d, index) => (
                  <li key={index} className="my-1">
                    {d}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Login;
