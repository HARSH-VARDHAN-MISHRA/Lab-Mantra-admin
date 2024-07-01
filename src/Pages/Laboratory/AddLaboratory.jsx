import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
const AddLaboratory = () => {
    const [formData, setFormData] = useState({
        name: '',
        RepresentedName: '',
        email: '',
        PhoneNumber: '',
        SecondPhoneNumber: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        longitude: '',
        latitude: '',
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Validate required fields
            const { name, address, city, state, pinCode, longitude, latitude } = formData;
            if (!name || !address || !city || !state || !pinCode || !longitude || !latitude) {
                toast.error("All fields are required.");
                setIsLoading(false);
                return;
            }

            // Submit data to backend
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

    return (
        <div>
            <form className='card p-3' onSubmit={handleSubmit}>
                <div className='col-12'>
                    <div className='row'>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="name" className="form-label">Laboratory Name<span className="text-danger">*</span></label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} className="form-control" id="name" required />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="RepresentedName" className="form-label">Represented Name<span className="text-danger">*</span></label>
                            <input type="text" name="RepresentedName" value={formData.RepresentedName} onChange={handleChange} required className="form-control" id="RepresentedName" />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='row'>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="PhoneNumber" className="form-label">Phone Number<span className="text-danger">*</span></label>
                            <input type="text" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="form-control" id="PhoneNumber" />
                        </div>
                        <div className="mb-3 col-md-6">
                            <label htmlFor="SecondPhoneNumber" className="form-label">Second Phone Number</label>
                            <input type="text" name="SecondPhoneNumber" value={formData.SecondPhoneNumber} onChange={handleChange} className="form-control" id="SecondPhoneNumber" />
                        </div>
                    </div>
                </div>
                <div className='col-12'>
                    <div className='row'>
                    <div className="mb-3 col-md-6">
                    <label htmlFor="email" className="form-label">Email</label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" id="email" />
                </div>
            
                <div className="mb-3 col-md-6">
                    <label htmlFor="pinCode" className="form-label">Pin Code<span className="text-danger">*</span></label>
                    <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control" id="pinCode" required />
                </div>
                    </div>
                </div>
                <div className='give-location mb-3'>
                    <button type='button' className='btn btn-primary'>Give Location Automatically</button>
                </div>
                <div className="mb-3">
                    <label htmlFor="address" className="form-label">Address<span className="text-danger">*</span></label>
                    <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" id="address" required />
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="city" className="form-label">City<span className="text-danger">*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" id="city" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="state" className="form-label">State<span className="text-danger">*</span></label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" id="state" required />
                    </div>
                </div>
             
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label htmlFor="longitude" className="form-label">Longitude<span className="text-danger">*</span></label>
                        <input type="text" name="longitude" value={formData.longitude} onChange={handleChange} className="form-control" id="longitude" required />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label htmlFor="latitude" className="form-label">Latitude<span className="text-danger">*</span></label>
                        <input type="text" name="latitude" value={formData.latitude} onChange={handleChange} className="form-control" id="latitude" required />
                    </div>
                </div>
                <div className="col-12 text-center">
                    <button type="submit" disabled={isLoading} className={`btn btn-primary ${isLoading ? 'disabled' : ''}`}>
                        {isLoading ? "Please Wait..." : "Add Laboratory"}
                    </button>
                </div>
            </form>
        </div>
    )
}

export default AddLaboratory
