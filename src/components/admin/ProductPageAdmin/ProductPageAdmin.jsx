import React, { useState, useEffect } from "react";
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { getAllProducts, updateProduct, deleteProduct, addProduct } from "../../../services/api/productsService";
import { getAllCategories } from "../../../services/api/categoryService";
import { Link } from 'react-router-dom';
import { usersContext } from "../../../services/state/userState";

export default function ProductPageAdmin() {


    const {user} = useState(usersContext);
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [openAddDialog, setOpenAddDialog] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [editFormData, setEditFormData] = useState({
        category: '',
        description: '',
        name: '',
        price: '',
        stock: 0,
        weight: 0,
    });
    const [addFormData, setAddFormData] = useState({
        category: '',
        description: '',
        name: '',
        price: '',
        stock: 0,
        weight: 0,
    });
    const [categories, setCategories] = useState([]); 
    const [searchTerm, setSearchTerm] = useState("");

    const columns = [
        { id: "name", label: "Product Name", minWidth: 170 },
        { id: "category", label: "Category", minWidth: 100 },
        { id: "price", label: "Price ($)", minWidth: 100, align: "right" },
        { id: "stock", label: "Stock", minWidth: 100, align: "right" },
        { id: "actions", label: "Actions", minWidth: 100, align: "right" }
    ];

   
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

    useEffect(() => {
        fetchProducts();
        fetchCategories(); 
    }, []);

    
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

       
        const filtered = products.filter((product) =>
            product.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredProducts(filtered);
    };

    
    const handleEditClick = (product) => {
        setSelectedProduct(product);
        setEditFormData({
            category: product.category,
            description: product.description,
            name: product.name,
            price: product.price,
            stock: product.stock,
            weight: product.weight
        });
        setOpenEditDialog(true);
    };

   
    const handleEditFormChange = (event) => {
        const { name, value } = event.target;
        setEditFormData({
            ...editFormData,
            [name]: value
        });
    };

    
    const handleEditFormSubmit = async () => {
        try {
            await updateProduct(selectedProduct.id, editFormData);
            setOpenEditDialog(false);
            fetchProducts(); 
        } catch (err) {
            console.error("Error updating product: ", err);
        }
    };


    const handleDeleteClick = async (productId) => {
        try {
            await deleteProduct(productId);
            fetchProducts(); 
        } catch (err) {
            console.error("Error deleting product: ", err);
        }
    };

    
    const handleAddClick = () => {
        setOpenAddDialog(true);
    };

    
    const handleAddFormChange = (event) => {
        const { name, value } = event.target;
        setAddFormData({
            ...addFormData,
            [name]: value
        });
    };

    
    const handleAddFormSubmit = async () => {
        try {
            await addProduct(addFormData); 
            setOpenAddDialog(false);
            fetchProducts(); 
            setAddFormData({ 
                category: '',
                description: '',
                name: '',
                price: '',
                stock: 0,
                weight: 0,
            });
        } catch (err) {
            console.error("Error adding product: ", err);
        }
    };

    return (
        <>
            <div className="header-container">
            <h1>  <Link to={'/admin-page'}>Furniro</Link></h1>
                <div className="navigation-container admin-container-nav">
                    <Link to={'/product-page-admin'}>Products</Link>
                    <Link to={'/order-page-admin'}>Orders</Link>
                    <Link to={'/user-page-admin'}>User</Link>
                    <Link to={'/category-page-admin'}>Category</Link>
                </div>
            </div>

            <div className="main-container-admin container-products-admin">
               
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    placeholder="Search by product name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

               
                <Button
                    variant="contained"
                    color="primary"
                    onClick={handleAddClick}
                    style={{ marginBottom: '20px' }}
                >
                    Add Product
                </Button>

                <div className="products-container-admin">
                    <h2>All Products</h2>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        {columns.map((column) => (
                                            <TableCell
                                                key={column.id}
                                                align={column.align}
                                                style={{ minWidth: column.minWidth }}
                                            >
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredProducts
                                        
                                        .map((product) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                                                {columns.map((column) => {
                                                    if (column.id === "actions") {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleEditClick(product)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => handleDeleteClick(product.id)}
                                                                    style={{ marginLeft: '10px' }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        );
                                                    }
                                                    const value = product[column.id];
                                                    return (
                                                        <TableCell key={column.id} align={column.align}>
                                                            {value}
                                                        </TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)} className="dialog">
                <DialogTitle>Edit Product</DialogTitle>
                
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        label="Product Name"
                        type="text"
                        fullWidth
                        value={editFormData.name}
                        onChange={handleEditFormChange}
                    />
                    
                    <TextField
                        margin="dense"
                        name="description"
                        label="Product Description"
                        type="text"
                        fullWidth
                        value={editFormData.description}
                        onChange={handleEditFormChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={editFormData.category}
                            onChange={handleEditFormChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <TextField
                        margin="dense"
                        name="price"
                        label="Price"
                        type="number"
                        fullWidth
                        value={editFormData.price}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="stock"
                        label="Stock"
                        type="number"
                        fullWidth
                        value={editFormData.stock}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="weight"
                        label="Weight"
                        type="number"
                        fullWidth
                        value={editFormData.weight}
                        onChange={handleEditFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditFormSubmit}>Save</Button>
                </DialogActions>
            </Dialog>

            
            <Dialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} className="dialog">
                <DialogTitle>Add Product</DialogTitle>
                <DialogContent>
                    <p>Product Name:</p>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="name"
                        type="text"
                        fullWidth
                        value={addFormData.name}
                        onChange={handleAddFormChange}
                    />
                      <p>Product Description:</p>
                    <TextField
                        margin="dense"
                        name="description"
                        type="text"
                        fullWidth
                        value={addFormData.description}
                        onChange={handleAddFormChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Category</InputLabel>
                        <Select
                            name="category"
                            value={addFormData.category}
                            onChange={handleAddFormChange}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.name}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <p>Price:</p>
                    <TextField
                        margin="dense"
                        name="price"
                        type="number"
                        fullWidth
                        value={addFormData.price}
                        onChange={handleAddFormChange}
                    />
                      <p>Stock:</p>
                    <TextField
                        margin="dense"
                        name="stock"
                        
                        type="number"
                        fullWidth
                        value={addFormData.stock}
                        onChange={handleAddFormChange}
                    />

                    <p>Weight:</p>      
                    <TextField
                        margin="dense"
                        name="weight"
                        type="number"
                        fullWidth
                        value={addFormData.weight}
                        onChange={handleAddFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenAddDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddFormSubmit}>Add</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}