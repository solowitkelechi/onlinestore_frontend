import useSWR from 'swr'
import axios from 'axios'

export function useUser(id:any){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`http://127.0.0.1:8000/api/users/${id}/`, fetcher)
    return {
        user: data,
        isLoading,
        isError: error,
    }
}

export function useAllProducts(){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`${url}/api/products/`, fetcher)
    
    return {
        allProducts: data,
        isLoading,
        isError: error,
    }
}

export function useRandomProducts(){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`${url}/randomproducts/`, fetcher)
    
    return {
        randomProducts: data,
        isLoadingRandom: isLoading,
        isErrorRandom: error,
    }
}

export function useAllOrder(){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url: string) => axios.get(url).then(res => res.data)
    const {data, error, isLoading} = useSWR(`${url}/api/orderhistory/`, fetcher)
    
    return {
        allOrder: data,
        isLoadingOrder: isLoading,
        isErrorOrder: error,
    }
}

export function useProduct(id:any){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`${url}/api/products/${id}/`, fetcher)
    return {
        product: data,
        isLoading,
        isError: error,
    }
}

export function useProductsForPrice(){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`${url}/api/products/`, fetcher)
    return {
        products: data,
        isLoading,
        isError: error,
    }
}

export function useProductCategory(category:any){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url:string) => axios.get(url).then(res => res.data)

    const {data, error, isLoading} = useSWR(`${url}/productbycategory/${category}/`, fetcher)
    return {
        productItems: data,
        isLoading,
        isError: error,
    }
}

export function useImage(id:any){
    const url = "https://onlinestore-backend.vercel.app"

    const fetcher = (url: string) => axios.get(url).then(response => response.data)
    const {data, error, isLoading} = useSWR(`${url}/image/${id}/`, fetcher)
    return {
        productImage: data,
        isLoading,
        isError: error,
    }
}

export function useProductDetail(id:any){
    const url = "https://onlinestore-backend.vercel.app"
    const fetcher = (url: string) => axios.get(url).then(response => response.data)
    const {data, error, isLoading} = useSWR(`${url}/productdetail/get/${id}/`, fetcher)
    return {
        productDetail: data,
        isLoading,
        isError: error,
    }
}