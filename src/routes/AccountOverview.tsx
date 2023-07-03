import './AccountOverview.css'
import React, {useEffect, useState} from 'react'
import {useEthers} from '@usedapp/core'
import Box from '@mui/material/Box'
import Tab from '@mui/material/Tab'
import TabContext from '@mui/lab/TabContext'
import TabList from '@mui/lab/TabList'
import TabPanel from '@mui/lab/TabPanel'
import {useAllProducts, useAllOrder} from '../hooks/getData'
import OrderItem from '../components/OrderItem'
import UserProductItem from '../components/UserProductItem'
import Container from '@mui/material/Container'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import {makeStyles} from '@mui/styles'
import {ProductCategories} from '../components/ProductCategories'
import MenuItem from '@mui/material/MenuItem'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'
import { Alert } from '@mui/material'
import { useOutletContext } from 'react-router-dom'
import Modal from "@mui/material/Modal"
import { useSmartContract } from '../hooks/useSmartContract'


const useStyles = makeStyles(() => ({
    form:{
        display: 'flex', 
        flexFlow: 'column',
        gap: '.5em',
        padding: '.5em'
    },
    row: {
        display: 'flex',
        flexFlow: 'row wrap',
        gap: '.5em',
        padding: '.5em'
    },
    addressSection: {
        display: 'flex',
        flexFlow: 'row nowrap',
        justifyContent: 'center',
        placeItems: 'center',
        gap: '.5em',
        padding: '.5em'
    },
    addressInput: {
        flexGrow: '2'
    }
}))

const categories = ProductCategories()

export default function AccountOverview(){
    const [,,, token,] = useOutletContext() as any
    const [value, setValue] = useState("1")
    const {account} = useEthers()
    const [walletConnectionError, setWalletConnectionError] = useState<boolean>(false)

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue)
    }

    const url = "https://onlinestore-backend.vercel.app"

    const {allProducts, isLoading, isError} = useAllProducts()
    const {allOrder, isLoadingOrder, isErrorOrder} = useAllOrder()
    let userProducts = !isLoading ? allProducts.filter((item: any) => item.seller_name === token.id) : null
    let userOrder = !isLoadingOrder ? allOrder.filter((item:any) => item.buyer_name === token.id) : null

    const classes = useStyles()

    const [addProgress, setAddProgress] = useState<boolean>(false)
    const [addProductError, setAddProductError] = useState<boolean>(false)
    const [addProductImageError, setAddProductImageError] = useState<boolean>(false)

    const [imageError, setImageError] = useState<boolean>(false)
    const [success, setSuccess] = useState<boolean>(false)
    const [updateEthAddressAlert, setUpdateEthAddressAlert] = useState<boolean>(false)
    const [updateEthAddressError, setUpdateEthAddressError] = useState<boolean>(false)
    const [ethAddressError, setEthAddressError] = useState<boolean>(false)
    const [reloginAlert, setReloginAlert] = useState<boolean>(false)

    const handleSubmit= async (event: React.FormEvent<HTMLFormElement>)=>{
        event.preventDefault()
        // pId variable for storing the product id
        // also to be used to delete the product if
        // other api calls failed so it won't be saved in the DB.
        let pId:Number
        if (!token.eth_address || token.eth_address.length < 42){
            setEthAddressError(true)
            setTimeout(()=>{
                setEthAddressError(false)
            }, 3000)
            return
        }
        setAddProgress(true)
        await axios.post(`${url}/api/products/`,
            {
                seller_name: token.id,
                name: productData.productname,
                category: productData.category,
                brand: productData.model,
                description: productData.description,
                price: productData.price,
                quantity: productData.quantity,
                seller_eth_address: token.eth_address,
            }
        ).then(async (response) => {
            // here, the pId is saved just incase any of the following API calls fails
            // the above product added will be deleted.
            pId = response.data.id
            await axios.post(`${url}/api/productdetails/`,{
                product: response.data.id,
                gender: productData.gender,
                size: productData.size,
                color: productData.color,
                screen_size: productData.screen_size,
                memory: productData.memory,
                storage_size: productData.storage_size,
                operating_system: productData.operating_system,
                cpu_processor: productData.cpu_processor,
                graphic_card: productData.graphic_card,
                battery_cell: productData.battery_cell,
            }).then(async (response) => {
                await axios.post(`${url}/image/upload/`,{
                    product: response.data.product,
                    image: image
                },{
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                }
                ).then(() => {
                    setAddProgress(false)
                    setSuccess(true)
                    setTimeout(()=>{
                        setSuccess(false)
                    }, 5000)
                }).catch((error)=>{
                    console.log("error adding image to product")
                    axios.delete(`${url}/api/products/${pId}/`)
                    .then(() => {
                        setAddProgress(false)
                        setAddProductImageError(true)
                        // shows error alert if failed
                        setTimeout(()=>{
                            setAddProductImageError(false)
                        },5000)
                    })
                })
            }).catch(()=> {
                // if failed to add details to products then
                // delete the add product.
                console.log('error adding product details')
                axios.delete(`${url}/api/products/${response.data.id}/`)
                .then(() => {
                    setAddProgress(false)
                    setAddProductError(true)
                    // shows error alert if failed
                    setTimeout(()=>{
                        setAddProductError(false)
                    },5000)
                })
            })
        }).catch((error) => {
            console.log("error adding first product")
            setAddProgress(false)
            setAddProductError(true)
            // shows error alert if failed
            setTimeout(()=>{
                setAddProductError(false)
            }, 5000)
        })
    }

    const productDetail = [
        {
            category: 'fashion',
            details: ['gender', 'size', 'color']
        },
        {
            category: 'phone',
            details: ['screen_size', 'memory', 'storage_size', 'operating_system', 'cpu_processor', 'graphic_card', 'battery_cell']
        },
        {
            category: 'tablet',
            details: ['screen_size', 'memory', 'storage_size', 'operating_system', 'cpu_processor', 'graphic_card', 'battery_cell']
        },
        {
            category: 'laptop',
            details: ['screen_size', 'memory', 'storage_size', 'operating_system', 'cpu_processor', 'graphic_card', 'battery_cell']
        },
        {
            category: 'desktop',
            details: ['screen_size', 'memory', 'storage_size', 'operating_system', 'cpu_processor', 'graphic_card', 'battery_cell']
        },
        {
            category: 'gaming',
            details: ['memory', 'storage_size', 'graphic_card', 'battery_cell']
        },
        {
            category: 'gaming',
            details: ['memory', 'storage_size', 'graphic_card', 'battery_cell']
        },
        {
            category: 'sport',
            details: ['color', 'size']
        },
        {
            category: 'books',
            details: []
        },
        {
            category: 'electronics',
            details: ['screen_size']
        }

    ]

    const [productData, setProductData] = useState({
        category: '',
        productname: '',
        model: '',
        description: '',
        price: 0,
        quantity: 0,
        gender: '',
        size: '',
        color: '',
        screen_size: '',
        memory: '',
        storage_size: '',
        operating_system: '',
        cpu_processor: '',
        graphic_card: '',
        battery_cell: '',
    })

    const [image, setImage] = useState('')
    const image_type = ['image/jpeg', 'image/jpg', 'image/png']
    const [imageTypeError, setImageTypeError] = useState<boolean>(false)
    
    const [open, setOpen] = useState<boolean>(false)

    const [ethAddress, setEthAddress] = useState(token.eth_address ? token.eth_address : "0x0000") // for updating ETH address
    const {checkBalanceInContract, salesBalance, withdrawFundInContract, withdrawFundState} = useSmartContract()

    const isMiningWithdrawal = withdrawFundState.status === "Mining" // check withdrawal status
    const withdrawalFailed = withdrawFundState.status === "Fail" 
    const withdrawalSuccess = withdrawFundState.status === "Success"

    const handleImageChange = (e: any) => {
        console.log(e.target.files[0])
        if ((e.target.files[0].size/1000) > 600){
            setImageError(true)
            setTimeout(()=>{
                setImageError(false)
            },5000)
            return
        }
        var result = image_type.includes(e.target.files[0].type)
        if (!result){
            setImageTypeError(true)
            setTimeout(()=>{
                setImageTypeError(false)
            },5000)
            return
        }
        setImage(e.target.files[0])
    }


    const handleInputChange = (e:any) => {
        setProductData({
            ...productData,
            [e.target.name]: e.target.value
        })
    }

    const [details, setDetails]: any = useState({
        category: '',
        details: []
    })

    const handleOpen = () => setOpen(true)

    const handleClose = () => setOpen(false)

    useEffect(() => {
        if (productData.category === '') return
        let temp = productDetail.find((item) => item.category === productData.category)
        setDetails({...temp})
    },[productData.category])

    const [ethAddressInputError, setEthAddressInputError] = useState<boolean>(false)
    const [updatingEthAddress, setUpdatingEthAddress] = useState<boolean>(false)

    const handleEthAddressUpdate = async () => {
        setUpdatingEthAddress(true)
        if (!ethAddress || ethAddress.length < 42){
            setUpdatingEthAddress(false)
            setEthAddressInputError(true)
            setTimeout(()=> {
                setEthAddressInputError(false)
            }, 3000)
            return
        }
        await axios.patch(`${url}/api/users/${token.id}/`, {
            eth_address: ethAddress,
        }).then((response) => {
            setUpdatingEthAddress(false)
            setUpdateEthAddressAlert(true)
            setTimeout(()=>{
                setUpdateEthAddressAlert(false)
            }, 3000)
            setReloginAlert(true)
            setTimeout(()=>{
                setReloginAlert(false)
            }, 3000)
        }).catch((error) => {
            setUpdatingEthAddress(false)
            setUpdateEthAddressError(true)
            setTimeout(()=>{
                setUpdateEthAddressError(false)
            }, 3000)
        })
    }

    //const checkSaleBalance = useCallback(() => {
    //    checkBalanceInContract(token.eth_address)
    //}, [token.eth_address])

    //useEffect(() => {
    //    checkSaleBalance()
    //},[checkSaleBalance, token.eth_address])

    const handleCheckBalance = () => {
        if (account === undefined){
            setWalletConnectionError(true)
            setTimeout(() => {
                setWalletConnectionError(false)
            }, 5000)
            return
        }
        checkBalanceInContract()
    }

    const handleWithdraw = () => {
        if (account === undefined){
            setWalletConnectionError(true)
            setTimeout(() => {
                setWalletConnectionError(false)
            }, 5000)
            return
        }
        withdrawFundInContract()
    }

    return (
        <Container maxWidth="md" style={{display: 'flex', flexDirection:'column', gap:'.7em'}}>
        <section style={{display: 'flex', justifyContent: 'flex-start', gap: '.5em', padding: '.5em'}}>
            <b>Email: {token.email}</b> 
        </section>
        <section style={{display: 'flex', flexDirection: 'column', gap: '.5em', padding: '.5em'}}>
            <p
                style={{display: 'flex', placeContent: 'center center'}}
            >
                <Button variant="contained" onClick={handleCheckBalance}>
                    Sales Made: {salesBalance !== "" ? salesBalance : "0"}
                </Button>  
            </p>
            {walletConnectionError && <Alert severity="info">please connect your wallet!</Alert>}
        </section>
        <section style={{display: 'flex', flexDirection: 'column', gap: '.5em', padding: '.5em'}}>
            <Button onClick={handleWithdraw} disabled={isMiningWithdrawal} variant="contained">
                {
                    isMiningWithdrawal ? <CircularProgress/> : "withdraw"
                }
            </Button>
            {
                withdrawalSuccess && <Alert severity="success">contract sales withdrawal successful.</Alert>
            }
            {
                withdrawalFailed && <Alert severity="error">withdrawal failed, try again.</Alert>
            }
        </section>
        <section style={{display: 'flex', flexDirection: 'column', gap: '.5em', padding: '.5em'}}>
            <section className={classes.addressSection}>
                <TextField className={classes.addressInput} onChange={(e) => setEthAddress(e.target.value)} required value={ethAddress} label="Eth address" />
                <Button variant="contained" disabled={updatingEthAddress ? updatingEthAddress : false} onClick={handleEthAddressUpdate}>
                    {updatingEthAddress ? <CircularProgress size={26} /> : "update"}
                </Button>
            </section>
            {
                ethAddressInputError && <Alert severity='warning'>check the ETH address.</Alert>
            }
            {
                updateEthAddressAlert && <Alert severity="success">ETH address updated successfully!</Alert>
            }
            {
                reloginAlert && <Alert severity="info">Please re-login again for address to take effect!</Alert>
            }
            {
                updateEthAddressError && <Alert severity="error">ETH address update failed! Retry</Alert>
            }
        </section>
        
        <Button variant='contained' onClick={handleOpen} style={{margin:'1em'}} color='primary'>Add a product</Button>
        <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal for add product"
            aria-describedby="product form"
        >
            <div className="modal">
                <Button onClick={handleClose} style={{color: 'rgb(223, 101, 101)'}}>close</Button>
                <form onSubmit={handleSubmit} className={classes.form}>
                    <TextField label="category" name="category" value={productData.category} onChange={handleInputChange} required select helperText="select product category">
                        {
                            
                            categories.map((option) => (
                                <MenuItem key={option.id} value={option.name}>{option.name}</MenuItem>
                            ))
                        }
                    </TextField>
                    <div className={classes.row}>
                        {
                            Object.keys(details).length > 0 &&
                            details.details.map((value:any) => (<TextField label={value} key={value} name={value} onChange={handleInputChange} variant='standard'/> ))
                        }
                    </div>
                    <TextField label='product name' onChange={handleInputChange} name="productname" required variant='standard'/>
                    <TextField label='product model' name="model" onChange={handleInputChange} required variant='standard'/>
                    <TextField label="description" name="description" onChange={handleInputChange} required multiline rows={5}/>
                    <TextField label="price" name="price" required onChange={handleInputChange} inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}}  variant='standard'/>
                    <TextField inputProps={{inputMode: 'numeric', pattern: '[0-9]*'}} name="quantity" onChange={handleInputChange} required label="quantity" variant='standard'/>
                    <input type="file" accept="image/*" onChange={handleImageChange} id="button-file" style={{display: 'none'}}/>
                    <label htmlFor='button-file'>
                        <Button variant="contained" component="span">Add Image</Button>
                        <span>max image size: 600kb. File type: jpg, png, jpeg</span>
                    </label>
                    <section>
                        {
                            addProductError && <Alert severity="error">Failed to add product, try again!</Alert>
                        }
                        {
                            addProductImageError && <Alert severity="error">Image upload failed, try again!</Alert>
                        }
                        {
                            imageError && <Alert severity="warning">Image size should be less than 600kb</Alert>
                        }
                        {
                            imageTypeError && <Alert severity="warning">Image type should be either jpeg, jpg, or png.</Alert>
                        }
                        <Button type='submit' variant="contained" disabled={addProgress} color="primary">{addProgress ? <CircularProgress /> : 'Add'}</Button>
                        {
                            success && <Alert severity="success">Product added successfully</Alert>
                        }
                        {
                            ethAddressError && <Alert severity="error">ETH address required, Update your ETH address!</Alert>
                        }
                    </section>
                </form>
            </div>
        </Modal>
        
        <Box sx={{width: '100%'}}>
            <TabContext value={value}>
                <Box sx={{borderBottom: 1, borderColor: 'divider'}}>
                    <TabList onChange={handleChange} aria-label="overview tablist">
                        <Tab label="Products" value="1" />
                        <Tab label="Orders" value="2" />
                    </TabList>
                </Box>
                <TabPanel value="1">
                    {
                        userProducts?.length > 0
                        ?
                        userProducts?.map((item:any) => <UserProductItem key={item.id} item={item}/>)
                        :
                        <div>
                            No products found, add a product.
                        </div>
                    }
                </TabPanel>
                <TabPanel value="2">
                    {
                        userOrder?.length > 0
                        ?
                        userOrder?.map((item:any) => <OrderItem key={item.id} item={item}/>)
                        :
                        <div>
                            No order yet, place an order.
                        </div>
                    }
                </TabPanel>
            </TabContext>
        </Box>
        </Container>
    )
}