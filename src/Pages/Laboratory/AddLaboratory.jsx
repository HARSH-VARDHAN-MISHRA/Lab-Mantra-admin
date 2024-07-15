import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLaboratory = () => {
    const [formData, setData] = useState({
        LabName: '',
        LabPassword:'',
        RepresentedName: '',
        email: '',
        PhoneNumber: '',
        SecondPhoneNumber: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',
        discountPercentage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Handle input change in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        console.log(formData);
        try {
            // Validate required fields
            const { LabName, address, city, state, pinCode } = formData;
            if (!LabName || !address || !city || !state || !pinCode ) {
                toast.error("All fields are required.");
                setIsLoading(false);
                return;
            }


            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-laboratory`, {
                ...formData,
                tests: [] ,
                location: {
                    coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
                }
            });
            console.log(response.data);
            setIsLoading(false);

            // toast.success("Test Created Successfully !!");
            toast.success('Laboratory Created Successfully', {
                onClose: () => {
                    navigate('/all-laboratory');
                }
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Laboratory</h4>
                </div>
                <div className="links">
                    <Link to="/all-laboratory" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="LabName" className="form-label">Laboratory Name<span className="text-danger">*</span></label>
                        <input type="text" name="LabName" value={formData.LabName} onChange={handleChange} className="form-control" id="LabName" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="LabPassword" className="form-label">Laboratory Password<span className="text-danger">*</span></label>
                        <input type="text" name="LabPassword" value={formData.LabPassword} onChange={handleChange} className="form-control" id="LabPassword" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="RepresentedName" className="form-label">Represented Name<span className="text-danger">*</span></label>
                        <input type="text" name="RepresentedName" value={formData.RepresentedName} onChange={handleChange} required className="form-control" id="RepresentedName" />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="PhoneNumber" className="form-label">Phone Number<span className="text-danger">*</span></label>
                        <input type="tel" name="PhoneNumber" value={formData.PhoneNumber} onChange={handleChange} required className="form-control" id="PhoneNumber" />
                    </div>

                    <div className="col-md-3">
                        <label htmlFor="SecondPhoneNumber" className="form-label">Second Phone Number</label>
                        <input type="tel" name="SecondPhoneNumber" value={formData.SecondPhoneNumber} onChange={handleChange} className="form-control" id="SecondPhoneNumber" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" id="email" />
                    </div>
                    <div className="col-md-2">
                        <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
                        <input type="number" name="discountPercentage" value={formData.discountPercentage} onChange={handleChange} className="form-control" id="discountPercentage" />
                    </div>
                    <div className="col-md-12">
                        <label htmlFor="address" className="form-label">Address<span className="text-danger">*</span></label>
                        <input type="text" name="address" value={formData.address} onChange={handleChange} className="form-control" id="address" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="pinCode" className="form-label">Pin Code<span className="text-danger">*</span></label>
                        <input type="text" name="pinCode" value={formData.pinCode} onChange={handleChange} className="form-control" id="pinCode" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="city" className="form-label">City<span className="text-danger">*</span></label>
                        <input type="text" name="city" value={formData.city} onChange={handleChange} className="form-control" id="city" required />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="state" className="form-label">State<span className="text-danger">*</span></label>
                        <input type="text" name="state" value={formData.state} onChange={handleChange} className="form-control" id="state" required />
                    </div>
   

                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Laboratory"}</button>
                    </div>
                </form>
                
            </div>
        </>
    );
};

export default AddLaboratory;
