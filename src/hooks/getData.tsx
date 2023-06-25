import useSWR from 'swr'
import axios from 'axios'

export function useUser(id:any){
    const fetcher = (url: string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/users/${id}/`, fetcher)
    return {
        user: data,
        isLoading,
        isError: error,
    }
}

export function useAllProducts(){
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/products/`, fetcher)
    
    return {
        allProducts: data,
        isLoading,
        isError: error,
    }
}

export function useRandomProducts(){
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/randomproducts/`, fetcher)
    
    return {
        randomProducts: data,
        isLoadingRandom: isLoading,
        isErrorRandom: error,
    }
}

export function useAllOrder(){
    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/orderhistory/`, fetcher)
    
    return {
        allOrder: data,
        isLoadingOrder: isLoading,
        isErrorOrder: error,
    }
}

export function useProduct(id:any){
    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/products/${id}/`, fetcher)
    return {
        product: data,
        isLoading,
        isError: error,
    }
}

export function useProductsForPrice(){
    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/products/`, fetcher)
    return {
        products: data,
        isLoading,
        isError: error,
    }
}

export function useProductCategory(category:any){
    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/productbycategory/${category}/`, fetcher)
    return {
        productItems: data,
        isLoading,
        isError: error,
    }
}

export function useImage(id:any){
    const fetcher = (url: string) => axios.get(url).then(response => response.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/image/${id}/`, fetcher)
    return {
        productImage: data,
        isLoading,
        isError: error,
    }
}

export function useProductDetail(id:any){
    const fetcher = (url: string) => axios.get(url).then(response => response.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/productdetail/get/${id}/`, fetcher)
    return {
        productDetail: data,
        isLoading,
        isError: error,
    }
}