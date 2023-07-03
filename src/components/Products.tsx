import {useOutletContext} from 'react-router-dom'
import ProductItem from './ProductItem'
import './Products.css'
import {useRandomProducts} from "../hooks/getData"

function Products(){
    const [cartToken, setCartToken, removeCartToken]:any = useOutletContext()
    const {randomProducts, isLoadingRandom, isErrorRandom} = useRandomProducts()
    return (
        <div className="container">
            {
                randomProducts?.length > 0 &&
                randomProducts.map((item:any) => <ProductItem 
                    key={item.id} item={item} 
                    cartToken={cartToken} 
                    setCartToken={setCartToken} 
                    removeCartToken={removeCartToken} 
                    scrollable={true}
                    />
                )
            }
        </div>
    )
}

export default Products;