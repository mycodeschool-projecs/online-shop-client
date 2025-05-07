import React, { useState, useEffect, useContext } from "react";
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
import { getAllUsers, updateUser, deleteUser } from "../../../services/api/userService";
import { Link } from 'react-router-dom';
import { usersContext } from "../../../services/state/userState";

export default function UsersPageAdmin() {
    const {user} = useContext(usersContext);
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [editFormData, setEditFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        phone: '',
        country: '',
        billingAddress: '',
        shippingAddress: '',
    });
    const [searchTerm, setSearchTerm] = useState("");

    const columns = [
        { id: "fullName", label: "Full Name", minWidth: 170 },
        { id: "email", label: "Email", minWidth: 170 },
        { id: "phone", label: "Phone", minWidth: 100 },
        { id: "country", label: "Country", minWidth: 100, align: "right" },
        { id: "actions", label: "Actions", minWidth: 100, align: "right" }
    ];

    const fetchUsers = async () => {
        try {
            let data = await getAllUsers();
            if (data && Array.isArray(data.body.list)) {
                setUsers(data.body.list);
                setFilteredUsers(data.body.list); 
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching users: ", err);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);

        
        const filtered = users.filter((user) =>
            user.email.toLowerCase().includes(term.toLowerCase())
        );
        setFilteredUsers(filtered);
    };

    const handleEditClick = (user) => {
        setSelectedUser(user);
        setEditFormData({
            fullName: user.fullName,
            email: user.email,
            phone: user.phone,
            country: user.country,
            billingAddress: user.billingAddress,
            shippingAddress: user.shippingAddress,
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
            await updateUser(selectedUser.id, editFormData, user.jwtToken);
            setOpenEditDialog(false);
            fetchUsers(); 
        } catch (err) {
            console.error("Error updating user: ", err);
        }
    };

    const handleDeleteClick = async (userId) => {
        try {
            await deleteUser(userId);
            fetchUsers(); 
        } catch (err) {
            console.error("Error deleting user: ", err);
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

            <div className="main-container-admin container-users-admin">
               
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    placeholder="Search by email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                <div className="users-container">
                    <h2>All Users</h2>
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
                                    {filteredUsers
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((user) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={user.id}>
                                                {columns.map((column) => {
                                                    if (column.id === "actions") {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleEditClick(user)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => handleDeleteClick(user.id)}
                                                                    style={{ marginLeft: '10px' }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        );
                                                    }
                                                    const value = user[column.id];
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

            <Dialog open={openEditDialog} onClose={() => setOpenEditDialog(false)}>
                <DialogTitle>Edit User</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="fullName"
                        label="Full Name"
                        type="text"
                        fullWidth
                        value={editFormData.fullName}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="email"
                        label="Email"
                        type="email"
                        fullWidth
                        value={editFormData.email}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="phone"
                        label="Phone"
                        type="text"
                        fullWidth
                        value={editFormData.phone}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="country"
                        label="Country"
                        type="text"
                        fullWidth
                        value={editFormData.country}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="billingAddress"
                        label="Billing Address"
                        type="text"
                        fullWidth
                        value={editFormData.billingAddress}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="shippingAddress"
                        label="Shipping Address"
                        type="text"
                        fullWidth
                        value={editFormData.shippingAddress}
                        onChange={handleEditFormChange}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditFormSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}