import { useState, useEffect } from "react";
import ProductCard from "../ProductCard/ProductCard";
import living from '../../../assets/imgs/living.jpg';
import dining from '../../../assets/imgs/dining.jpg';
import bedroom from '../../../assets/imgs/bedroom.jpg';
import setup from '../../../assets/imgs/setup.png';
import { useNavigate, Link } from 'react-router-dom';
import { getAllProducts } from "../../../services/api/productsService";


export default function Home() {
    const [offset, setOffset] = useState(0);
    const limit = 8;

    

   const [products, setProducts] = useState([]);

   
   
    const handleFetchProducts = async () => {
   
        try {
            const response = await getAllProducts();
            const allProducts = response.body.list;
            setProducts(allProducts);
    
        } catch (err) {
            console.error(err);
        }
   
    }
    useEffect(() => {
        handleFetchProducts();
    }, []);


    const handleShowMore = () => {
        setOffset((prevOffset) => prevOffset + limit);
    };

    const navigate = useNavigate();
    const handleNavigation = (event, path) => {
        event.preventDefault();
        navigate(path);
    };

    return (
        <div className="container">
            <div className="header-container">
                <h1>Furniro</h1>
                <div className="navigation-container">
                    <a href="#"><p>Home</p></a>
                    <Link to={'/shop'} className="shop-link"><p>Shop</p></Link>
                    <a href="#"><p>About</p></a>
                    <a href="#"><p>Contact</p></a>
                </div>
                <div className="navigation-container-icons">
                    <Link to={'/account'} className="user-icon"><i className="fa-regular fa-user"></i></Link>
                    <Link to={'/cart'} className="shopping-cart-icon"><i className="fa-solid fa-cart-shopping"></i></Link>
                </div>
            </div>

            <div className="aside-container">
                <div className="content-container">
                    <p className="line-space">New Arrival</p>
                    <h2>Discover Our <br /> New Collection</h2>
                    <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit, obcaecati.</p>
                    <button className="buy-now-btn" onClick={(e) => handleNavigation(e, '/shop')}>BUY NOW</button>
                </div>
            </div>

            <div className="main-container">
                <div className="range-container">
                    <div className="title-container">
                        <h1>Browse The Range</h1>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Sunt, autem.</p>
                    </div>
                    <div className="section-container">
                        <div className="section-card dining-section">
                            <img src={dining} alt="dining" className="dining-img" />
                            <p>Dining</p>
                        </div>
                        <div className="section-card living-section">
                            <img src={living} alt="living" />
                            <p>Living</p>
                        </div>
                        <div className="section-card bedroom-section">
                            <img src={bedroom} alt="bedroom" />
                            <p>Bedroom</p>
                        </div>
                    </div>
                </div>

                <div className="products-container">
                    <div className="title">
                        <h1>Our Products</h1>
                    </div>
                    <div className="card-section">
                        {products.slice(0, offset + limit).map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                    {offset + limit < products.length && (
                        <button className="show-more-button" onClick={handleShowMore}>Show More</button>
                    )}
                </div>

                <div className="setup-container">
                    <p>Share your setup with</p>
                    <h1>#FuniroFurniture</h1>
                    <img src={setup} alt="setup" />
                </div>
            </div>

            <div className="footer-container">
                <hr width="100%" />
                <div className="footer-section">
                    <div className="address-section">
                        <h4>Furniro.</h4>
                        <p className="description">400 University Drive Suite 200 Caral Gables <br /> FL 33134 USA</p>
                    </div>
                    <div className="links-section">
                        <p className="description">Links</p>
                        <a href=""><p>Home</p></a>
                        <a href=""><p>Shop</p></a>
                        <a href=""><p>About</p></a>
                        <a href=""><p>Contact</p></a>
                    </div>
                    <div className="help-section">
                        <p className="description">Help</p>
                        <a href=""><p>Payment Options</p></a>
                        <a href=""><p>Returns</p></a>
                        <a href=""><p>Privacy Policies</p></a>
                    </div>
                    <div className="newsletter-section">
                        <p className="description">Newsletter</p>
                        <input type="email" name="email" id="newsletter-email" placeholder="Enter your email address" />
                        <button className="newsletter-button">SUBSCRIBE</button>
                    </div>
                </div>
                <hr width="80%" />
                <div className="end-section">
                    <p>2025 Furniro. All rights reserved</p>
                </div>
            </div>
        </div>
    );
}