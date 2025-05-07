import { useContext, useState, useEffect } from "react";
import { usersContext } from "../../services/state/userState";
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'antd';
import { useForm } from "react-hook-form";

export default function Register() {
    const {
        register,
        handleSubmit,
        reset,
        formState: { errors },
    } = useForm();

    const navigate = useNavigate();
    const { handleRegister, errors: registerErrors, setErrors } = useContext(usersContext);
    const [registered, setRegistered] = useState(false);

    const onSubmit = async (data) => {
        const success = await handleRegister(data);
        if (success) {
            setRegistered(true);
            navigate("/");
            reset();
        }
    };

    useEffect(() => {
        return () => {
            setErrors([]);
        };
    }, [setErrors]);

    return (
        <>
            {registerErrors.length > 0 && (
                <Alert
                    className="alert-container-login"
                    message="Error"
                    description={registerErrors.join(", ")}
                    type="error"
                    showIcon
                    closable
                />
            )}
            {registered && (
                <Alert
                    className="alert-container-login"
                    message="Success"
                    description="Registered successfully, login to continue"
                    type="success"
                    showIcon
                    closable
                />
            )}

            <div className="register-page">
                <div>
                    <form className="register-container" onSubmit={handleSubmit(onSubmit)}>
                        <h1>Register</h1>

                        <div className="email-input">
                            <p>Email:</p>
                            <input
                                type="email"
                                name="email"
                                id="email-register"
                                placeholder="Your email here"
                                {...register("email", {
                                    required: "Email is required",
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: "Invalid email address",
                                    },
                                })}
                            />
                            {errors.email && <p className="error">{errors.email.message}</p>}
                        </div>

                        <div className="password-input">
                            <p>Password:</p>
                            <input
                                type="password"
                                name="password"
                                id="password-register"
                                placeholder="Your password here"
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: {
                                        value: 3,
                                        message: "Password must be at least 6 characters",
                                    },
                                })}
                            />
                            {errors.password && <p className="error">{errors.password.message}</p>}
                        </div>

                        <div className="name-input">
                            <p>Full name:</p>
                            <input
                                type="text"
                                name="fullName"
                                id="name-register"
                                placeholder="Your full name here"
                                {...register("fullName", { required: "Full name is required" })}
                            />
                            {errors.fullName && <p className="error">{errors.fullName.message}</p>}
                        </div>

                        <div className="phone-input">
                            <p>Phone:</p>
                            <input
                                type="number"
                                name="phone"
                                id="phone-register"
                                placeholder="Your phone number here"
                                {...register("phone", { required: "Phone is required" })}
                            />
                            {errors.phone && <p className="error">{errors.phone.message}</p>}
                        </div>

                        <div className="country-input">
                            <p>Country:</p>
                            <input
                                type="text"
                                name="country"
                                id="country-register"
                                placeholder="Your country here"
                                {...register("country", { required: "Country is required" })}
                            />
                            {errors.country && <p className="error">{errors.country.message}</p>}
                        </div>

                        <div className="billing-input">
                            <p>Billing address:</p>
                            <input
                                type="text"
                                name="billingAddress"
                                id="billing-register"
                                placeholder="Your billing address here"
                                {...register("billingAddress", { required: "Billing address is required" })}
                            />
                            {errors.billingAddress && <p className="error">{errors.billingAddress.message}</p>}
                        </div>

                        <div className="shipping-input">
                            <p>Shipping address:</p>
                            <input
                                type="text"
                                name="shippingAddress"
                                id="shipping-register"
                                placeholder="Your shipping address here"
                                {...register("shippingAddress", { required: "Shipping address is required" })}
                            />
                            {errors.shippingAddress && <p className="error">{errors.shippingAddress.message}</p>}
                        </div>
                        <div className="role-input">
                            <p>User role:</p>
                            <select
                                name="userRole"
                                id="role-select"
                                {...register("userRole", { required: "User role is required" })}
                            >
                                <option value="">Select a role</option>
                                <option value="CLIENT">CLIENT</option>
                                <option value="ADMIN">ADMIN</option>
                            </select>
                            {errors.role && <p className="error">{errors.role.message}</p>}
                        </div>

                        <p>
                            Already have an account?{" "}
                            <Link to="/login" className="login-link">
                                Log in here
                            </Link>
                        </p>
                        <button className="register-button" type="submit">
                            Register
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}
