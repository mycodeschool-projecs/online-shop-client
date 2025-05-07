import React, { useState, useEffect } from "react";
import {
    getAllCategories,
    addCategory,
    addSubcategory,
    updateCategory,
    deleteCategory,
} from "../../../services/api/categoryService";
import { Link } from 'react-router-dom';
import {
    Button,
    TextField,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    MenuItem,
    Select,
    InputLabel,
    FormControl,
    Paper,
    TableContainer,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
} from '@mui/material';

export default function CategoriesPage() {
    const [categories, setCategories] = useState([]);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categoryForm, setCategoryForm] = useState({ name: "", parentId: null });
    const [searchTerm, setSearchTerm] = useState("");

    const fetchCategories = async () => {
        try {
            let data = await getAllCategories();
            if (data && Array.isArray(data.body.list)) {
                setCategories(data.body.list);
                setFilteredCategories(data.body.list);
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
        const filtered = categories.filter((category) =>
            category.name.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredCategories(filtered);
    };

    const handleAddCategory = async () => {
        try {
            let response;
            if (categoryForm.parentId) {
            
                response = await addSubcategory(categoryForm.parentId, { name: categoryForm.name });
            } else {
                
                response = await addCategory({ name: categoryForm.name });
            }

            if (response.success) {
                const newCategory = response.body;
                setCategories([...categories, newCategory]);
                setFilteredCategories([...filteredCategories, newCategory]);
                setOpenDialog(false);
                setCategoryForm({ name: "", parentId: null });
            }
        } catch (err) {
            console.error("Error adding category: ", err);
        }
    };

    const handleEditCategory = async () => {
        try {
            const response = await updateCategory(selectedCategory.id, categoryForm);
            if (response.success) {
                const updatedCategory = response.body;
                const updatedCategories = categories.map((category) =>
                    category.id === selectedCategory.id ? updatedCategory : category
                );
                setCategories(updatedCategories);
                setFilteredCategories(updatedCategories);
                setOpenDialog(false);
                setCategoryForm({ name: "", parentId: null });
            }
        } catch (err) {
            console.error("Error updating category: ", err);
        }
    };

    const handleDeleteCategory = async (categoryId) => {
        try {
            const response = await deleteCategory(categoryId);
            if (response.success) {
                const updatedCategories = categories.filter((category) => category.id !== categoryId);
                setCategories(updatedCategories);
                setFilteredCategories(updatedCategories);
            }
        } catch (err) {
            console.error("Error deleting category: ", err);
        }
    };

    const handleOpenDialog = (category = null) => {
        if (category) {
            setEditMode(true);
            setSelectedCategory(category);
            setCategoryForm({ name: category.name, parentId: category.parent ? category.parent.id : null });
        } else {
            setEditMode(false);
            setCategoryForm({ name: "", parentId: null });
        }
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setCategoryForm({ name: "", parentId: null });
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    return (
        <>
            <div className="header-container">
                <h1><Link to={'/admin-page'}>Furniro</Link></h1>
                <div className="navigation-container admin-container-nav">
                    <Link to={'/product-page-admin'}>Products</Link>
                    <Link to={'/order-page-admin'}>Orders</Link>
                    <Link to={'/user-page-admin'}>User</Link>
                    <Link to={'/category-page-admin'}>Category</Link>
                </div>
            </div>

            <div className="main-container-admin container-categories-admin-page">
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    placeholder="Search by category name..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                <div className="categories-container-admin">
                    <h2>All Categories</h2>
                    <Button variant="contained" color="primary" onClick={() => handleOpenDialog()}>
                        Add Category
                    </Button>
                    <Paper sx={{ width: "60%", overflow: "hidden", marginTop: "20px" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="sticky table">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Name</TableCell>
                                        <TableCell>Parent</TableCell>
                                        <TableCell>Actions</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {filteredCategories.map((category) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={category.id}>
                                            <TableCell>{category.name}</TableCell>
                                            <TableCell>{category.parent ? category.parent.name : "None"}</TableCell>
                                            <TableCell>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleOpenDialog(category)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleDeleteCategory(category.id)}
                                                    style={{ marginLeft: '10px' }}
                                                >
                                                    Delete
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    </Paper>
                </div>
            </div>

            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogTitle>{editMode ? "Edit Category" : "Add Category"}</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Category Name"
                        type="text"
                        fullWidth
                        value={categoryForm.name}
                        onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                    />
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Parent Category</InputLabel>
                        <Select
                            value={categoryForm.parentId || ""}
                            onChange={(e) => setCategoryForm({ ...categoryForm, parentId: e.target.value })}
                            label="Parent Category"
                        >
                            <MenuItem value={null}>None</MenuItem>
                            {categories.map((category) => (
                                <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button onClick={editMode ? handleEditCategory : handleAddCategory}>
                        {editMode ? "Save" : "Add"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}