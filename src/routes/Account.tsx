import React, {useRef, useState} from 'react'
import axios from 'axios'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import GoogleIcon from '@mui/icons-material/Google'
import AppleIcon from '@mui/icons-material/Apple'
import Alert from '@mui/material/Alert'
import CircularProgress from '@mui/material/CircularProgress'
import './Account.css'
import {Navigate, useOutletContext} from 'react-router-dom'


export default function Account(){
    const [,,,, setToken] = useOutletContext() as any
    const loginRef = useRef<HTMLDivElement>(null)
    const registerRef = useRef<HTMLDivElement>(null)
    const [email, setEmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [username, setUsername] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")
    const [failedLoginAlert, setFailedLoginAlert] = useState<boolean>(false)
    const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false)
    const [isSigningUp, setIsSigningUp] = useState<boolean>(false)
    const [networkError, setNetworkError] = useState<boolean>(false)
    const [redirect, setRedirect] = useState<boolean>(false)
    const [errorMessage, setErrorMessage] = useState<string>("")
    const [signUpSuccess, setSignUpSuccess] = useState<boolean>(false)
    const [invalidPassword, setInvalidPassword] = useState<boolean>(false)
    const [showPasswordRecovery, setShowPasswordRecovery] = useState<boolean>(false)
    const [isRecovering, setIsRecovering] = useState<boolean>(false)
    const [recoveryEmail, setRecoveryEmail] = useState<string>("")
    const [wrongEmailAlert, setWrongEmailAlert] = useState<boolean>(false)
    const [emailAlertError, setEmailAlertError] = useState<boolean>(false)
    const [showEmailSent, setShowEmailSent] = useState<boolean>(false)
    const [showEmailError, setShowEmailError] = useState<boolean>(false)
    const [reverted, setReverted] = useState<boolean>(false)
    const [requestTimeoutError, setRequestTimeoutError] = useState<boolean>(false)

    const url = "https://solowitkelechi.pythonanywhere.com"

    const hideForm= () => {
        setEmail("")
        setPassword('')
        setConfirmPassword("")
        if (loginRef.current !== null && registerRef.current !== null) {
            loginRef.current.classList.add('toggle-login')
            registerRef.current.classList.add('toggle-register')
        }
    }

    const showForm=() => {
        setEmail("")
        setPassword('')
        setConfirmPassword("")
        if (loginRef.current !== null && registerRef.current !== null){
            loginRef.current.classList.remove('toggle-login')
            registerRef.current.classList.remove('toggle-register')
        }
    }

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsSigningUp(true)
        if (password !== confirmPassword){
            setInvalidPassword(true)
            setTimeout(()=> {
                setInvalidPassword(false)
            }, 3000)
            setIsSigningUp(false)
            return
        }
        await axios.post(url + "/api/users/", {
            username: username,
            email: email,
            password: password,
        }).then((response) => {
            setIsSigningUp(false)
            setUsername("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setSignUpSuccess(true)
            setTimeout(()=>{
                setSignUpSuccess(false)
            },3000)
        }).catch((error) => {
            setIsSigningUp(false)
            setErrorMessage(error.response.data.email + error.response.data.username)
            setNetworkError(true)
            setTimeout(()=>{
                setNetworkError(false)
            }, 3000)
        })
    }

    const handleLogin = async (e: React.FormEvent) => {
        setIsLoggingIn(true)
        e.preventDefault()
        await axios.post(url+"/userauth/",
            {
                email: email,
                password: password,
            }
        ).then((response) => {
            if (response.data.status === "success"){
                setToken(response.data.data)
                setEmail("")
                setPassword("")
                setIsLoggingIn(false)
                setRedirect(true)
            } else if(response.data.status === "failed"){
                setFailedLoginAlert(true)
                setIsLoggingIn(false)
                setTimeout(()=>{
                    setFailedLoginAlert(false)
                }, 3000)
            }
        })
        .catch((error) => {
            setIsLoggingIn(false)
            setNetworkError(true)
            setTimeout(()=>{
                setNetworkError(false)
            }, 3000)
        })
    }

    // this function will be save in a model alongside
    // the userid and also will be sent to the user email as a link
    // which will be check later on if the user requested for a password recovery
    // and also will be expired after a specific time. maybe 5 minutes.
    const randomKey = () => {
        const head = Date.now().toString(36)
        const tail = Math.random().toString(36).substr(2)
        return head + tail
    }

    const revertRecoveryProcess = (id: number) => {
        setShowEmailError(true)
        setIsRecovering(false)
        setTimeout(()=>{
            setShowEmailError(false)
        },3000)
        axios.delete(url + `/passwordrecovery/${id}/`)
        .then((response)=>{
            setReverted(true)
            setTimeout(()=>{
                setReverted(false)
            }, 3000)
        })
    }

    const handlePasswordRecovery = async (e: any) => {
        e.preventDefault()
        setIsRecovering(true)
        const keyString = randomKey()
        const userdata = await axios.post(url + '/checkemail/', {'email': recoveryEmail})
            .then((response) => {
                if (response.data.status === "success"){
                    return response.data.data.id
                }
                else if (response.data.status === 'failed'){
                    setWrongEmailAlert(true)
                    setTimeout(()=>{
                        setWrongEmailAlert(false)
                    }, 3000)
                    setIsRecovering(false)
                    return 'null'
                }
            })
            .catch((error) => {
                setEmailAlertError(true)
                setTimeout(()=>{
                    setEmailAlertError(false)
                }, 3000)
                setIsRecovering(false)
                return 'null'
            })
        if (userdata === "null") return

        const recoveryData = await axios.post(url + '/saverecoverykey/',{
            user: userdata,
            key: keyString,
        }).then((response) => {
            return response.data
        }).catch((error)=>{
            setNetworkError(true)
            setTimeout(()=> {
                setNetworkError(false)
            }, 3000)
            setIsRecovering(false)
        })
        if (recoveryData){
            axios.post(url + '/sendemail/',
            {
                subject: 'BuyNow password reset',
                text_content: 'Password reset: very important',
                email: recoveryEmail,
                html_content: `
                    <html>
                        <head>
                            <link href="https://fonts.googleapis.com/css2?family=Rajdhani&display=swap" rel="stylesheet"/>
                            <style>
                                body{
                                    font-family: 'Rajdhani', sans-serif;
                                    font-size: 1.5rem;
                                }
                            </style>
                        </head>
                        <body>
                            <div style="border-top-right-radius: 2px; border-top-left-radius: 2px; background-color: #212529;">
                                <h2 style="color: #b7bdb9;padding: 5px;"><b>BuyNow</b></h2>
                            </div>
                            <div style="padding: 5px;">
                                <h3>Password reset request</h3>
                                <div>
                                    <p>
                                        <a 
                                            style="text-decoration: none; padding: 5px; background-color: #3b4c82;border-radius: 3px; color: whitesmoke" 
                                            href="https://onlinestore-frontend.vercel.app/password-reset/${recoveryData.key}">
                                            click to reset password
                                        </a>
                                    </p>
                                    <p>
                                        Link will expire in 5 minutes.
                                    </p> 
                                </div>
                                <div>
                                    <p>
                                        Regards, <br>
                                        BuyNow team.
                                    </p>
                                </div>
                            </div>
                        </body>
                    </html>
                `
            },{
                timeout: 10000,
            })
            .then((response) => {
                if (response.status){
                    setIsRecovering(false)
                    setShowEmailSent(true)
                    setRecoveryEmail("")
                    setTimeout(()=> {
                        setShowEmailSent(false)
                    }, 3000)
                }
                else{
                    setNetworkError(true)
                    setTimeout(()=>{
                        setNetworkError(false)
                    }, 3000)
                    revertRecoveryProcess(recoveryData.id)
                }
            })
            .catch((error)=> {
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
                revertRecoveryProcess(recoveryData.id)
            })
        }
    }

    if (redirect) return <Navigate to="/" />

    return(
            <div className="account_container">
            {
                failedLoginAlert ? <Alert variant="outlined" severity="error">Incorrect username or password.</Alert> : null
            }
            {
                networkError ? <Alert variant="outlined" severity="error">{errorMessage}</Alert> : null
            }
            {
                signUpSuccess && <Alert variant="outlined" severity="success">Account registration successful, please login.</Alert>
            }
            {
                invalidPassword && <Alert variant="outlined" severity="error">passwords do not match.</Alert>
            }
            <div className="login" ref={loginRef}>
                <form method='post' className='form' onSubmit={handleLogin}>
                    <TextField label="Email" onChange={e => setEmail(e.target.value)} value={email}/>
                    <TextField label="Password" inputProps={{minLength: 8, maxLength: 30,}} type="password" onChange={e => setPassword(e.target.value)} value={password}/>
                    <Button type='submit' variant="contained" disabled={isLoggingIn ? true : false}>
                        {
                            isLoggingIn ? <CircularProgress size={26}/> : "Log in"
                        }
                    </Button>
                    <section className="social">
                        <h4>Login using social account</h4>
                        <div className="icon">
                            <GoogleIcon/>
                            <AppleIcon/>
                        </div>
                    </section>
                    <section>
                    <Button onClick={hideForm} variant='outlined'>Sign up</Button>
                    </section>
                </form>
                <Button size="small" onClick={()=> setShowPasswordRecovery(!showPasswordRecovery)}>
                    {!showPasswordRecovery ? "show password recovery" : "hide password recovery"}
                </Button>
                {
                    showPasswordRecovery && 
                    <form method="post" onSubmit={handlePasswordRecovery}  className="form">
                        <TextField 
                            type="email" 
                            label="Email" 
                            onChange={(e)=> setRecoveryEmail(e.target.value)}
                            value={recoveryEmail}
                            required
                        />
                        <Button 
                            type="submit" 
                            size="small" 
                            variant="contained"
                            disabled={isRecovering ? true : false}
                        >
                            {isRecovering ? <CircularProgress size={26}/> : "Recover password"}
                        </Button>
                        {
                            requestTimeoutError && <Alert severity='error'>request timeout, try again.</Alert>
                        }
                        {
                            wrongEmailAlert && <Alert severity='info'>No user with this email yet.</Alert>
                        }
                        {
                            emailAlertError && <Alert severity="error">check network connection.</Alert>
                        }
                        {
                            showEmailSent && <Alert severity="success">Check your email for password reset link</Alert>
                        }
                    </form>
                }
            </div>

            <div className="register" ref={registerRef}>
                <form onSubmit={handleSignup} method='post' className='form'>
                    <TextField label="Username" name="username" onChange={e => setUsername(e.target.value)} value={username}/>
                    <TextField label="Email" name="email" onChange={e => setEmail(e.target.value)} value={email}/>
                    <TextField label="Password" inputProps={{minLength: 8, maxLength: 30,}} name="password" type="password" onChange={e => setPassword(e.target.value)} value={password}/>
                    <TextField label="confirm password" inputProps={{minLength: 8, maxLength: 20,}} name="confirm-password" type="password" onChange={e => setConfirmPassword(e.target.value)} value={confirmPassword}/>
                    <Button type="submit" variant="contained" disabled={isSigningUp ? true : false}>
                        {
                            isSigningUp ? <CircularProgress size={26}/> : "Sign up"
                        }
                    </Button>
                    <section className="social">
                        <h4>Sign up using social account</h4>
                        <div className="icon">
                            <GoogleIcon/>
                            <AppleIcon/>
                        </div>
                    </section>
                    <section>
                        <Button onClick={showForm} variant='outlined'>Log in</Button>
                    </section>
                </form>
            </div>
            
        </div>
    )
}