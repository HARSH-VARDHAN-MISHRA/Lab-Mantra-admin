import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';


const CreateVoucher = ({ onCreate }) => {
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        CouponeCode: '',
        HowMuchPercentageof: '',
        Active: true,
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.CouponeCode || !formData.HowMuchPercentageof) {
            toast.error('Please submit all fields');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/vouchers/create-vouchers`, formData);  // Adjust the endpoint as needed
            console.log(response.data.data);
            toast.success('Coupon Code Generated Successfully');
            setIsLoading(false);
            navigate('/all-voucher');
            //   setFormData({ CouponeCode: '', HowMuchPercentageof: '', Active: true });
        } catch (error) {
            console.error("Error creating voucher:", error);
            toast.error(error.response.data.error || "Internal Server Error")
            setIsLoading(false);
        }
    };

    return (
        <>

            <div className="bread">
                <div className="head">
                    <h4>Create Voucher</h4>
                </div>
                <div className="links">
                    <Link to="/all-voucher" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label className="form-label">Coupon Code</label>
                        <input
                            type="text"
                            name="CouponeCode"
                            value={formData.CouponeCode}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6">
                        <label className="form-label">Discount Percentage</label>
                        <input
                            type="number"
                            name="HowMuchPercentageof"
                            value={formData.HowMuchPercentageof}
                            onChange={handleChange}
                            className="form-control"
                        />
                    </div>
                    <div className="col-md-6 form-check">
                        <input
                            type="checkbox"
                            name="Active"
                            checked={formData.Active}
                            onChange={(e) => setFormData({ ...formData, Active: e.target.checked })}
                            className="form-check-input"
                        />
                        <label className="form-check-label">Active</label>
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed':'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Create Voucher"}
                        </button>
                    </div>
                    
                </form>

            </div>


        </>

    );
};

export default CreateVoucher;
