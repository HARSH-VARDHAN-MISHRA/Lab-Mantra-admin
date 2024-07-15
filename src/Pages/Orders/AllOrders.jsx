import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllOrders = () => {
    const [orders, setOrders] = useState([]);

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState('1')
    const itemPerPage = 20

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/all-orders`);
            const reverseData = res.data.data
            const main = reverseData.reverse()
            setOrders(main)
            console.log(orders)
        } catch (error) {
            console.error('There was an error fetching the Orders!', error);
        }
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Pagination ---
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = orders.slice(indexOfFirstItem, indexOfLastItem)

    useEffect(() => {
        handleFetch();
    }, []);

    const handleDelete = async (id) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-order/${id}`);
                    console.log(res.data.data);
                    toast.success("Order Deleted");
                    handleFetch();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Order has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    const formatDate = (dateString) => {
        const options = { day: '2-digit', month: 'long', year: 'numeric' };
        return new Date(dateString).toLocaleDateString('en-US', options);
    };
    
    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Orders </h4>
                </div>
                <div className="links">

                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    <select>
                        <option>Ascending Order </option>
                        <option>Descending Order </option>
                    </select>
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="main-table " style={{display:"block"}}>
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Lab Name</th>
                            <th scope="col">Lab Address</th>
                            <th scope="col">Pincode</th>
                            <th scope="col">City</th>
                            <th scope="col">Full Name</th>
                            <th scope="col">Phone</th>
                            <th scope="col">Email</th>
                            <th scope="col">Date</th>
                            <th scope="col">Age</th>
                            <th scope="col">Gender</th>
                            <th scope="col">Appointment Time</th>
                            <th scope="col">Booking Type</th>
                            <th scope="col">Subtotal</th>
                            <th scope="col">Total to Pay</th>
                            <th scope="col">Payment Status</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((order, index) => (
                            <tr key={order._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{order.labName}</td>
                                <td>{order.labAddress}</td>
                                <td>{order.pincode}</td>
                                <td>{order.city}</td>
                                <td>{order.fullName}</td>
                                <td>{order.phone}</td>
                                <td>{order.email}</td>
                                <td>{formatDate(order.date)}</td>
                                <td>{order.age}</td>
                                <td>{order.gender}</td>
                                <td>{order.appointTime}</td>
                                <td>{order.bookingType}</td>
                                <td>{order.subtotal}</td>
                                <td>{order.totalToPay}</td>
                                <td>{order.paymentStatus}</td>
                                <td><Link to={`/edit-order/${order._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link></td>
                                <td><Link onClick={() => { handleDelete(order._id) }} className="bt delete">Delete <i className="fa-solid fa-trash"></i></Link></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(orders.length / itemPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    )
}

export default AllOrders