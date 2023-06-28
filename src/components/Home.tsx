import './Home.css'
import coverimage from '../images/shopping-cover.jpg'
import delivery from '../images/delivery.jpg'
import banner from '../images/banner.jpg'
import Products from './Products';
import {ProductCategories} from './ProductCategories'
import {NavLink} from 'react-router-dom'


function Main (){
    const productCategories = ProductCategories()

    return (
        <div className="main">
            <section className='section top-main'>
                <section className='section__cover'>
                    <div className="lg-cover">
                        <img src={coverimage} alt="" width="2000px" height="1333px" />
                    </div>
                    <div className="sm-cover">
                        <div>
                            <img src={delivery} alt="" width="2000px" height="2000px" />
                        </div>
                        <div>
                        <img src={banner} alt="" width="3000px" height="2000px" />
                        </div>
                    </div>
                </section>
            </section>
            <h2>Category</h2>
            <section className="section__center">
                {
                    productCategories.map((item: any) => (
                    <NavLink to={`/products/${item.name}`} key={item.name} style={{display: 'contents'}}>
                        <div>
                            <img src={item.image} alt={item.name}  />
                            <p>{item.name}</p>
                        </div>
                    </NavLink>
                    )
                    )
                }
            </section>
            <h2>Random products</h2>
            <Products/>
        </div>
    )
}

export default Main