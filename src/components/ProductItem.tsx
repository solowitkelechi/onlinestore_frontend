import {useState, useEffect, useMemo, useCallback} from 'react'
import {useOutletContext} from 'react-router-dom'
import './ProductItem.css'
import {useImage} from '../hooks/getData'
import Button from '@mui/material/Button'


function ProductItem(props: any){
    const {productImage} = useImage(props.item.id)
    const [cartToken, setCartToken, removeCartToken]:any = useOutletContext()

    const tokenIndexInCart = useMemo(() => cartToken.findIndex((item:any)=> item.id === props.item.id), [cartToken, props.item.id])

    const [itemAdded, setItemAdded] = useState<boolean>(false)
    const [itemInCart, setItemInCart] = useState<boolean>(false)

    const addToCart = () => {
        setItemAdded(true)
    }

    const removeFromCart = () => {
        setItemAdded(false)
    }

    const checkItemInCart = useCallback(() => {
        if (cartToken.length > 0){
            const tokenIndex = tokenIndexInCart
            if (tokenIndex >= 0){
                setItemInCart(true)
            }
        }
    }, [cartToken, tokenIndexInCart])

    useEffect(() => {
        checkItemInCart()
    }, [checkItemInCart])

    useEffect(() => {
        !itemAdded && removeCartToken(props.item.id)
        itemAdded && setCartToken({
            id: props.item.id,
            quantity: 1,
        })
    }, [itemAdded, props.item.id, removeCartToken, setCartToken])

    return (
        <div className={props.scrollable === true ? 'product-container scrollable product-container-width' : 'product-container product-container-width'}>
            <a href={`/product/${props.item.id}`}>
                <img src={productImage?.image_url} alt="" width="3861px" height="3861px" />
                <section className='product-details'>
                    <span>{props.item.name}</span>
                    <span>{props.item.brand}</span>
                    <b>${props.item.price}</b>
                    <Button 
                        variant="contained"
                        onClick={itemAdded || itemInCart ? removeFromCart : addToCart}
                        color={itemAdded || itemInCart ? 'warning' : 'primary'}
                    >
                        {itemAdded ? "remove" : "add to cart"}
                    </Button>
                </section>
            </a>
            
        </div>
    )
}

export default ProductItem;