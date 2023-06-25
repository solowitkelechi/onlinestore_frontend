import React, {useState, useEffect} from 'react'
import Button from '@mui/material/Button'
import './CartItem.css'
import {useProduct, useImage} from '../hooks/getData'
import { RemoveShoppingCart } from '@mui/icons-material';

export default function CartItem(props: any){
    const {product} = useProduct(props.item.id)
    const {productImage} = useImage(product?.id)
    const [itemCount, setItemCount] = useState(props.item.quantity)

    const handleIncrement = () => {
        if (itemCount === product?.quantity) return
        setItemCount(itemCount + 1)
    }

    const handleDecrement = () => {
        if (itemCount === 0) return
        setItemCount(itemCount - 1)
    }

    useEffect(()=>{
       props.setCartToken({id: props.item.id, quantity: itemCount})
    }, [itemCount])

    const removeFromCart = () => {
        props.removeCartToken(props.item.id)
    }


    return (
        <div className='cart-container'>
            <section className='img-container'>
                <img src={productImage?.image_url} alt=""/>
            </section>
            <section>
                <p>{product?.name}</p>
                <i>in stock: {product?.quantity}</i>
            </section>
            <section>
                <b>${product?.price}</b>
                <div>
                    <Button onClick={handleDecrement} variant="contained" disabled={props.item.quantity <= 1 && true} size="small">-</Button>
                    <p>{itemCount}</p>
                    <Button onClick={handleIncrement} disabled={props.item.quantity >= product?.quantity && true} variant="contained" size="small">+</Button>
                </div>
                <Button variant="outlined" color="warning" onClick={removeFromCart}>
                    <RemoveShoppingCart/>
                </Button>
            </section>
        </div>
    )
}