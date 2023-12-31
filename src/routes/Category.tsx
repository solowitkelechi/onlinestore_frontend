import {useParams, useOutletContext} from 'react-router-dom'
import ProductItem from '../components/ProductItem'
import {makeStyles} from '@mui/styles'
import React, {useState, useEffect, useCallback} from 'react'
import Pagination from '@mui/material/Pagination'
import CircularProgress from '@mui/material/CircularProgress'
import axios from 'axios'

const useStyles = makeStyles(() => ({
    categoryContainer:{
        display: 'flex',
        flexDirection: 'column'
    },

    itemsContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        flexBasis: '90%',
        justifyContent: 'center',
        overflowY: 'auto',
        gap: '1em',
        margin: '1em',
    },
    pagination:{
        flexBasis: '10%',
    }
}))

export default function Category(){
    const {slug} = useParams()

    const [cartToken, setCartToken, removeCartToken]:any = useOutletContext()

    type itemsType ={
        count: number,
        next: string,
        previous: string,
        results: Array<{}>
    }

    const [isLoadingProducts, setIsLoadingProducts] = useState<boolean>(false);

    const [items, setItems] = useState({
        count: 0,
        next: '',
        previous: '',
        results: []
    })
    const [page, setPage] = useState(1)
    
    const url = `https://onlinestore-backend.vercel.app/productbycategory/${slug}/`
    const classes = useStyles()

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const getPageItems = useCallback(async () => {
        setIsLoadingProducts(true)
        await axios.get(url+`?page=${page}`).then((response)=>{
            setItems(response.data)
            setIsLoadingProducts(false)
        })
    }, [page, url])

    useEffect(() => {
        getPageItems()
    },[page, getPageItems])


    return (
        <div className={classes.categoryContainer}>
            <div className={classes.itemsContainer}>
                {
                    isLoadingProducts ? <CircularProgress size={26} /> :
                    items.results?.length > 0 &&
                    items?.results?.map((item: any) => <ProductItem key={item.id} item={item} cartToken={cartToken} setCartToken={setCartToken} removeCartToken={removeCartToken} />)
                }
            </div>
            {
                items?.count > 0 &&
                <div className={classes.pagination}>
                    <Pagination count={items.count > 20 ? items.count / 20 : 1} page={page} onChange={handleChange} />
                </div>
            }
        </div>
        
    )
}
