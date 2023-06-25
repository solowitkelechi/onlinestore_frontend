import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import {useProduct, useImage} from '../hooks/getData'

export default function UserProductItem({item}: any){
    const {productImage} = useImage(item.id)

    return (
        <Card sx={{display: 'flex', mt:1}}>
            <CardMedia 
                component="img"
                sx={{width: 140}}
                image={productImage?.image_url}
            />
            <Box sx={{display: 'flex', justifyContent: 'space-around', flexDirection: 'column', p: 1.5}}>
                <p>{item.name}</p>
                <p>{item.brand}</p>
                <b>${item.price}</b>
                <pre>order: {item.id}</pre>
            </Box>
        </Card>
    )
}
