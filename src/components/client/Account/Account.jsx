import { useState, useContext, useEffect } from "react";
import { usersContext } from "../../../services/state/userState";
import { getAllCustomerOrders } from "../../../services/api/orderService";
import { getById, updateUser } from "../../../services/api/userService";
import OrderCard from "../OrderCard/OrderCard";
import { Alert } from "antd";
import { useNavigate, Link } from 'react-router-dom';

export default function Account() {
    const { user: contextUser } = useContext(usersContext);
    const [user, setUser] = useState(contextUser);
    const [orders, setOrders] = useState([]);
    const [activeSection, setActiveSection] = useState("account");
    const [isModified, setIsModified] = useState(false);
    const [updatedUser, setUpdatedUser] = useState({});
    const [showAlert, setShowAlert] = useState(false);
    const [alertMessage, setAlertMessage] = useState("");

    const fetchUserDetails = async () => {
        const response = await getById(contextUser.id);
        if (response.success) {
            setUser(response.body);
            setUpdatedUser(response.body);
        }
    };

    const fetchOrders = async () => {
        const response = await getAllCustomerOrders();
        if (response.success) {
            setOrders(response.body.list);
        }
    };

    useEffect(() => {
        fetchUserDetails();
        fetchOrders();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setUpdatedUser((prev) => ({ ...prev, [name]: value }));
        setIsModified(true);
    };

    const handleSaveChanges = async () => {
        const updateRequest = {
            fullName: updatedUser.fullName,
            email: updatedUser.email,
            phone: updatedUser.phone,
            country: updatedUser.country,
            billingAddress: updatedUser.billing,
            shippingAddress: updatedUser.shipping,
        };

        const response = await updateUser(user.id, updateRequest);
        if (response.success) {
            setUser(updatedUser);
            setIsModified(false);
            setAlertMessage("Changes saved successfully!");
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        } else {
            setAlertMessage(`Failed to save changes: ${response.message}`);
            setShowAlert(true);
            setTimeout(() => {
                setShowAlert(false);
            }, 3000);
        }
    };

    const handleSectionChange = (section) => {
        setActiveSection(section);
    };

    const handleOrderCancelled = (cancelledOrderId) => {
        setOrders((prevOrders) =>
            prevOrders.map((order) =>
                order.id === cancelledOrderId
                    ? { ...order, orderStatus: "CANCELLED" }
                    : order
            )
        );
    };

    return (
        <>
            {showAlert && (
                <Alert
                    className="alert-container-login"
                    message={alertMessage}
                    type={alertMessage.includes("successfully") ? "success" : "error"}
                    showIcon
                    closable
                    onClose={() => setShowAlert(false)}
                />
            )}

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
                    <a href="#" className="user-icon">
                        <i className="fa-regular fa-user" />
                    </a>
                    <Link to={'/cart'} className="shopping-cart-icon"><i className="fa-solid fa-cart-shopping"></i></Link>
                </div>
            </div>
            <div className="aside-container-cart">
                <div className="cart-container">
                    <h1>Account</h1>
                    <p>
                        <b>Home &gt;</b> Account
                    </p>
                </div>
            </div>
            <div className="main-container-account">
                <div className="left-side-buttons">
                    <button
                        className="my-account-button"
                        disabled={activeSection === "account"}
                        onClick={() => handleSectionChange("account")}
                    >
                        My account
                    </button>
                    <button
                        className="my-orders-button"
                        disabled={activeSection === "orders"}
                        onClick={() => handleSectionChange("orders")}
                    >
                        My orders
                    </button>
                </div>
                <div className="right-side-info">
                    {activeSection === "account" ? (
                        <>
                            <div className="email-input">
                                <p>Email:</p>
                                <input
                                    type="email"
                                    name="email"
                                    id="email-register"
                                    value={updatedUser.email || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="name-input">
                                <p>Full name:</p>
                                <input
                                    type="text"
                                    name="fullName"
                                    id="name-register"
                                    value={updatedUser.fullName || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="phone-input">
                                <p>Phone:</p>
                                <input
                                    type="number"
                                    name="phone"
                                    id="phone-register"
                                    value={updatedUser.phone || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="country-input">
                                <p>Country:</p>
                                <input
                                    type="text"
                                    name="country"
                                    id="country-register"
                                    value={updatedUser.country || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="billing-input">
                                <p>Billing address:</p>
                                <input
                                    type="text"
                                    name="billing"
                                    id="billing-register"
                                    value={updatedUser.billing || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <div className="shipping-input">
                                <p>Shipping address:</p>
                                <input
                                    type="text"
                                    name="shipping"
                                    id="shipping-register"
                                    value={updatedUser.shipping || ""}
                                    onChange={handleInputChange}
                                />
                            </div>
                            {isModified && (
                                <button className="save-changes-button" onClick={handleSaveChanges}>
                                    Save Changes
                                </button>
                            )}
                        </>
                    ) : (
                        <div className="orders-container">
                            {orders.length > 0 ? (
                                orders.map((order) => (
                                    <OrderCard
                                        key={order.id}
                                        order={order}
                                        onOrderCancelled={handleOrderCancelled}
                                    />
                                ))
                            ) : (
                                <p>No orders found.</p>
                            )}
                        </div>
                    )}
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