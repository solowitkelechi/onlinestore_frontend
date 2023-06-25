import {useProductsForPrice} from '../hooks/getData'
import {useState, useEffect, useCallback} from 'react'
import {makeStyles} from '@mui/styles'
import Button from '@mui/material/Button'
import { useCoingeckoPrice } from '@usedapp/coingecko'
import {utils} from 'ethers'
import {useSmartContract} from '../hooks/useSmartContract'
import { Alert, CircularProgress } from '@mui/material'
import { useOutletContext } from 'react-router-dom'

const useStyles = makeStyles(() => ({
    cartSummary:{
        width: '100%',
        display: 'flex',
        flexFlow: 'column',
        boxShadow: '0px 0px 2px 1px rgba(51, 51, 51, 0.1)',
        padding: '.5em',
    },
    ul:{
        listStyleType: 'none',
        display: 'flex',
        flexFlow: 'column',
        gap: '.5em'
    },
}))


export function CartSummary({cartToken}: any){
    const [,,,token,]: any = useOutletContext()
    const classes = useStyles()
    const [totalCost, setTotalCost] = useState("0") // to show the items total cost
    const {products}:any = useProductsForPrice()
    const etherprice = useCoingeckoPrice("ethereum", "usd") // get the latest ETH price from coingecko

    const [loginAlert, setLoginAlert] = useState<boolean>(false)

    const {sellTransaction, approveSellTransactionState: transactionState} = useSmartContract()

    // check transaction payment status
    const isMining = transactionState.status === "Mining"
    const paymentSuccessful = transactionState.status === "Success"
    const paymentFailed = transactionState.status === "Fail"

    const getProduct = useCallback((id: number) => {
        const result = products?.find((item:any) => item.id === id)
        //const ethprice: number = etherprice ? parseInt(etherprice) : 0
        //console.log(result?.price) // not the problem
        const price = etherprice ? result?.price/parseInt(etherprice) : 0
        return price
        
    },[products, etherprice])

    // returns seller eth address for an item
    const getSellerAddress = (id: number) => {
        const result = products?.find((item:any) => item.id === id)
        return result?.seller_eth_address
    }

    // returns product quantity necessary for updating after sale
    const getQuantity = (id: number) => {
        const result = products?.find((item:any) => item.id === id)
        return result?.quantity
    }

    // calculate the cost of all the items in cart
    const handleCost= useCallback(() => {
        let totalInEth: number = 0
        totalInEth = cartToken.reduce((total: number, item: any) => {
            return total + (item.quantity * getProduct(item.id))
        }, 0)
        setTotalCost(totalInEth.toFixed(4))
    },[cartToken, etherprice, getProduct, totalCost])

    useEffect(()=>{
        handleCost()
    },[etherprice, handleCost, totalCost])

    // handle payment on checkout
    const handleCheckout = () => {
        //const cost = etherprice ? totalCost / parseInt(etherprice) : 0
        //const totalCostAsWei = utils.parseEther(cost.toString())
        if (!token){
            setLoginAlert(true)
            setTimeout(()=>{
                setLoginAlert(false)
            }, 3000)
            return
        }
        cartToken.reduce((total: number, item :any) => {
            sellTransaction(
                getSellerAddress(item.id), 
                utils.parseEther((item.quantity * getProduct(item.id)).toFixed(4).toString()), 
                item.id, 
                getQuantity(item.id) - item.quantity,
                token.id,
            )
        }, 0)
        //sellTransaction("0x031bFD2c5988E149a8Da1e869B508Ee7a9dAa2DD", totalCostAsWei)
    }
    

    return (
        <div className={classes.cartSummary}>
            <ul className={classes.ul}>
                <li><h3>Cart Summary</h3></li>
                <li><b>{totalCost} ETH</b></li>
                <li><Button variant='contained' disabled={isMining} onClick={handleCheckout}>{isMining ? <CircularProgress/> : "Checkout"}</Button></li>
            </ul>
            {
                // check if transaction is successful
                paymentSuccessful && <Alert severity='success'>Checkout successful</Alert>
            }
            {
                // check if transaction is successful
                paymentFailed && <Alert severity='error'>Checkout failed, try again.</Alert>
            }
            {
                loginAlert && <Alert severity="error">login required before checkout</Alert>
            }
        </div>
    )
}