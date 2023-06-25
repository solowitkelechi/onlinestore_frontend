import {useEthers, useEtherBalance} from '@usedapp/core'
import Button from '@mui/material/Button'
import {useEffect, useState} from 'react'
import {formatEther} from '@ethersproject/units'

const WalletConnect = ({config}: any) => {
    const {account, activateBrowserWallet, chainId, deactivate} = useEthers()
    const walletBalance = useEtherBalance(account)
    const isConnected = account !== undefined
    const [id, setId] = useState(0)

    useEffect(() => {
        chainId && setId(chainId)
    },[chainId, account])

    return (
        <>
            {
                isConnected ? 
                <>
                    {
                        !config.readOnlyUrls[id] ?
                        <span>Wrong network, switch</span>
                        :
                        <>
                            <Button variant='contained' onClick={deactivate}>disconnect</Button>
                            
                        </>
                    }
                </>
                :
                <>
                    <Button variant="contained" onClick={() => activateBrowserWallet()}>connect</Button>
                </>
            }
        </>
    )
}

export default WalletConnect