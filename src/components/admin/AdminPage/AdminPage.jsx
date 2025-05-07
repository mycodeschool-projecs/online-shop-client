import React, { useState, useEffect, useContext } from "react";
import { usersContext } from "../../../services/state/userState";
import { PieChart, LineChart } from '@mui/x-charts'; 
import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { getRecentOrders, totalOrders, totalRevenue, monthly } from "../../../services/api/orderService"; 
import { totalProducts } from "../../../services/api/productsService";
import { totalUsers } from "../../../services/api/userService";
import { mostSold } from "../../../services/api/productsService";
import { Link } from 'react-router-dom';


export default function AdminPage() {

    const {user} = useContext(usersContext);
    const [orders, setOrders] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [nrOrders, setNrOrders] = useState(0);
    const [nrProducts, setNrProducts] = useState(0);
    const [nrUsers, setNrUsers] = useState(0);
    const [monthlyRevenue, setMonthlyRevenue] = useState([]); 
    const [xAxisLabels, setXAxisLabels] = useState([]);
    const [topProducts, setTopProducts] = useState([]);


    const columns = [
        { id: 'userEmail', label: 'User Email', minWidth: 170 },
        { id: 'orderAmount', label: 'Amount', minWidth: 100, align: 'right' },
        { id: 'orderDate', label: 'Order Date', minWidth: 170, align: 'right' },
        { id: 'orderStatus', label: 'Order Status', minWidth: 170, align: 'right' }
    ];

    const productColumns = [
        { id: "name", label: "Product Name", minWidth: 170 },
        { id: "category", label: "Category", minWidth: 100 },
        { id: "price", label: "Price ($)", minWidth: 100, align: "right" },
        { id: "stock", label: "Stock", minWidth: 100, align: "right" }
    ];

    const createData = (order) => {
        return {
            id: order.id,
            userEmail: order.orderEmail,
            orderAmount: `$${order.amount.toFixed(2)}`,
            orderDate: new Date(order.orderDate).toLocaleDateString(),
            orderStatus: order.orderStatus
        };
    };

    const fetchMostSoldProducts = async () => {
        try {
            let data = await mostSold();
            if (data && Array.isArray(data.body.list)) {
                setTopProducts(data.body.list.slice(0, 5)); 
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching most sold products: ", err);
        }
    };

    const fetchOrders = async () => {
        try {
            let data = await getRecentOrders();
    
            if (data && Array.isArray(data.body.list)) {
                const formattedOrders = data.body.list.map(order => createData(order));
                setOrders(formattedOrders);
            } else {
                console.error("Invalid API response: ", data);
            }
        } catch (err) {
            console.error("Error fetching orders: ", err);
        }
    };

    const fetchData = async () => {
        try {
            let orders = await totalOrders();
            let products = await totalProducts();
            let revenueRequest = await totalRevenue();
            let userReq = await totalUsers();
            let monthlyRevenueResponse = await monthly(); 
            let monthlyRevenueData = monthlyRevenueResponse.body;
    
            if (orders && products && revenueRequest && monthlyRevenueData) {
                setNrOrders(orders.body);
                setNrProducts(products.body);
                setNrUsers(userReq.body);
    
                
                const sortedMonthlyRevenue = Object.keys(monthlyRevenueData)
                    .sort()
                    .reduce((acc, key) => {
                        acc[key] = monthlyRevenueData[key];
                        return acc;
                    }, {});
    
                
                const months = [];
                const monthLabels = [];
                const currentDate = new Date();
                for (let i = 11; i >= 0; i--) {
                    const date = new Date(currentDate);
                    date.setMonth(currentDate.getMonth() - i);
                    months.push(date.toISOString().slice(0, 7)); 
                    monthLabels.push(date.toLocaleString('default', { month: 'short' })); 
                }
    
                
                const monthlyRevenueArray = months.map(month => sortedMonthlyRevenue[month] || 0);
                setMonthlyRevenue(monthlyRevenueArray);
    
                
                setXAxisLabels(monthLabels);
            }
        } catch (err) {
            console.log(err);
        }
    };
    
    useEffect(() => {
        fetchOrders();
        fetchData();
        fetchMostSoldProducts();
    }, []);

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

            <div className="main-container-admin">
                <div className="linechart-container">
                    <LineChart
                        width={500}
                        height={300}
                        series={[
                            { data: monthlyRevenue, label: 'Monthly Revenue' },
                        ]}
                        xAxis={[{
                            scaleType: 'point',
                            data: xAxisLabels
                        }]}
                    />
                </div>

                <div className="piechart-container">
                    <PieChart
                        series={[{
                            data: [
                                { id: 0, value: nrOrders, label: 'Total Orders' },
                                { id: 1, value: nrUsers, label: 'Total Users' },
                                { id: 2, value: nrProducts, label: 'Products' },
                            ],
                        }]}
                        width={400}
                        height={200}
                    />
                </div>

                <div className="orders-container-admin">
                    <h2>Recent Orders</h2>
                    <Paper sx={{ width: '100%', overflow: 'hidden' }}>
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
                                    {orders
                                        .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                        .map((row) => (
                                            <TableRow hover role="checkbox" tabIndex={-1} key={row.id}>
                                                {columns.map((column) => {
                                                    const value = row[column.id];
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

                <div className="products-container-admin">
                    <h2>Top Selling Products</h2>
                    <Paper sx={{ width: "100%", overflow: "hidden" }}>
                        <TableContainer sx={{ maxHeight: 440 }}>
                            <Table stickyHeader aria-label="most sold products table">
                                <TableHead>
                                    <TableRow>
                                        {productColumns.map((column) => (
                                            <TableCell key={column.id} align={column.align} style={{ minWidth: column.minWidth }}>
                                                {column.label}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {topProducts.map((product) => (
                                        <TableRow hover role="checkbox" tabIndex={-1} key={product.id}>
                                            {productColumns.map((column) => {
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
        </>
    );
}