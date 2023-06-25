//import Navbar from './Navbar'
import {Outlet} from 'react-router-dom'
import React, {useState} from 'react';
import {useEthers} from '@usedapp/core'
import './Navbar.css'
import {NavLink, Navigate} from 'react-router-dom'
import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {makeStyles} from '@mui/styles'
import Badge from '@mui/material/Badge'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import useCartToken from '../hooks/useCartToken'
import useToken from '../useToken'
import WalletConnect from './WalletConnect'

const useStyles = makeStyles(() => ({
  row: {
      display: 'flex',
      flexDirection: 'row',
      gap: '1em',
      marginRight: '.5em',
      alignItems: 'center'
  },
  logged:{
    display: 'flex',
    gap:'.5em',
    alignItems: 'center',
    justifyContent: 'center'
  }
}))

function cartCount({cart}: any){
  return (
      <Badge badgeContent={cart?.length > 0 ? cart.length : '0'} color="primary">
          <ShoppingCartIcon/>
      </Badge>
  )
}


const Layout = ({config}: any) => {
  const {cartToken, setCartToken,removeCartToken} = useCartToken()
  const {token, setToken} = useToken()
  const [redirect, setRedirect] = useState<boolean>(false)

  const MemoCartCount = React.memo(cartCount)

  const handleLogout = () => {
      localStorage.removeItem("token")
      setRedirect(true)
  }

  const classes = useStyles()

  if (redirect) window.location.replace('/');

  return (
    <>
      <div className="header">
          <h2><NavLink className='link' to={"/"}>BuyNow</NavLink></h2>
          <div className={classes.row}>
              <WalletConnect config={config} />
              <NavLink to="/cart" className="link">
                <MemoCartCount cart={cartToken} />
              </NavLink>
              {
                  token ?
                  <div className={classes.logged}>
                    <NavLink to="/accountoverview" className='link'><AccountCircleIcon/></NavLink>
                    <Button onClick={handleLogout}><LogoutIcon/></Button>
                    
                  </div>
                  :
                  <NavLink to="/account" className='link'><AccountCircleIcon/></NavLink>
                  
              }
          </div>
      </div>
      <Outlet context={[cartToken, setCartToken, removeCartToken, token, setToken]}/>
    </>
  )
}

export default Layout