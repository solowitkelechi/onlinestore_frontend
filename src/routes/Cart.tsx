import {useState} from 'react'
import {makeStyles} from '@mui/styles'
import Button from '@mui/material/Button'
import CartItem from '../components/CartItem'
import './Cart.css'
import {NavLink} from 'react-router-dom'
import { useOutletContext } from 'react-router-dom'
import {CartSummary} from '../components/CartSummary'
import DoneAllIcon from '@mui/icons-material/DoneAll';


const useStyles = makeStyles(() => ({
    cartContainer: {
        margin: '1em',
        display: 'flex',
        flexFlow: 'row wrap',
        gap: '1em',
        justifyContent: 'center',
        width: '90%',
    },
    cartItems: {
        display: 'flex',
        flexFlow: 'column',
        gap: '1em',
        flexGrow: '1',
    },
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
    noItem:{
        display: 'flex',
        flexFlow: 'column',
        height: 'calc(100vh - 150px)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    h2: {
        flexGrow: 2,
    }
}))



function Cart(){
    const classes = useStyles()

    const [saleSuccess, setSaleSuccess] = useState<boolean>(false)

    const [cartToken, setCartToken, removeCartToken]: any = useOutletContext()

    return saleSuccess ? 
        (
            <div className={classes.noItem}>
                <h2><DoneAllIcon /></h2>
                <h3>Order confirmed</h3>
                <NavLink to="/" className='link'><Button variant="contained">View Collections</Button></NavLink>
            </div>
        )
        :
        cartToken.length === 0 ?
        (
            <div className={classes.noItem}>
                <h2>No item in cart</h2>
                <NavLink to="/" className='link'><Button variant="contained">View Collections</Button></NavLink>
            </div>
        )
        :
        (
            <div className={classes.cartContainer}>
                <div className={classes.cartItems}>
                    <h3>Cart Items ({cartToken.length})</h3>
                    {  
                        cartToken.length > 0 
                        &&
                        cartToken.map((item: any) => <CartItem key={item.id} item={item} setCartToken={setCartToken} removeCartToken={removeCartToken} />)
                    }
                </div>
                <CartSummary cartToken={cartToken} setSaleState={setSaleSuccess}/>
            </div>
        )
    
}

export default Cart