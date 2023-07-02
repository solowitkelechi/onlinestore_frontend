import { useEffect, useState, useCallback, useMemo } from 'react';
import {makeStyles} from '@mui/styles'
import './ProductContent.css'
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import Button from '@mui/material/Button'
import Alert from '@mui/material/Alert'
import ProductItem from '../components/ProductItem';
import {useParams, useOutletContext} from 'react-router-dom'
import {useProduct,useRandomProducts, useImage, useUser} from '../hooks/getData'
import { RemoveShoppingCart } from '@mui/icons-material';
import CircularProgress from '@mui/material/CircularProgress'

const useStyles = makeStyles(() => ({
    btmContainer: {
        display: 'flex',
        flexFlow: 'row nowrap',
        gap: '1em',
        justifyContent: 'center safe',
        overflowX: 'scroll',
        margin: '0 auto',
        width: '100%',
        padding: '1em'
    },
}))

function ProductContent(){
    const classes = useStyles()
    const [cartToken, setCartToken, removeCartToken]:any = useOutletContext()
    const {slug} = useParams()
    const {product, isError, isLoading} = useProduct(slug)
    const {user} = useUser(product?.seller_name)
    const {productImage} = useImage(product?.id)

    const {randomProducts, isLoadingRandom, isErrorRandom} = useRandomProducts()
    
    const [itemCount, setItemCount] = useState(0)
    const [showAlert, setShowAlert] = useState<boolean>(false)
    const [itemAdded, setItemAdded] = useState<boolean>(false)
    const [loadedCount, setLoadedCount] = useState(0)

    const handleIncrement = () => {
        if (itemCount === product?.quantity) return
        setItemCount(itemCount + 1)
    }

    const handleDecrement = () => {
        if (itemCount === 0) return
        setItemCount(itemCount - 1)
    }

    const addToCart = () => {
        if (itemCount <= 0){
            setShowAlert(true)
            setTimeout(() => {
                setShowAlert(false)
            }, 3000)
            return
        }
        setItemAdded(true)
    }

    const removeFromCart = () => {
        setItemAdded(false)
    }

    const findTokenIndex = useMemo(()=> cartToken.findIndex((item:any) => item.id === product?.id), [cartToken, product])

    const checkCartToken = useCallback(() => {
        if (cartToken.length > 0){
            const tokenIndex = findTokenIndex
            if (tokenIndex >= 0) {
                setLoadedCount(cartToken[tokenIndex].quantity)
            }
        }
    },[cartToken, product, findTokenIndex])

    useEffect(()=>{
        checkCartToken()
    },[checkCartToken])

    useEffect(()=>{
        !itemAdded && removeCartToken(product?.id)
        itemAdded && setCartToken({
            id: product?.id,
            quantity: itemCount,
        })
    },[itemAdded])

    

    useEffect(()=>{
        setItemCount(loadedCount)
        loadedCount > 0 && setItemAdded(true)
    },[loadedCount])

    useEffect(()=>{
        if (itemAdded){
            setCartToken({id: product?.id, quantity: itemCount})
        }
    },[itemCount, itemAdded])



    return (
        <>
        <div className="content-container">
            <section className="item hero">
                <img src={productImage?.image_url} alt="" />
            </section>
            {
                isLoading ? 
                <section className="item content">
                    <CircularProgress size={26}/>
                </section>
                :
                <section className="item content">
                    <b>{product?.name}</b>
                    <b>${product?.price}</b>
                    <p>{product?.description}</p>
                    <p style={{opacity: '.7'}}>in stock: <b>{product?.quantity}</b></p>
                    <span>seller: {user?.username}</span>
                </section>
            }
            <section className="item cart">
                <div>
                    <Button variant="outlined" disabled={itemCount <= 1 && true} onClick={handleDecrement}>-</Button>
                    <p>{itemCount ? itemCount : loadedCount}</p>
                    <Button variant="outlined" disabled={itemCount >= product?.quantity && true} onClick={handleIncrement}>+</Button>
                </div>
                <Button variant='contained' color={itemAdded ? 'warning' : 'primary'} onClick={itemAdded ? removeFromCart : addToCart}  disabled={itemCount <= 0 && true} className="cart_btn">{itemAdded ? <RemoveShoppingCart/> : <AddShoppingCartIcon/>}</Button>
                {
                    showAlert && <Alert severity="error">Item quantity should be greater than zero</Alert>
                }
            </section>
        </div>
        <h2>other products</h2>
        <div className={classes.btmContainer}>
            {   isLoadingRandom ? <CircularProgress size={26}/> :
                randomProducts?.length > 0 &&
                randomProducts.map((item:any) => (<ProductItem key={item.id} item={item} scrollable={true}/>))
            }
        </div>
        </>
        
        
    )
}

export default ProductContent;