import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Swal from 'sweetalert2';

const AddLaboratoryTest = () => {
    const [laboratories, setLaboratories] = useState([]);
    const [selectedLabId, setSelectedLabId] = useState('');
    const [tests, setTests] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [pageSize, setPageSize] = useState(50); // Number of items per page
    const [showModal, setShowModal] = useState(false);
    const [selectedTestId, setSelectedTestId] = useState('');
    const [testDetails, setTestDetails] = useState({
        testNo: '',
        TestName: '',
        Price: '',
        DiscountPercentage: '',
        DiscountPrice: ''
    });

    useEffect(() => {
        fetchLaboratories();
    }, []);

    const fetchLaboratories = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-laboratories`);
            setLaboratories(res.data.data);
        } catch (error) {
            console.error('Error fetching laboratories:', error);
        }
    };

    const handleLabChange = async (labId) => {
        try {
            setSelectedLabId(labId);
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lab/get-all-test/${labId}`);
            setTests(res.data.tests);
            setTotalPages(Math.ceil(res.data.tests.length / pageSize));
            setCurrentPage(1);
        } catch (error) {
            console.error('Error fetching tests:', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleJumpToPage = (e) => {
        e.preventDefault();
        const pageNumber = parseInt(e.target.jumpInput.value, 10);
        if (!isNaN(pageNumber) && pageNumber > 0 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        } else {
            console.error('Invalid page number');
        }
    };


    const handleDeleteTest = async (testId) => {
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
                    await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/lab/delete-test/${testId}`);
                    handleLabChange(selectedLabId);

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Test has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error('Error deleting test:', error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    const handleUpdate = async (testId) => {

        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lab/get-single-test/${testId}`);
            setSelectedTestId(testId);
            console.log(res.data);
            setTestDetails(res.data.data);
            setShowModal(true);
        } catch (error) {
            console.error('Error fetching test details:', error);
        }
    };

    const handleSaveUpdate = async () => {
        try {
            const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lab/update-test/${selectedTestId}`, testDetails);
            // console.log(res.data);
            toast.success("Test Updates Successfull")
            setShowModal(false);
            handleLabChange(selectedLabId); // Refresh tests list after update
        } catch (error) {
            console.error('Error updating test:', error);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name === 'DiscountPercentage') {
            const price = parseFloat(testDetails.Price);
            const discountPercentage = parseFloat(value);
            const discountPrice = price - (price * (discountPercentage / 100));
            setTestDetails(prevState => ({
                ...prevState,
                DiscountPercentage: value,
                DiscountPrice: discountPrice.toFixed(0) // Round to whole number
            }));
        } else {
            setTestDetails(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const filteredTests = tests.filter(test =>
        test.TestName.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const indexOfLastItem = currentPage * pageSize;
    const indexOfFirstItem = indexOfLastItem - pageSize;
    const currentTests = filteredTests.slice(indexOfFirstItem, indexOfLastItem);
    //   const currentTests = tests.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div>

            <div className="bread">
                <div className="head">
                    <h4>All Laboratory Test</h4>
                </div>
                <div className="links">

                </div>
            </div>
            <div className='row my-4'>
                <div className='col-md-6'>
                    <div className="form-group">
                        <label>Select Laboratory:</label>
                        <select className="form-control" onChange={(e) => handleLabChange(e.target.value)}>
                            <option value="">Select a Laboratory</option>
                            {laboratories.map(lab => (
                                <option key={lab._id} value={lab._id}>{lab.LabName}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='col-md-6'>
                    <label>Search By Test Name:</label>

                    <input
                        type="text"
                        placeholder="Search by Test Name"
                        value={searchQuery}
                        className="form-control"
                        onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}

                    />
                </div>
            </div>


            {selectedLabId && (
                <div>

                    <div className="main-table">
                        <table className="table table-bordered table-striped table-hover">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Test No</th>
                                    <th>Test Name</th>
                                    <th>Price</th>
                                    <th>Discount %</th>
                                    <th>Discounted Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentTests && currentTests.map((test, index) => (
                                    <tr key={test._id}>
                                        <td>{index + 1}</td>
                                        <td>{test.TestName}</td>
                                        <td>{test.Price}</td>
                                        <td>{test.DiscountPercentage}</td>
                                        <td>{test.DiscountPrice.toFixed(0)}</td>
                                        <td>
                                            <button className="bt edit me-2" onClick={() => handleUpdate(test._id)}>Update</button>
                                            <button className="bt delete" onClick={() => handleDeleteTest(test._id)}>Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>


                    <nav className='row'>
                        <ul className="pagination col-md-6 mx-auto ">
                            <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage - 1)}>Previous</button>
                            </li>
                            <li className="page-item disabled">
                                <span className="page-link">{currentPage} of {totalPages}</span>
                            </li>
                            <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                                <button className="page-link" onClick={() => handlePageChange(currentPage + 1)}>Next</button>
                            </li>
                        </ul>

                    </nav>
                </div>
            )}

            {/* Modal for updating test details */}
            <div className={`modal ${showModal ? 'show' : ''}`} tabIndex="-1" role="dialog" style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog" role="document">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Update Test Details</h5>
                            <button type="button" className="close" onClick={() => setShowModal(false)}>
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div className="modal-body">
                            <form>
                                <div className="form-group">
                                    <label>Test No:</label>
                                    <input type="text" className="form-control" name="testNo" value={testDetails.testNo} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Test Name:</label>
                                    <input type="text" className="form-control" name="TestName" value={testDetails.TestName} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Price:</label>
                                    <input type="text" className="form-control" name="Price" value={testDetails.Price} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Discount Percentage:</label>
                                    <input type="text" className="form-control" name="DiscountPercentage" value={testDetails.DiscountPercentage} onChange={handleInputChange} />
                                </div>
                                <div className="form-group">
                                    <label>Discounted Price:</label>
                                    <input type="text" className="form-control" name="DiscountPrice" value={testDetails.DiscountPrice} onChange={handleInputChange} />
                                </div>

                            </form>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Close</button>
                            <button type="button" className="btn btn-primary" onClick={handleSaveUpdate}>Save changes</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AddLaboratoryTest;
