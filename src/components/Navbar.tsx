import React, {useState, memo} from 'react';
import './Navbar.css'
import {NavLink, Navigate, useNavigate} from 'react-router-dom'
import Button from '@mui/material/Button'
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import {makeStyles} from '@mui/styles'
import Badge from '@mui/material/Badge'
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const useStyles = makeStyles(() => ({
    row: {
        display: 'flex',
        flexDirection: 'row',
        gap: '1em',
        marginRight: '.5em',
        alignItems: 'center'
    }
}))

function Navbar (props:any) {
    const [redirect, setRedirect] = useState<boolean>(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        localStorage.removeItem("token")
        setRedirect(true)
    }

    if (redirect){
        window.location.replace("http://127.0.0.1:3000")
    }

    const classes = useStyles()
    
    return (
        <div className="header">
            <h2><NavLink className='link' to={"/"}>BuyNow</NavLink></h2>
            <div className={classes.row}>
                {
                    props.token ?
                    <Button onClick={handleLogout}><LogoutIcon/></Button>
                    :
                    <NavLink to="/account" className='link' style={{marginRight: '10'}}><AccountCircleIcon/></NavLink>
                    
                }
                <NavLink to="/cart" className="link" style={{marginRight: '10'}}>
                    <Badge badgeContent={props.cartToken ? props.cartToken.length : '0'} color="primary">
                        <ShoppingCartIcon/>
                    </Badge>
                </NavLink>
                
                
            </div>
        </div>
    )
}

export default Navbar