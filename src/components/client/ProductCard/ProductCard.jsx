import React from 'react';
import image from  '../../../assets/imgs/test.jpg'
import { useNavigate } from 'react-router-dom';
import { ProductCardContext } from '../../../services/state/productCardContext';
import { useContext } from 'react';

export default function ProductCard({product}){


    const { handleProductClick } = useContext(ProductCardContext); 

    const navigate = useNavigate();
    const handleNavigation = (event, path) => {
        event.preventDefault();
        navigate(path);
    };

    const handleCartClick = () => {


        handleProductClick(product);
        navigate('/product-page');
        window.scrollTo(0,0);
    }

    return (

        <>
            <div className="product-card">
                <img src={image} alt={product.name} />
                <p>{product.name}</p>
                <p className="description">{product.description}</p>
                <p>${product.price}</p>
                <button className="add-to-cart" data-id={product.id} onClick={handleCartClick}>Add to cart</button>
            </div>
        </>
    );


}