import {useState} from 'react'

export default function useToken(){

    const getToken = () => {
        const tokenString = localStorage.getItem('token')
        const userToken = JSON.parse(tokenString)
        if (!userToken) return null
        return userToken
    }

    const [token, setToken] = useState(getToken())

    const saveToken = (token) => {
        localStorage.setItem('token', JSON.stringify(token))
        setToken(token)
    }

    return {token, setToken: saveToken}

}