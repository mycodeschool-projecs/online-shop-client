import { useEffect, useState } from "react";
import CheckoutProduct from "./CheckoutProduct";
import { useNavigate, Link } from 'react-router-dom';
import { addOrder } from "../../../services/api/orderService";
import { clearUserCart, getCart } from "../../../services/api/cartService";

export default function Checkout(){

    const [cart, setCart] = useState([]);
    const [total, setTotal] = useState(0);
    const [orderPlaced, setOrderPlaced] = useState(false);

    const navigate = useNavigate();


    const fetchUserCart = async () => {
        let data = await getCart();
        if (data.success) {
            setCart(data.body.list);
        }
    };
    
    useEffect(() => {
        fetchUserCart();
    }, []);

    const calculateTotal = () => {
        const newTotal = cart.reduce((sum, product) => {
            return sum + product.price * product.quantity;
        }, 0);
        setTotal(newTotal);
    };
    useEffect(() => {
        calculateTotal();
    }, [cart]);

    const calculateSubtotal = (product) => {
        return (product.price * product.quantity).toFixed(2);
    };


    const placeOrder = async () => {

        setOrderPlaced(false);
        const currentDate = new Date().toISOString().split("T")[0];
        
        const productList = cart.map(item => ({
            productName: item.name,
            productId: item.productId,
            quantity: item.quantity
        }));

        const orderRequest = {
            orderDate: currentDate,
            productList: productList
        };

        let data = await addOrder(orderRequest);

        if (data.success) {
            setOrderPlaced(true);
            await clearUserCart();
        } else {
            setOrderPlaced(false);
        }
    };
    return (
        <>
            {orderPlaced ? (
                <div className="order-success-container">
                    <h2>Your order has been placed successfully!</h2>
                    <p>Thank you for shopping with us.</p>
                    <button className="back-to-home-button" onClick={() => navigate('/home')}>
                        Return to Home
                    </button>
                </div>
            ) : (
                <>
                    
                    <div className="header-container">
                        <h1>Furniro</h1>
                        <div className="navigation-container">
                            <Link to={'/home'} className="home-link">
                                <p>Home</p>
                            </Link>
                            <Link to={'/shop'} className="shop-link"><p>Shop</p></Link>
                            <a href="#"><p>About</p></a>
                            <a href="#"><p>Contact</p></a>
                        </div>
                        <div className="navigation-container-icons">
                            <Link to={'/account'} className="user-icon"><i className="fa-regular fa-user"></i></Link>
                            <Link to={'/cart'} className="shopping-cart-icon"><i className="fa-solid fa-cart-shopping"></i></Link>
                        </div>
                    </div>
                    
                    <div className="aside-container-checkout">
                        <div className="cart-container">
                            <h1>Checkout</h1>
                            <p><b>Home &gt;</b> Checkout</p>
                        </div>
                    </div>
                    
                    <div className="main-container-checkout">
                        <div className="total-container">
                            <div className="total-checkout">
                                <div className="products-checkout">
                                    <p>Product</p>
                                    <div className="product-name">
                                        {cart.map((product) => (
                                            <CheckoutProduct key={product.id} product={product} />
                                        ))}
                                    </div>
                                    <p>Total</p>
                                </div>
                                <div className="subtotal-checkout">
                                    <p>Subtotal</p>
                                    <div className="subtotal-section">
                                        {cart.map((product) => (
                                            <p key={product.id}>
                                                ${calculateSubtotal(product)}
                                            </p>
                                        ))}
                                    </div>
                                    <div className="total-text">${total}</div>
                                </div>
                            </div>
                            <hr className="line-checkout" />
                            <div className="payment-method">
                                <div className="credit-card">
                                    <input type="radio" name="paymentMethod" id="card-payment" />
                                    <label htmlFor="card-payment"> Credit Card</label>
                                </div>
                                <div className="cash-on-delivery">
                                    <input type="radio" name="paymentMethod" id="cash-on-delivery" />
                                    <label htmlFor="cash-on-delivery"> Cash on Delivery</label>
                                </div>
                            </div>
                            <p className="privacy-text">
                                Your personal data will be used to support your experience throughout this website, to manage access to your account, and for other purposes described in our <b>privacy policy</b>.
                            </p>
                            <div className="button-container">
                                <button className="add-to-cart-product-page-button place-order-button" onClick={placeOrder}>
                                    Place order
                                </button>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    );
    


}