import Card from '@mui/material/Card'
import CardMedia from '@mui/material/CardMedia'
import Box from '@mui/material/Box'
import {useImage} from '../hooks/getData'

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
            </Box>
        </Card>
    )
}
