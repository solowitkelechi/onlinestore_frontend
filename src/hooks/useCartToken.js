import {useState, useEffect} from 'react'


export default function useCartToken(){
    
    const getCartToken = () => {
        var arr = []
        const tokenString = localStorage.getItem('cartToken')
        const cartToken = JSON.parse(tokenString)
        if (!cartToken){
            return arr
        }
        return cartToken
    }

    const [cartToken, setCartToken] = useState(getCartToken())

    const saveCartToken = (token) =>{
        //if (cartToken.length >= 1){
        const existingCartToken = JSON.parse(localStorage.getItem('cartToken')) || [];
        const index = existingCartToken.findIndex((item) => item.id === token.id)
        if (index >= 0){
            existingCartToken[index].quantity = token.quantity
            //setCartToken((existingToken) => {
            //    return [
            //        ...existingToken.slice(0, index),
            //        {id: token.id, quantity: token.quantity},
            //        ...existingToken.slice(index + 1)
            //    ]
            //}) 
        }
        else{
            existingCartToken.push(token)
        }
        localStorage.setItem('cartToken', JSON.stringify(existingCartToken))
        setCartToken(existingCartToken)
    }
    
    function removeCartToken(tokenId){
        const existingCartToken = JSON.parse(localStorage.getItem('cartToken')) || []
        const index = existingCartToken.findIndex((item) => item.id === tokenId)
        if (index >= 0){
            existingCartToken.splice(index, 1)
        }
        localStorage.setItem('cartToken', JSON.stringify(existingCartToken))
        setCartToken(existingCartToken)
    }

   
    return {
        cartToken,
        setCartToken: saveCartToken,
        removeCartToken
    }
}

