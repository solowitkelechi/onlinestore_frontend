import {makeStyles} from '@mui/styles'

const useStyles = makeStyles(() => ({
    container: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '90vh',
        fontSize: '2rem'
    }
}))

const NoMatch = () => {
    const classes = useStyles()

    return (
        <div className={classes.container}>
            <p>Page Not Found</p>
        </div>
    )
}

export default NoMatch