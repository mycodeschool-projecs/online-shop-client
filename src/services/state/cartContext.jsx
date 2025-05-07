import { createContext, useState } from "react";

export const CartContext = createContext();

export default function CartProvider({children}){



    const [cart] = useState([]);


    
    const contextValue = {
        cart
    };

    return(
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );

}