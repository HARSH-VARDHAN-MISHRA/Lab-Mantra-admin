import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllLaboratory = () => {
    const [laboratory, setLaboratory] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredLaboratory, setFilteredLaboratory] = useState([]);
    const [currentLabId, setCurrentLabId] = useState(null); // State to track current lab id for adding tests
    const [currentPage, setCurrentPage] = useState(1);
    const [uploadFile, setUploadFile] = useState(null); // State to manage uploaded file

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-laboratories`);
            const reverseData = res.data.data.reverse();
            setLaboratory(reverseData);
        } catch (error) {
            console.error('There was an error fetching the laboratories!', error);
        }
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        setFilteredLaboratory(
            laboratory.filter((lab) =>
                lab.LabName.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, laboratory]);

    const handleDelete = async (id) => {
        // ... handle delete logic
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleAddTestClick = (labId) => {
        setCurrentLabId(labId); // Set current lab id for adding tests
        // Open modal here if necessary
        // Example: setModalOpen(true);
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleFileChange = (e) => {
        setUploadFile(e.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!uploadFile) {
            toast.error('Please select a file to upload.');
            return;
        }

        const formData = new FormData();
        formData.append('labId', currentLabId); // Append labId to FormData
        formData.append('file', uploadFile); // Append file to FormData

        try {
            const res = await axios.post('http://localhost:6842/api/v1/lab/upload-xlsx', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            console.log(res.data);
            toast.success('File uploaded successfully.');
            // Optionally close modal or perform other actions upon successful upload
        } catch (error) {
            console.error('Error uploading file', error);
            toast.error('Error uploading file. Please try again.');
        }
    };

    // --- Pagination ---
    const itemPerPage = 10;
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = filteredLaboratory.slice(
        indexOfFirstItem,
        indexOfLastItem
    );

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Laboratory List </h4>
                </div>
                <div className="links">
                    <Link to="/add-laboratory" className="add-new">
                        Add New <i className="fa-solid fa-plus"></i>
                    </Link>
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
                    <input
                        type="text"
                        name="search"
                        id="search"
                        value={searchQuery}
                        onChange={handleSearchChange}
                    />
                </div>
            </div>

            <section className="main-table ">
                <table className="table table-bordered table-striped table-hover">
                    <thead>
                        <tr>
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Owner Name</th>
                            <th scope="col">Lab Name</th>
                            <th scope="col">Email Id</th>
                            <th scope="col">Phone Number</th>
                            <th scope="col">How Many Tests</th>

                            <th scope="col">Address</th>
                            <th scope="col">City</th>
                            <th scope="col">State</th>
                            <th scope="col">Pin Code</th>
                            <th scope="col">Add Test</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((lab, index) => (
                            <tr key={lab._id}>
                                <th scope="row">{index + 1}</th>
                                <td>{lab.RepresentedName}</td>
                                <td>{lab.LabName}</td>
                                <td>{lab.email}</td>
                                <td>
                                    {lab.PhoneNumber}
                                    {lab.SecondPhoneNumber &&
                                        `, ${lab.SecondPhoneNumber}`}
                                </td>
                                <td>{lab.tests.length || 0}</td>
                                <td>{lab.address}</td>
                                <td>{lab.city}</td>
                                <td>{lab.state}</td>
                                <td>{lab.pinCode}</td>
                                <td>
                                    <button
                                        className="btn btn-primary"
                                        onClick={() => handleAddTestClick(lab._id)}
                                        data-bs-toggle="modal"
                                        data-bs-target="#exampleModal"
                                    >
                                        Add Test
                                    </button>
                                </td>
                                <td>
                                    <Link to={`/edit-lab/${lab._id}`} className="btn btn-info">
                                        Edit
                                    </Link>
                                </td>
                                <td>
                                    <button
                                        onClick={() => handleDelete(lab._id)}
                                        className="btn btn-danger"
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from(
                            {
                                length: Math.ceil(
                                    filteredLaboratory.length / itemPerPage
                                ),
                            },
                            (_, i) => (
                                <li
                                    key={i + 1}
                                    className={`page-item ${currentPage === i + 1 ? 'active' : ''}`}
                                >
                                    <button
                                        className="page-link"
                                        onClick={() => handlePageChange(i + 1)}
                                    >
                                        {i + 1}
                                    </button>
                                </li>
                            )
                        )}
                    </ul>
                </nav>
            </section>

            {/* Bootstrap Modal for Add Test */}
            <div
                className="modal fade"
                id="exampleModal"
                tabIndex="-1"
                aria-labelledby="exampleModalLabel"
                aria-hidden="true"
            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title" id="exampleModalLabel">
                                Add Test
                            </h5>
                            <button
                                type="button"
                                className="btn-close"
                                data-bs-dismiss="modal"
                                aria-label="Close"
                            ></button>
                        </div>
                        <div className="modal-body">
                            {/* Add your form elements here for file upload */}
                            <form>
                                <div className="mb-3">
                                    <label htmlFor="fileUpload" className="form-label">
                                        Upload Excel File
                                    </label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="fileUpload"
                                        onChange={handleFileChange}
                                    />
                                </div>
                                <button type="button" className="btn btn-primary" onClick={handleFileUpload}>
                                    Upload
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default AllLaboratory;
