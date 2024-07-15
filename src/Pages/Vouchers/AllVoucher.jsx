import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';


const AllVoucher = () => {
    const [vouchers, setVouchers] = useState([]);

    useEffect(() => {
        const fetchVouchers = async () => {
            try {
                const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/vouchers`);  // Adjust the endpoint as needed
                setVouchers(response.data.data);
            } catch (error) {
                console.error("Error fetching vouchers:", error);
            }
        };

        fetchVouchers();
    }, []);

    const markActive = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/vouchers/activateVoucher/${id}`);
            // Update the local state to reflect the change
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, Active: true } : voucher));
        } catch (error) {
            console.error("Error marking voucher as active:", error);
        }
    };

    const markInActive = async (id) => {
        try {
            await axios.put(`${process.env.REACT_APP_BACKEND_URL}/vouchers/deactivateVoucher/${id}`);
            // Update the local state to reflect the change
            setVouchers(vouchers.map(voucher => voucher._id === id ? { ...voucher, Active: false } : voucher));
        } catch (error) {
            console.error("Error marking voucher as inactive:", error);
        }
    };

    const markDelete = async (id) => {
        try {
            await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/vouchers/deleteVoucher/${id}`);
            // Remove the voucher from local state
            setVouchers(vouchers.filter(voucher => voucher._id !== id));
        } catch (error) {
            console.error("Error deleting voucher:", error);
        }
    };

    return (
        <>
            <div className="bread">
                <div className="head">
                    <h4>All Voucher </h4>
                </div>
                <div className="links">
                    <Link to="/add-voucher" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>



                       
                        <section className=" mt-2 main-table table-responsive">
                            <table className="table table-bordered table-striped table-hover">
                                <thead>
                                    <tr>
                                        <th scope="col">Coupon Code</th>
                                        <th scope="col">Discount Percentage</th>
                                        <th scope="col">Status</th>
                                        <th scope="col">Mark Active</th>
                                        <th scope="col">Mark In-Active</th>
                                        <th scope="col">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {vouchers && vouchers.map(voucher => (
                                        <tr key={voucher._id}>
                                            <td>{voucher.CouponeCode}</td>
                                            <td>{voucher.HowMuchPercentageof}%</td>
                                            <td>{voucher.Active ? 'Yes' : 'No'}</td>
                                            <td>
                                                <button className="btn btn-success btn-sm" onClick={() => markActive(voucher._id)}>Active</button>
                                            </td>
                                            <td>
                                                <button className="btn btn-danger btn-sm" onClick={() => markInActive(voucher._id)}>De-Active</button>
                                            </td>
                                            <td>
                                                <Link className="bt delete" onClick={() => markDelete(voucher._id)}>Delete <i className="fa-solid fa-trash"></i></Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </section>
                    
        
        </>

    );
}

export default AllVoucher;
