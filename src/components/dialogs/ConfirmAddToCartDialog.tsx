import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react'
import { Product } from '../../types';
import Button from '../Button';
import DialogWrapper from './DialogWrapper';

interface Props {
    header:string
    cartItemData: {product: Product;quantity:number} | null
    goToCart: () => void
    continueShopping: () => void
}


const ConfirmAddToCartDialog: React.FC<Props> = ({header,cartItemData,goToCart,continueShopping}) => {
        return (
            <DialogWrapper header={header}>
                <div className="dialag-body">
                    <div className="dialog-body__cart-info">
                        <FontAwesomeIcon icon={['fas','check-circle']} size='lg' color='green'/>
                        
                        <img width='30px' src={cartItemData?.product.imageUrl} alt={cartItemData?.product.title} />

                        <p className="paragraph">{cartItemData?.product.title}</p>

                        <p className="paragraph">{cartItemData?.quantity}</p>

                        <Button onClick={goToCart}>Vai al carrello</Button>

                    </div>

                    <Button width='13rem' className='btn--orange'
                        onClick={continueShopping}
                    >Continua a comprare</Button>
                </div>
            </DialogWrapper>
        );
}

export default ConfirmAddToCartDialog