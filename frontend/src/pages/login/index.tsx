import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { InjectedConnector } from 'wagmi/connectors/injected'
import { Link } from 'react-router-dom'

function Login() {

    const { address, isConnected } = useAccount()
    const { connect } = useConnect({
        connector: new InjectedConnector(),
    })
    const { disconnect } = useDisconnect()

    return (
        <div className="relative flex-col justify-end items-center w-full h-100vh p-5 box-border">
            <div className="w-full flex justify-end">
                <div>
                    <ConnectButton />
                </div>
            </div>
            {isConnected && 
                <div className="relativer">
                    <div>已连接</div>
                    <div>连接地址为: {address}</div>

                    <div className="relative w-full mt-100px flex justify-center items-center">
                        <div className="relative w-200px mx-5 flex justify-center items-center bg-blue-5 cursor-pointer">
                            <Link to='/sponsor'>我是发起者</Link>
                        </div>
                        <div className="relative w-200px mx-5 flex justify-center items-center bg-green-5 cursor-pointer">
                            <Link to='/user'>我是用户</Link>
                        </div>
                    </div>
                </div>
            }
            
        </div>
    )
}

export default Login