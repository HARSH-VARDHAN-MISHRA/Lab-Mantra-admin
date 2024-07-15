import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllPackageTitle = () => {
    const [packageTitle, setPackageTitle] = useState([]);
    const [filteredPackageTitle, setFilteredPackageTitle] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const itemPerPage = 8;

    const handleFetch = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-package-title`);
            const reverseData = res.data.data.reverse();
            setPackageTitle(reverseData);
            setFilteredPackageTitle(reverseData); // Initially set filtered data same as fetched data
        } catch (error) {
            console.error('There was an error fetching the Package Title!', error);
        }
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    useEffect(() => {
        handleFetch();
    }, []);

    useEffect(() => {
        // Filter package titles based on searchQuery
        const filtered = packageTitle.filter(title =>
            title.packageTitle.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredPackageTitle(filtered);
    }, [searchQuery, packageTitle]);

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
                    const res = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/delete-package-title/${id}`);
                    console.log(res.data);
                    toast.success("Package Title Deleted");
                    handleFetch();

                    Swal.fire({
                        title: "Deleted!",
                        text: "Your Title has been deleted.",
                        icon: "success"
                    });
                } catch (error) {
                    console.error(error);
                    toast.error(error.response.data.message);
                }
            }
        });
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    // Calculate current items for pagination
    const indexOfLastItem = currentPage * itemPerPage;
    const indexOfFirstItem = indexOfLastItem - itemPerPage;
    const currentItems = filteredPackageTitle.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>All Package Title</h4>
                </div>
                <div className="links">
                    <Link to="/add-package-title" className="add-new">Add New <i className="fa-solid fa-plus"></i></Link>
                </div>
            </div>

            <div className="filteration">
                <div className="selects">
                    {/* <select>
                        <option>Ascending Order</option>
                        <option>Descending Order</option>
                    </select> */}
                </div>
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
                            <th scope="col">Sr.No.</th>
                            <th scope="col">Package Title</th>
                            <th scope="col">Packages</th>
                            <th scope="col">Packages Quantity</th>
                            <th scope="col">Edit</th>
                            <th scope="col">Delete</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentItems.map((title, index) => (
                            <tr key={index}>
                                <th scope="row">{index + 1}</th>
                                <td>{title.packageTitle}</td>
                                <td>
                                    {title.packagesId.map((pkg, idx) => (
                                        <div key={idx}>{pkg.packageName}, </div>
                                    ))}
                                </td>
                                <td>{title.packagesQuantity}</td>
                                <td>
                                    <Link to={`/edit-package-title/${title._id}`} className="bt edit">
                                        Edit <i className="fa-solid fa-pen-to-square"></i>
                                    </Link>
                                </td>
                                <td>
                                    <Link onClick={() => handleDelete(title._id)} className="bt delete">
                                        Delete <i className="fa-solid fa-trash"></i>
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <nav>
                    <ul className="pagination justify-content-center">
                        {Array.from({ length: Math.ceil(filteredPackageTitle.length / itemPerPage) }, (_, i) => (
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

export default AllPackageTitle;
