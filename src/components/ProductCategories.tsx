import laptop from '../images/laptop.jpg'
import phone from '../images/iphone.jpg'
import desktop from '../images/desktop.jpg'
import fashion from '../images/fashion.jpg'
import game from '../images/game.jpg'
import book from '../images/books.jpg'
import sport from '../images/sport.jpeg'
import tablet from '../images/tablet.jpg'
import electronics from '../images/electronics.png'

export function ProductCategories(){
    const categories = [
        {
            id: 0,
            name: 'phone',
            image: phone
        },
        {
            id: 1,
            name: 'tablet',
            image: tablet
        },
        {
            id: 2,
            name: 'laptop',
            image: laptop,
        },
        {
            id: 3,
            name: 'desktop',
            image: desktop,
        },
        {
            id: 4,
            name: 'gaming',
            image: game
        },
        {
            id: 5,
            name: 'fashion',
            image: fashion
        },
        {
            id: 6,
            name: 'sport',
            image: sport
        },
        {
            id: 7,
            name: 'books',
            image: book 
        },
        {
            id: 8,
            name: 'electronics',
            image: electronics
        }
    ]
    return categories
}