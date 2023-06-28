import {useState, useEffect, useCallback} from 'react';
import axios from 'axios'
import {useParams} from 'react-router-dom'
import {Button, Container, TextField, Alert} from '@mui/material'
import CircularProgress from '@mui/material/CircularProgress'
import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(()=> ({
    form: {
        display: 'flex',
        flexFlow: 'column',
        gap: '1em',
        width: 'inherit'
    },
    container:{
        display: 'flex',
        flexDirection: 'column',
        height: '80vh', 
        justifyContent: 'center',
        alignItems: 'center'
    }
}))


const PasswordReset = () => {
    const {slug} = useParams()
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [showKeyExpiryStatus, setShowKeyExpiryStatus] = useState<boolean>(false)
    const [showExpiryError, setShowExpiryError] = useState<boolean>(false)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [keyErrorStatus, setKeyErrorStatus] = useState<boolean>(false)
    const [passwordEqualError, setPasswordEqualError] = useState<boolean>(false)
    const [networkError, setNetworkError] = useState<boolean>(false)
    const [requestTimeoutError, setRequestTimeoutError] = useState<boolean>(false)
    const [resetStatus, setResetStatus] = useState<boolean>(false)

    const [keydetail, setKeydetail] = useState({
        id: 0,
        key: '',
        user: 0,
    })
    const url = "https://solowitkelechi.pythonanywhere.com"

    const classes = useStyles()

    const checkKeyExpiration = useCallback(async () => {
        await axios.post(`${url}/passwordrecovery/`, {
            key: slug,
        })
        .then((response) => {
            if (response.data.status === 'success'){
                setKeydetail(response.data.data)
            }
            else{
                setShowKeyExpiryStatus(true)
                setTimeout(()=>{
                    setShowKeyExpiryStatus(false)
                }, 3000)
                setKeyErrorStatus(true)
            }
        })
        .catch((error) => {
            setShowExpiryError(true)
            setTimeout(()=>{
                setShowExpiryError(false)
            }, 3000)
            setKeyErrorStatus(true)
        })
    }, [])

    useEffect(()=>{
        console.log(keydetail)
    }, [keydetail])

    useEffect(() => {
        if (slug){
            checkKeyExpiration()
        }
    }, [checkKeyExpiration, slug])

    const handleResetPassword = async (e: any) => {
        setIsLoading(true)
        e.preventDefault()
        if (keyErrorStatus){
            setIsLoading(false)
            setShowKeyExpiryStatus(true)
            setTimeout(()=>{
                setShowKeyExpiryStatus(false)
            }, 3000)
            setKeyErrorStatus(true)
            return
        }
        if (password !== confirmPassword){
            setIsLoading(false)
            setPasswordEqualError(true)
            setTimeout(() => {
                setPasswordEqualError(false)
            }, 3000)
            return
        }
        if (keydetail.user !== undefined){
            await axios.patch(`${url}/api/users/${keydetail.user}/`,{
                password: password,
            },{
                timeout: 10000,
            })
            .then((response) => {
                setResetStatus(true)
                setTimeout(()=>{
                    setResetStatus(false)
                },3000)
            })
            .catch((error) => {
                if (error.code === 'ECONNABORTED'){
                    setRequestTimeoutError(true)
                    setTimeout(()=>{
                        setRequestTimeoutError(false)
                    }, 3000)
                }else{
                    setNetworkError(true)
                    setTimeout(()=>{
                        setNetworkError(false)
                    }, 3000)
                }
            })
        }

    }

    return (
        <Container className={classes.container}>
            <form className={classes.form} onSubmit={handleResetPassword}>
                <h2>Password Reset</h2>
                <TextField required label="Password" min-length='8' inputProps={{minLength: 8, maxLength: 30,}} onChange={(e) => setPassword(e.target.value)} value={password}/>
                <TextField required label="Confirm Password" inputProps={{minLength: 8, maxLength: 30,}} onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                <Button type="submit" variant="contained">
                    {
                        isLoading ? <CircularProgress size={26} /> : 'confirm change'
                    }
                </Button>
            </form>
            {
                networkError && <Alert severity='error'>check network connection.</Alert>
            }
            {
                requestTimeoutError && <Alert severity="info">request timeout, try again.</Alert>
            }
            {
                passwordEqualError && <Alert severity='error'>passwords do not match!</Alert>
            }
            {
                showKeyExpiryStatus && <Alert severity='error'>reset link expired!</Alert>
            }
            {
                showExpiryError && <Alert severity='error'>Error, check network status!</Alert>
            }
            {
                resetStatus && <Alert severity='success'>password reset successful.</Alert>
            }
        </Container>
    )
}

export default PasswordReset