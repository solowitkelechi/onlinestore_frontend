import React from 'react'
import './ProductItem.css'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {useImage} from '../hooks/getData'

function ProductItem(props: any){
    const {productImage} = useImage(props.item.id)

    return (
        <div className={props.scrollable === true ? 'product-container scrollable product-container-width' : 'product-container product-container-width'}>
            <a href={`/product/${props.item.id}`}>
                <img src={productImage?.image_url} alt="" width="3861px" height="3861px" />
                <section className='product-details'>
                    <span>{props.item.name}</span>
                    <b>${props.item.price}</b>
                </section>
            </a>
            
        </div>
    )
}

export default ProductItem;