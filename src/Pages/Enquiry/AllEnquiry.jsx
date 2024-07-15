import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { format } from 'date-fns';


const AllEnquiry = () => {
    const [enquiry, setEnquiry] = useState([]);

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState('1')
    const itemPerPage = 20

    const handleFetch = async () => {
        console.log("hey");
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-enquiry`);
            const reverseData = res.data.data
            const main = reverseData.reverse()
            setEnquiry(main)
            // console.log(enquiry)
        } catch (error) {
            console.error('There was an error fetching the Enquiries!', error);
        }
    }

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Pagination ---
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = enquiry.slice(indexOfFirstItem, indexOfLastItem)

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
                    const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-enquiry/${id}`);
                    console.log(res.data);
                    toast.success("Enquiry Deleted");
                    handleFetch();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Enquiry has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Enquiry </h4>
                </div>
                <div className="links">
                    <Link onClick={handleFetch} className="add-new"><i class="fa-solid fa-arrows-rotate"></i> Refresh </Link>
                </div>
            </div>

            <section className="main-table ">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Name</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">Email Id</th>
                            <th scope="col">Address</th>
                            <th scope="col">Enquiry At</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((enq, index) => (
                            <tr key={enq._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{enq.firstName} {enq.lastName}</td>
                                <td>{enq.phoneNumber}</td>
                                <td>{enq.email_id}</td>
                                <td>{enq.address}</td>
                                <td>
                                    {isNaN(Date.parse(enq.createdAt)) ? 'Invalid date' : format(new Date(enq.createdAt), 'dd MMMM yyyy, HH:mm')}
                                </td>
                                <td><Link onClick={() => { handleDelete(enq._id) }} className="bt delete">Delete <i className="fa-solid fa-trash"></i></Link></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(enquiry.length / itemPerPage) }, (_, i) => (
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

export default AllEnquiry