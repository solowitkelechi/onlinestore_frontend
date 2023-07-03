import {useState, useEffect, useMemo, useCallback} from 'react'
import {useOutletContext} from 'react-router-dom'
import './ProductItem.css'
import {useImage} from '../hooks/getData'
import Button from '@mui/material/Button'


function ProductItem(props: any){
    const {productImage} = useImage(props.item.id)
    const [itemAdded, setItemAdded] = useState<boolean>(false)
    const [itemInCart, setItemInCart] = useState<boolean>(false)

    const tokenIndexInCart = useMemo(() => props.cartToken.findIndex((item:any) => item.id === props.item.id), [props.cartToken, props.item])

    const addToCart = () => {
        setItemAdded(true)
    }

    const removeFromCart = () => {
        setItemAdded(false)
    }

    const checkItemInCart = useCallback(() => {
        if (props.cartToken.length > 0){
            const tokenIndex = tokenIndexInCart
            if (tokenIndex >= 0){
                setItemInCart(true)
            }
        }
    }, [props.cartToken, props.item, tokenIndexInCart])

    useEffect(() => {
        checkItemInCart()
    }, [checkItemInCart])

    useEffect(() => {
        !itemAdded && props.removeCartToken(props.item.id)
        itemAdded && props.setCartToken({
            id: props.item.id,
            quantity: 1,
        })
    }, [itemAdded])

    useEffect(() => {
        itemInCart && setItemAdded(true)
    }, [itemInCart])

    return (
        <div className={props.scrollable === true ? 'product-container scrollable product-container-width' : 'non-scrollable-container non-scrollable-container-width'}>
            <a href={`/product/${props.item.id}`}>
                <img src={productImage?.image_url} alt="" width="3861px" height="3861px" />
                <section className='product-details'>
                    <span>{props.item.name}</span>
                    <span>{props.item.brand}</span>
                    <b>${props.item.price}</b>
                </section>
            </a>
            <Button 
                variant="contained"
                size="small"
                onClick={itemAdded ? removeFromCart : addToCart}
                color={itemAdded ? 'warning' : 'primary'}
            >
                {itemAdded ? "remove" : "add to cart"}
            </Button>
        </div>
    )
}

export default ProductItem;