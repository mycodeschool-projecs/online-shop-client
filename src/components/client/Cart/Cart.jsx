import {  useState, useEffect } from "react";
import {deleteProductFromCart, getCart} from "../../../services/api/cartService";
import CartProductCard from "../CartProductCard/CartProductCard";
import { useNavigate, Link } from 'react-router-dom';


export default function Cart() {
    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);

    const navigate = useNavigate();
    ;
    
    const fetchUserCart = async () => {
        let data = await getCart();

        if (data.success) {
            setCart(data.body.list);
        }
    };

    useEffect(() => {
        fetchUserCart();
    }, []);

   
    useEffect(() => {
        const totalAmount = cart.reduce((sum, product) => {
            return sum + product.price * product.quantity;
        }, 0);
        setTotal(totalAmount.toFixed(2));
    }, [cart]);

    
    const handleProductDelete = async (productId) => {
        const data = await deleteProductFromCart( productId);

        if (data.success) {
           
            setCart((prevCart) => prevCart.filter((product) => product.productId !== productId));
        }
    };

    
    const handleQuantityUpdate = (productId, newQuantity) => {
        const updatedCart = cart.map((product) =>
            product.productId === productId ? { ...product, quantity: newQuantity } : product
        );
        setCart(updatedCart);
    };

    return (
        <>
            <div className="header-container">
                <h1>Furniro</h1>
                <div className="navigation-container">
                <Link to={'/home'} className="home-link">
                    <p>Home</p>
                </Link>
                    <Link to={'/shop'} className="shop-link"><p>Shop</p></Link>
                    <a href="#">
                        <p>About</p>
                    </a>
                    <a href="#">
                        <p>Contact</p>
                    </a>
                </div>
                <div className="navigation-container-icons">
                <Link to={'/account'} className="user-icon"><i className="fa-regular fa-user"></i></Link>
                    <a href="#">
                        <i className="fa-solid fa-cart-shopping" />
                    </a>
                </div>
            </div>
            <div className="aside-container-cart">
                <div className="cart-container">
                    <h1>Cart</h1>
                    <p>
                        <b>Home &gt;</b> Cart
                    </p>
                </div>
            </div>
            <div className="main-container-cart">
                <table className="cart-table">
                    <tbody>
                        <tr>
                            <th>
                                <p>Product</p>
                            </th>
                            <th>
                                <p>Price</p>
                            </th>
                            <th>
                                <p>Quantity</p>
                            </th>
                            <th>
                                <p>Subtotal</p>
                            </th>
                        </tr>

                        {cart.map((product) => (
                            <CartProductCard
                                key={product.id}
                                product={product}
                                onDelete={handleProductDelete}
                                onQuantityUpdate={handleQuantityUpdate}
                            />
                        ))}
                    </tbody>
                </table>
                <div className="cart-total">
                    <h1>Cart Total</h1>
                    <div className="total-cart">
                        <p>Total</p>
                        <p className="total-price">${total}</p>
                    </div>
                    <button className="check-out-button" onClick={() =>navigate('/checkout')} disabled = {cart.length===0}>Check Out</button>
                </div>
            </div>
            <div className="info-container-cart">
                <div className="card-info">
                    <i className="fa-solid fa-trophy" />
                    <div className="text-section-info">
                        <p>High Quality</p>
                        <p className="description-text">crafted from top materials</p>
                    </div>
                </div>
                <div className="card-info">
                    <i className="fa-solid fa-check" />
                    <div className="text-section-info">
                        <p>Warranty Protection</p>
                        <p className="description-text">Over 2 years</p>
                    </div>
                </div>
                <div className="card-info">
                    <i className="fa-solid fa-truck-fast" />
                    <div className="text-section-info">
                        <p>Free Shipping</p>
                        <p className="description-text">Order over $150</p>
                    </div>
                </div>
                <div className="card-info">
                    <i className="fa-solid fa-headset" />
                    <div className="text-section-info">
                        <p>24 / 7 Support</p>
                        <p className="description-text">Dedicated support</p>
                    </div>
                </div>
            </div>
            <div className="footer-container">
                <hr width="100%" />
                <div className="footer-section">
                    <div className="address-section">
                        <h4>Furniro.</h4>
                        <p className="description">
                            400 University Drive Suite 200 Caral Gables <br />
                            FL 33134 USA
                        </p>
                    </div>
                    <div className="links-section">
                        <p className="description">Links</p>
                        <a href="">
                            <p>Home</p>
                        </a>
                        <a href="">
                            <p>Shop</p>
                        </a>
                        <a href="">
                            <p>About</p>
                        </a>
                        <a href="">
                            <p>Contact</p>
                        </a>
                    </div>
                    <div className="help-section">
                        <p className="description">Help</p>
                        <a href="">
                            <p>Payment Options</p>
                        </a>
                        <a href="">
                            <p>Returns</p>
                        </a>
                        <a href="">
                            <p>Privacy Policies</p>
                        </a>
                    </div>
                    <div className="newsletter-section">
                        <p className="description">Newsletter</p>
                        <input
                            type="email"
                            name="email"
                            id="newsletter-email"
                            placeholder="Enter your email address"
                        />
                        <button className="newsletter-button">SUBSCRIBE</button>
                    </div>
                </div>
                <hr width="80%" />
                <div className="end-section">
                    <p>2025 furino. All rights reserved</p>
                </div>
            </div>
        </>
    );
}