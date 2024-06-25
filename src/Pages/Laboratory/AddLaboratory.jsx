import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AddLaboratory = () => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        tests: [],
        longitude: '',
        latitude: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const [testOptions, setTestOptions] = useState([]);
    const navigate = useNavigate();

    // Fetch all available tests
    const fetchTests = async () => {
        try {
            const testRes = await axios.get('http://localhost:6842/api/v1/get-all-test');
            const options = testRes.data.data.map(test => ({
                value: test._id,
                label: test.testName
            }));
            setTestOptions(options);
        } catch (error) {
            console.error('Error fetching tests:', error);
            toast.error('Error fetching tests');
        }
    };

    // Handle input change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle change in selected tests
    const handleTestChange = (selectedOptions) => {
        setFormData(prevData => ({
            ...prevData,
            tests: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    // Fetch address details from coordinates
    const fetchAddressFromCoordinates = async (longitude, latitude) => {
        try {
            const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`);

            if (response.data.results.length > 0) {
                const { city, state, postcode, formatted } = response.data.results[0].components;
                setFormData(prevData => ({
                    ...prevData,
                    address: formatted || '',
                    city: city || '',
                    state: state || '',
                    pinCode: postcode || ''
                }));
            } else {
                toast.error('No address found for the given coordinates');
            }
        } catch (error) {
            console.error('Error fetching address:', error);
            toast.error('Error fetching address. Please try again.');
        }
    };

    // Handle change in longitude or latitude input fields
    const handleCoordinatesChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));

        if (name === 'longitude' || name === 'latitude') {
            const longitude = name === 'longitude' ? value : formData.longitude;
            const latitude = name === 'latitude' ? value : formData.latitude;

            if (longitude && latitude) {
                fetchAddressFromCoordinates(longitude, latitude);
            }
        }
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:6842/api/v1/create-laboratory', {
                ...formData,
                location: {
                    coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
                }
            });

            setIsLoading(false);
            toast.success('Laboratory created successfully', {
                onClose: () => {
                    navigate('/all-laboratories');
                }
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        fetchTests();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Laboratory</h4>
                </div>
                <div className="links">
                    <Link to="/all-laboratories" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-8">
                        <label htmlFor="name" className="form-label">Laboratory Name</label>
                        <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" id="name" required />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="address" className="form-label">Address</label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" id="address" required />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="city" className="form-label">City</label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" id="city" required />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="state" className="form-label">State</label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" id="state" required />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="pinCode" className="form-label">Pin Code</label>
                        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control" id="pinCode" required />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="tests" className="form-label">Select Tests</label>
                        <Select
                            isMulti
                            options={testOptions}
                            onChange={handleTestChange}
                            value={testOptions.filter(option => formData.tests.includes(option.value))}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="longitude" className="form-label">Longitude</label>
                        <input type="text" name="longitude" value={formData.longitude} onChange={handleCoordinatesChange} className="form-control" id="longitude" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="latitude" className="form-label">Latitude</label>
                        <input type="text" name="latitude" value={formData.latitude} onChange={handleCoordinatesChange} className="form-control" id="latitude" required />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Laboratory"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddLaboratory;
