import ProductItem from './ProductItem'
import './Products.css'
import {useRandomProducts} from "../hooks/getData"

function Products(props:any){
    const {randomProducts, isLoadingRandom, isErrorRandom} = useRandomProducts()
    return (
        <div className="container">
            {
                randomProducts?.length > 0 &&
                randomProducts.map((item:any) => <ProductItem 
                    key={item.id} 
                    item={item}
                    cartToken={props.cartToken} 
                    setCartToken={props.setCartToken} 
                    removeCartToken={props.removeCartToken} 
                    scrollable={true}
                    />
                )
            }
        </div>
    )
}

export default Products;