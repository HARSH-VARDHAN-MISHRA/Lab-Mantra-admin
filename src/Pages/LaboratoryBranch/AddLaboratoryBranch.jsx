import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddLaboratoryBranch = () => {
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [formData, setData] = useState({
        MainLaboratory: '',
        LabName: '',
        RepresentedName: '',
        email: '',
        PhoneNumber: '',
        SecondPhoneNumber: '',
        address: '',
        city: '',
        state: '',
        pinCode: '',

    });

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
            const { MainLaboratory, LabName, address, city, state, pinCode } = formData;
            if (!MainLaboratory || !LabName || !address || !city || !state || !pinCode) {
                toast.error("All fields are required.");
                setIsLoading(false);
                return;
            }
    
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-branch-laboratory`, {
                ...formData,
                location: {
                    coordinates: [parseFloat(formData.longitude), parseFloat(formData.latitude)]
                }
            });
            console.log(response.data);
            setIsLoading(false);
    
            toast.success('Laboratory Branch Created Successfully', {
                onClose: () => {
                    navigate('/all-laboratory-branch');
                }
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };
    

    const [laboratories, setLaboratories] = useState([]);
    const fetchLaboratory = async () => {
        try {
            const res = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-laboratories`);
            setLaboratories(res.data.data);
        } catch (error) {
            console.error("Error While Fetching the Laboratories !!", error);
        }
    }
    useEffect(() => {
        fetchLaboratory();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Laboratory Branch</h4>
                </div>
                <div className="links">
                    <Link to="/all-laboratory-branch" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-4">
                        <label htmlFor="inputLab" className="form-label">Main Laboratory</label>
                        <select
                            id="inputLab"
                            name="MainLaboratory"
                            className="form-select"
                            value={formData.MainLaboratory}
                            onChange={handleChange}
                        >
                            <option value="" disabled>Select Main Laboratory</option> {/* value attribute */}
                            {laboratories && laboratories.map((lab, ind) => (
                                <option key={ind} value={lab._id}>{lab.LabName}</option>
                            ))}
                        </select>
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="LabName" className="form-label">Laboratory Name<span className="text-danger">*</span></label>
                        <input type="text" name="LabName" value={formData.LabName} onChange={handleChange} className="form-control" id="LabName" required />
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
                        <input type="text" name="SecondPhoneNumber" value={formData.SecondPhoneNumber} onChange={handleChange} className="form-control" id="SecondPhoneNumber" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="email" name="email" value={formData.email} onChange={handleChange} className="form-control" id="email" />
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
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Laboratory Branch"}</button>
                    </div>
                </form>

            </div>
        </>
    );
};

export default AddLaboratoryBranch;
