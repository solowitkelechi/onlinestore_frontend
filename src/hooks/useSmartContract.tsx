import {useState} from 'react'
import {useEthers, useContractFunction} from '@usedapp/core'
import networkMapping from "../chain-info/deployments/map.json"
import OnlineStore from "../chain-info/contracts/OnlineStore.json"
import {constants, utils, ethers} from 'ethers'
import {Contract} from '@ethersproject/contracts'
import axios from 'axios'



export const useSmartContract = () => {
    // check {chainId}

    const url = "https://solowitkelechi.pythonanywhere.com"

    const chainIdMap: any = {
        "11155111": "sepolia",
        "59140": "linea",
        "167004": "taiko", // testnet version deprecated, to be updated
        "84531": "base",
        "534353": "scroll"
    }

    const chainIdToRpcMap: any = {
        "11155111": 'https://sepolia.infura.io/v3/dd85bc7d582d4eba92d544785bdc2097',
        "59140": 'https://rpc.goerli.linea.build',
        "167004": 'https://rpc.test.taiko.xyz',
        "84531": 'https://goerli.base.org',
        "534353": 'https://scroll-alphanet.public.blastapi.io'
    }
    const [salesBalance, setSalesBalance] = useState<String>("")
    const networkMap:any = networkMapping
    const {chainId, account} = useEthers()
    const provider = new ethers.providers.JsonRpcProvider(chainIdToRpcMap[String(chainId)])
    
    const abi = OnlineStore.abi
    const onlineStoreInterface = new utils.Interface(abi)
    const onlineStoreAddress = chainIdMap[String(chainId)] ? networkMap[String(chainId)]["OnlineStore"][0] : constants.AddressZero
    const onlineStoreContract = new Contract(onlineStoreAddress, onlineStoreInterface)

    const readOnlyContract = new Contract(onlineStoreAddress, onlineStoreInterface, provider)

    const {send: approveSellTransaction, state: approveSellTransactionState} = useContractFunction(
        onlineStoreContract,
        "approveSellTransaction",
        {
            transactionName: "Approve transaction"
        }
    )


    const {send: withdrawFund, state: withdrawFundState} = useContractFunction(
        onlineStoreContract,
        "withdraw",
        {
            transactionName: "withdraw",
        }
    )

    //clear cart function
    const clearCartToken = () => {
        localStorage.removeItem("cartToken")
    }

    const updateOrder = async (id: number, saleQuantity: number, userid: number) => {
        // update user's order history
        await axios.post(`${url}/api/orderhistory/`,{
            buyer_name: userid,
            product: id,
        }).then(async (response) => {
            // update product quantity
            await axios.patch(`${url}/api/products/${id}/`, {
            quantity: saleQuantity,
        }).then(response => console.log("all databases updated")).catch(error => console.log(error))
        }).catch(error => console.log(error))
        
        clearCartToken() // removes all items in cart
    }

    const sellTransaction = async (address: String, totalCost:any, id:number, quantity: number, userid: number) => {
        const response = await approveSellTransaction(address, {value: totalCost})
        if (response !== undefined && response.status === 1){ // check if payment is successful
            updateOrder(id, quantity, userid) // update each item quantity by substracting the recent sale quantity
        }
    }

    const checkBalanceInContract = async () => {
        //const response = await checkSellerBalance(account).then((response) => console.log(response))
        //console.log(response)
        const response = await readOnlyContract.checkSellerBalance(account)
        setSalesBalance(ethers.utils.formatEther(response))
    }

    const withdrawFundInContract = async () => {
        const response = await withdrawFund()
        if (response !== undefined && response.status === 1){
            console.log(response)
        }
    }

    return {
        sellTransaction,
        approveSellTransactionState,
        checkBalanceInContract,
        salesBalance,
        withdrawFundInContract,
        withdrawFundState,
    }
}