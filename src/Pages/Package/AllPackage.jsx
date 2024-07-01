import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllPackage = () => {
    const [testPackage, setPackage] = useState([]);

    // --- Pagination ---
    const [currentPage, setCurrentPage] = useState('1')
    const itemPerPage = 20

    const handleFetch = async () => {
        try {
            const res = await axios.get('https://lab-mantra-backend.onrender.com/api/v1/get-all-package');
            const reverseData = res.data.data
            const main = reverseData.reverse()
            setPackage(main)
            console.log("Main",main)
        } catch (error) {
            console.error('There was an error fetching the Package!', error);
        }
    }
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // --- Pagination ---
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = testPackage.slice(indexOfFirstItem, indexOfLastItem)

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
                    const res = await axios.delete(`https://lab-mantra-backend.onrender.com/api/v1/delete-package/${id}`);
                    console.log(res.data);
                    toast.success("Package Deleted");
                    handleFetch();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your file has been deleted.",
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
                    <h4>All Package </h4>
                </div>
                <div className="links">
                    <Link to="/add-package" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* <select>
                        <option>Ascending Order </option>
                        <option>Descending Order </option>
                    </select> */}
                </div>
                <div className="search">
                    <label htmlFor="search">Search </label> &nbsp;
                    <input type="text" name="search" id="search" />
                </div>
            </div>

            <section className="d-table ">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Package Name</th>
                            <th scope="col">Test Groups</th>
                            <th scope="col">Test Quantity</th>
                            <th scope="col">Test Group Quantity</th>
                            <th scope="col">Actuall Price</th>
                            <th scope="col">Current Price</th>
                            <th scope="col">Off Percentage</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems && currentItems.map((testPackage, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{testPackage.packageName}</td>
                                <td>
                                    {testPackage.testCategoryId.map((testGroupName, idx) => (
                                      <>
                                            <div key={idx}>{testGroupName} ,</div>
                                            {/* <div key={idx}>{testGroupName.testCategoryName} ,</div> */}
                                        </>
                                    ))}
                                </td>
                                <td>{testPackage.testQuantity}</td>
                                <td>{testPackage.testGroupQuantity}</td>
                                <td>{testPackage.actualPrice}</td>
                                <td>{testPackage.currentPrice}</td>
                                <td>
                                  {testPackage.offPercentage ? `${testPackage.offPercentage}%` : ''}
                                </td>
                                <td><Link to={`/edit-package/${testPackage._id}`} className="bt edit">Edit <i className="fa-solid fa-pen-to-square"></i></Link></td>
                                <td><Link onClick={() => { handleDelete(testPackage._id) }} className="bt delete">Delete <i className="fa-solid fa-trash"></i></Link></td>
                            </tr>
                        ))}
                    </tbody>

                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(testPackage.length / itemPerPage) }, (_, i) => (
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

export default AllPackage