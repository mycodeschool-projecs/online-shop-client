import { useContext, useEffect } from "react";
import { usersContext } from "../../services/state/userState";
import { useNavigate, Link } from 'react-router-dom';
import { Alert } from 'antd';
import { useForm } from "react-hook-form";


export default function Login() {
    const navigate = useNavigate();
    const { handleLogin, errors:loginErrors, setErrors,  user } = useContext(usersContext); 

    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();



    const onSubmit = async (data) => {


        const req = await handleLogin(data);

        if (req.success) {
            if(req.role==='ADMIN'){
                navigate('/admin-page');
            }else{
                navigate('/home');
            }

        }
    };

   
    useEffect(() => {
        return () => {
            setErrors([]); 
        };
    }, [setErrors]); 

    return (
        <>
            {loginErrors.length > 0 && (
                <Alert 
                    className="alert-container-login"
                    message="Error"
                    description={loginErrors.join(", ")}
                    type="error"
                    showIcon
                    closable
                />
            )}  
            <div className="login-page">
                <div>
                    <form className="login-container" onSubmit={handleSubmit(onSubmit)}>
                        <h1>Log in</h1>
                        <input
                            placeholder="Your email here"
                            type="email"
                            {...register("email", {
                              required: "Email is required",
                              pattern: {
                                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                message: "Invalid email address",
                              },
                            })}
                        />
                        {errors.email && <p className="error">{errors.email.message}</p>}
                        <input
                            placeholder="Your password here"
                           type="password"
                           {...register    ("password", {
                             required: "Password is required",
                             minLength: {
                               value: 3,
                               message: "Password must be at least 6 characters",
                             },
                           })}
                        />
                         {errors.password && <p className="error">{errors.password.message}</p>}

                        <p>Don't have an account? <Link to={"/register"} className="register-link">Register here</Link></p>
                        <button className="login-button" type="submit">
                            Log in
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}