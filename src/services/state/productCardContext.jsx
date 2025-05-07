import { createContext, useState } from "react";

export const ProductCardContext = createContext();


export default function ProductCardProvider({children}){

    const [product, setProduct] = useState(null);

    const handleProductClick = ( newProduct) => {

        if(newProduct){
            setProduct(newProduct);
        }
        
    }



    const contextValue = {
        product,
        handleProductClick
    };


    
    
    return (
        <ProductCardContext.Provider value={contextValue}>
            {children}
        </ProductCardContext.Provider>
    );

}