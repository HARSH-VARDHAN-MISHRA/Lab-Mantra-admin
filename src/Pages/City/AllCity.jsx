import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const AllCity = () => {
    const [cities, setCities] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [citiesPerPage] = useState(16);
    const [createData, setCreateData] = useState({ cityName: '' });
    const [updateData, setUpdateData] = useState({ cityName: '' });
    const [openCreateModel, setOpenCreateModel] = useState(false);
    const [openEditModel, setOpenEditModel] = useState(false);
    const [selectedCityId, setSelectedCityId] = useState(null);

    const fetchCities = async () => {
        try {
            const response = await axios.get(`http://localhost:6842/api/v1/admin-get-city`);
            setCities(response.data || []);
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        fetchCities();
    }, []);

    const handleCreate = async () => {
        try {
            await axios.post(`http://localhost:6842/api/v1/admin-create-city`, createData);
            setCreateData({ cityName: '' });
            fetchCities();
            setOpenCreateModel(false);
            toast.success('City Created Successfully');
        } catch (error) {
            console.log(error);
        }
    };

    const handleEdit = async (id) => {
        try {
            await axios.post(`http://localhost:6842/api/v1/admin-update-city/${id}`, updateData);
            setUpdateData({ cityName: '' });
            fetchCities();
            setOpenEditModel(false);
            toast.success('City Edited Successfully');
        } catch (error) {
            console.log(error);
        }
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:6842/api/v1/admin-delete-city/${id}`);
            fetchCities();
            toast.success('City Deleted Successfully');
        } catch (error) {
            console.log(error);
        }
    };

    // Pagination logic
    const indexOfLastCity = currentPage * citiesPerPage;
    const indexOfFirstCity = indexOfLastCity - citiesPerPage;
    const currentCities = cities.slice(indexOfFirstCity, indexOfLastCity);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div className="container py-4">
            <ToastContainer />

            <div className="bread">
                <div className="head">
                    <h4>All Cities</h4>
                </div>
                <div className="links">
                    <button onClick={() => setOpenCreateModel(true)} style={{background:'var(--color-blue-light)'}} className="btn btn-danger border-0" >
                        Add City <i className="fa-solid fa-plus"></i>
                    </button>
                </div>
            </div>


            <div className="row my-3">
                {currentCities.map((city) => (
                    <div key={city._id} className="col-md-3 mb-4">
                        <div className="card shadow-sm">
                            <div className="card-body text-center">
                                <h5 className="card-title">{city.cityName}</h5>
                                <div className="d-flex justify-content-center">
                                    <button
                                        onClick={() => { setUpdateData({ cityName: city.cityName }); setSelectedCityId(city._id); setOpenEditModel(true); }}
                                        className="btn btn-primary btn-sm mx-1"
                                    >
                                        <i className="fa-regular fa-pen-to-square"></i>
                                    </button>
                                    <button
                                        onClick={() => handleDelete(city._id)}
                                        className="btn btn-danger btn-sm mx-1"
                                    >
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="d-flex justify-content-center mt-4">
                {Array.from({ length: Math.ceil(cities.length / citiesPerPage) }, (_, index) => (
                    <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`btn mx-1 ${currentPage === index + 1 ? 'btn-primary' : 'btn-secondary'}`}
                    >
                        {index + 1}
                    </button>
                ))}
            </div>

            {/* Create Modal */}
            {openCreateModel && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Create City</h5>
                                <button type="button" className="close" aria-label="Close" onClick={() => setOpenCreateModel(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    placeholder="City Name"
                                    value={createData.cityName}
                                    onChange={(e) => setCreateData({ cityName: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-footer">
                                <button onClick={handleCreate} className="btn btn-success">Create</button>
                                <button onClick={() => setOpenCreateModel(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {openEditModel && (
                <div className="modal fade show d-block" tabIndex="-1" role="dialog">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title">Edit City</h5>
                                <button type="button" className="close" aria-label="Close" onClick={() => setOpenEditModel(false)}>
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body">
                                <input
                                    type="text"
                                    placeholder="City Name"
                                    value={updateData.cityName}
                                    onChange={(e) => setUpdateData({ cityName: e.target.value })}
                                    className="form-control"
                                />
                            </div>
                            <div className="modal-footer">
                                <button onClick={() => handleEdit(selectedCityId)} className="btn btn-success">Update</button>
                                <button onClick={() => setOpenEditModel(false)} className="btn btn-secondary">Cancel</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AllCity;
