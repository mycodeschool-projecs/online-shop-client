import { useState, useEffect, useContext } from "react";
import ProductCard from "../ProductCard/ProductCard";
import { getAllProducts } from "../../../services/api/productsService";
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import { SimpleTreeView } from '@mui/x-tree-view/SimpleTreeView';
import { TreeItem } from '@mui/x-tree-view/TreeItem';
import { usersContext } from "../../../services/state/userState";
import { getAllCategories } from "../../../services/api/categoryService";

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const { user } = useContext(usersContext);

    const fetchProducts = async () => {
        try {
            let data = await getAllProducts();
            if (data && Array.isArray(data.body.list)) {
                setProducts(data.body.list);
                setFilteredProducts(data.body.list);
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching products: ", err);
        }
    };

    const fetchCategories = async () => {
        try {
            let data = await getAllCategories();
            if (data && Array.isArray(data.body.list)) {
                setCategories(data.body.list);
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching categories: ", err);
        }
    };

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        if (term.trim() === "") {
            setSuggestions([]);
        } else {
            const filteredSuggestions = products.filter((product) =>
                product.name.toLowerCase().includes(term.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        }
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (suggestion) => {
        setSearchTerm(suggestion.name);
        setShowSuggestions(false);
    };

    const handleSearch = () => {
        if (searchTerm.trim() !== "") {
            const filtered = products.filter((product) =>
                product.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts(products);
        }
        setShowSuggestions(false);
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const handleItemSelectionToggle = (event, itemId, isSelected) => {
        if (isSelected) {
            setSelectedCategory(itemId);
    
            if (itemId === "grid") {
                setFilteredProducts(products);
            } else {
                
                const selectedCategoryObj = categories.find(category => category.id.toString() === itemId);
                if (!selectedCategoryObj) {
                    console.error("Category not found for ID:", itemId);
                    return;
                }
    
                const selectedCategoryName = selectedCategoryObj.name.toLowerCase();
                console.log("Filtering by Category Name:", selectedCategoryName);
    
               
                const filtered = products.filter((product) => {
                    const productCategory = product.category.toLowerCase();
                    const productName = product.name.toLowerCase();
    
                    
                    return productCategory === selectedCategoryName || productName.includes(selectedCategoryName);
                });
    
                console.log("Filtered Products:", filtered);
                setFilteredProducts(filtered);
            }
        }
    };
    
    
    

    const buildTree = (categories, parentId = null) => {
        return categories
            .filter((category) => (category.parent ? category.parent.id : null) === parentId)
            .map((category) => (
                <TreeItem key={category.id} itemId={category.id.toString()} label={category.name}>
                    {buildTree(categories, category.id)}
                </TreeItem>
            ));
    };
    

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, []);


    return (
        <>
            <div className="header-container">
                <h1>Furniro</h1>
                <div className="navigation-container">
                    <Link to={'/home'} className="home-link">
                        <p>Home</p>
                    </Link>
                    <a href="#">
                        <p>Shop</p>
                    </a>
                    <a href="#">
                        <p>About</p>
                    </a>
                    <a href="#">
                        <p>Contact</p>
                    </a>
                </div>
                <div className="navigation-container-icons">
                    <Link to={'/account'} className="user-icon"><i className="fa-regular fa-user"></i></Link>
                    <Link to={'/cart'} className="shopping-cart-icon"><i className="fa-solid fa-cart-shopping"></i></Link>
                </div>
            </div>
            <div className="aside-container-shop">
                <div className="shop-container">
                    <h1>Shop</h1>
                    <p>
                        <b>Home &gt;</b> Shop
                    </p>
                </div>
            </div>
            <div className="search-container-container">
                <div className="tree-view">
                    <Box sx={{ minHeight: 150, minWidth: 250 }}>
                        <SimpleTreeView onItemSelectionToggle={handleItemSelectionToggle}>
                            <TreeItem itemId="grid" label="Categories">
                                {categories.length > 0 ? buildTree(categories) : <p>Loading categories...</p>}
                            </TreeItem>
                        </SimpleTreeView>
                    </Box>
                </div>

                <div className="search-bar">
                    <input
                        className="input-field"
                        placeholder="Search a product by its name"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyPress}
                    />
                    {showSuggestions && suggestions.length > 0 && (
                        <div className="suggestions-dropdown">
                            {suggestions.map((suggestion) => (
                                <div
                                    key={suggestion.id}
                                    className="suggestion-item"
                                    onClick={() => handleSuggestionClick(suggestion)}
                                >
                                    {suggestion.name}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
            <div className="products-container-shop">
                <div className="card-section">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
                <div className="pages-section">
                    <button className="page-btn active">1</button>
                    <button className="page-btn">2</button>
                    <button className="page-btn">3</button>
                    <button className="page-btn next-btn">Next</button>
                </div>
            </div>
            <div className="info-container-cart-shop">
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