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
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { getAllOrders, updateOrder, deleteOrder } from "../../../services/api/orderService";
import { Link } from 'react-router-dom';
import { usersContext } from "../../../services/state/userState";

export default function OrdersPageAdmin() {
    const {user} = useContext(usersContext);
    const [orders, setOrders] = useState([]);
    const [filteredOrders, setFilteredOrders] = useState([]); 
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [openEditDialog, setOpenEditDialog] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [editFormData, setEditFormData] = useState({
        orderEmail: '',
        shippingAddress: '',
        orderAddress: '',
        amount: 0,
        orderStatus: '',
    });
    const [searchTerm, setSearchTerm] = useState(""); 
    const [statusFilter, setStatusFilter] = useState("all"); 

    const statusOptions = ["all", "SHIPPING", "PREPARING", "COMPLETED", "CANCELLED"]; 

    const columns = [
        { id: "orderEmail", label: "User Email", minWidth: 170 },
        { id: "shippingAddress", label: "Shipping Address", minWidth: 170 },
        { id: "orderDate", label: "Order Date", minWidth: 100 },
        { id: "amount", label: "Amount ($)", minWidth: 100, align: "right" },
        { id: "orderStatus", label: "Order Status", minWidth: 100, align: "right" },
        { id: "actions", label: "Actions", minWidth: 100, align: "right" }
    ];

    const fetchOrders = async () => {
        try {
            let data = await getAllOrders();
            if (data && Array.isArray(data.body.list)) {
                setOrders(data.body.list);
                setFilteredOrders(data.body.list); 
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching orders: ", err);
        }
    };

    useEffect(() => {
        fetchOrders();
    }, []);

    
    const handleSearchChange = (event) => {
        const term = event.target.value;
        setSearchTerm(term);
        applyFilters(term, statusFilter); 
    };

 
    const handleStatusFilterChange = (event) => {
        const status = event.target.value;
        setStatusFilter(status);
        applyFilters(searchTerm, status); 
    };

    
    const applyFilters = (searchTerm, statusFilter) => {
        let filtered = orders;

       
        if (searchTerm) {
            filtered = filtered.filter((order) =>
                order.orderEmail.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

       
        if (statusFilter !== "all") {
            filtered = filtered.filter((order) =>
                order.orderStatus === statusFilter
            );
        }

        setFilteredOrders(filtered);
    };

    
    const handleEditClick = (order) => {
        setSelectedOrder(order);
        setEditFormData({
            orderEmail: order.orderEmail,
            shippingAddress: order.shippingAddress,
            orderAddress: order.orderAddress,
            amount: order.amount,
            orderStatus: order.orderStatus,
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
            await updateOrder(selectedOrder.id, editFormData);
            setOpenEditDialog(false);
            fetchOrders(); 
        } catch (err) {
            console.error("Error updating order: ", err);
        }
    };

    
    const handleDeleteClick = async (orderId) => {
        try {
            await deleteOrder(orderId);
            fetchOrders(); 
        } catch (err) {
            console.error("Error deleting order: ", err);
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

            <div className="main-container-admin container-orders-admin-page">
               
                <TextField
                    fullWidth
                    margin="normal"
                    variant="outlined"
                    placeholder="Search by user email..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />

                
                <FormControl fullWidth margin="normal">
                    <InputLabel>Filter by Status</InputLabel>
                    <Select
                        value={statusFilter}
                        onChange={handleStatusFilterChange}
                        label="Filter by Status"
                    >
                        {statusOptions.map((status) => (
                            <MenuItem key={status} value={status}>
                                {status === "all" ? "All" : status}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <div className="orders-container-admin">
                    <h2>All Orders</h2>
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
                                    {filteredOrders
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((order) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={order.id}>
                                                {columns.map((column) => {
                                                    if (column.id === "actions") {
                                                        return (
                                                            <TableCell key={column.id} align={column.align}>
                                                                <Button
                                                                    variant="contained"
                                                                    color="primary"
                                                                    onClick={() => handleEditClick(order)}
                                                                >
                                                                    Edit
                                                                </Button>
                                                                <Button
                                                                    variant="contained"
                                                                    color="secondary"
                                                                    onClick={() => handleDeleteClick(order.id)}
                                                                    style={{ marginLeft: '10px' }}
                                                                >
                                                                    Delete
                                                                </Button>
                                                            </TableCell>
                                                        );
                                                    }
                                                    const value = order[column.id];
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
                <DialogTitle>Edit Order</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        name="orderEmail"
                        label="User Email"
                        type="email"
                        fullWidth
                        value={editFormData.orderEmail}
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
                    <TextField
                        margin="dense"
                        name="orderAddress"
                        label="Order Address"
                        type="text"
                        fullWidth
                        value={editFormData.orderAddress}
                        onChange={handleEditFormChange}
                    />
                    <TextField
                        margin="dense"
                        name="amount"
                        label="Amount"
                        type="number"
                        fullWidth
                        value={editFormData.amount}
                        onChange={handleEditFormChange}
                    />
                    <FormControl fullWidth margin="dense">
                        <InputLabel>Order Status</InputLabel>
                        <Select
                            name="orderStatus"
                            value={editFormData.orderStatus}
                            onChange={handleEditFormChange}
                            label="Order Status"
                        >
                            {statusOptions
                                .filter((status) => status !== "all")
                                .map((status) => (
                                    <MenuItem key={status} value={status}>
                                        {status}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenEditDialog(false)}>Cancel</Button>
                    <Button onClick={handleEditFormSubmit}>Save</Button>
                </DialogActions>
            </Dialog>
        </>
    );
}