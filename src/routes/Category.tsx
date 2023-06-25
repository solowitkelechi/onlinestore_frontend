import {useParams} from 'react-router-dom'
import ProductItem from '../components/ProductItem'
import { useProductCategory } from '../hooks/getData'
import {makeStyles} from '@mui/styles'
import React, {useState, useEffect, useCallback} from 'react'
import Pagination from '@mui/material/Pagination'
import axios from 'axios'

const useStyles = makeStyles(() => ({
    categoryContainer:{
        display: 'flex',
        flexFlow: 'column'
    },

    itemsContainer: {
        display: 'flex',
        flexFlow: 'row wrap',
        gap: '1em',
        margin: '1em',
        flexGrow: '2',
    }
}))

export default function Category(){
    const {slug} = useParams()

    type itemsType ={
        count: number,
        next: string,
        previous: string,
        results: Array<{}>
    }

    const [items, setItems] = useState({
        count: 0,
        next: '',
        previous: '',
        results: []
    })
    const [page, setPage] = useState(1)
    const url = `http://127.0.0.1:8000/productbycategory/${slug}/`
    const classes = useStyles()

    const handleChange = (event: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    const getPageItems = useCallback(async () => {
        await axios.get(url+`?page=${page}`).then((response)=>{
            setItems(response.data)
            
        })
    }, [page, url])

    useEffect(() => {
        getPageItems()
    },[page, getPageItems])


    return (
        <div className={classes.categoryContainer}>
            <div className={classes.itemsContainer}>
                {
                    items.results?.length > 0 ?
                    items?.results?.map((item: any) => <ProductItem key={item.id} item={item} />) :
                    null
                }
            </div>
            {
                items?.count > 0 &&
                <Pagination count={items.count > 20 ? items.count / 20 : 1} page={page} onChange={handleChange} />
                }
        </div>
        
    )
}
