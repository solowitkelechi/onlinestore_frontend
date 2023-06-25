import React from 'react';
import ProductItem from './ProductItem'
import './Products.css'
import {useRandomProducts} from "../hooks/getData"

function Products(){

    const {randomProducts, isLoadingRandom, isErrorRandom} = useRandomProducts()
    return (
        <div className="container">
            {
                randomProducts?.length > 0 &&
                randomProducts.map((item:any) => <ProductItem key={item.id} item={item} scrollable={true}/>)
            }
        </div>
    )
}

export default Products;