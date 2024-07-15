import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllTestCategory = () => {
    const [testCategory, setTestCategory] = useState([]);
    const [filteredCategory, setFilteredCategory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-test-category`);
            const reverseData = res.data.data.reverse();
            setTestCategory(reverseData);
            setFilteredCategory(reverseData); // Initially set filtered data same as fetched data
        } catch (error) {
            console.error('There was an error fetching the test categories!', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        // Filter test categories based on searchQuery
        const filtered = testCategory.filter(category =>
            category.testCategoryName.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredCategory(filtered);
    }, [searchQuery, testCategory]);

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
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-test-category/${id}`);
                    toast.success("Test Category Deleted");
                    handleFetch();

                    Swal.fire({
                        title: "Deleted!",
                        text: "The test category has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response?.data?.message || 'Error deleting the test category.');
                }
            }
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Calculate current items for pagination
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredCategory.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Test Categories</h4>
                </div>
                <div className="links">
                    <Link to="/add-test-category" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="search">
                    <label htmlFor="search">Search</label> &nbsp;
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <section className="main-table">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col" className='text-nowrap'>Sr.No.</th>
                            <th scope="col" className='text-nowrap'>Test Category Name</th>
                            <th scope="col" className='text-nowrap'>Test Names</th>
                            <th scope="col" className='text-nowrap'>Test Quantity</th>
                            <th scope="col" className='text-nowrap'>Edit</th>
                            <th scope="col" className='text-nowrap'>Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((testGroup, index) => (
                            <tr key={index}>
                                <th scope="row">{indexOfFirstItem + index + 1}</th>
                                <td>{testGroup.testCategoryName}</td>
                                <td>
                                    {testGroup.testId.map((test, idx) => (
                                        <div key={idx} className='text-nowrap'>{test.testName} ,</div>
                                    ))}
                                </td>
                                <td>{testGroup.testNumber}</td>
                                <td>
                                    <Link to={`/edit-test-category/${testGroup._id}`} className="bt edit">
                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                </td>
                                <td>
                                    <Link onClick={() => handleDelete(testGroup._id)} className="bt delete">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredCategory.length / itemsPerPage) }, (_, i) => (
                            <li key={i + 1} className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(i + 1)}>{i + 1}</button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </section>
        </>
    );
};

export default AllTestCategory;
