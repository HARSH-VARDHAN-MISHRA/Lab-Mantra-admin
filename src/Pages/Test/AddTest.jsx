import axios from 'axios';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddTest = () => {
    const [formData, setData] = useState({
        testName: '',
        actualPrice: '',
        discountPrice: '',
        discountPercentage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setData(prevData => {
            let newData = {
                ...prevData,
                [name]: type === 'checkbox' ? checked : value
            };

            const actualPrice = parseFloat(newData.actualPrice);

            if (name === 'discountPercentage') {
                let discountPercentage = parseFloat(value);
                if (value !== '' && (discountPercentage < 1 || discountPercentage > 99)) {
                    discountPercentage = discountPercentage < 2 ? 2 : 99;
                }
                newData.discountPercentage = isNaN(discountPercentage) ? '' : Math.floor(discountPercentage);

                if (!isNaN(discountPercentage) && !isNaN(actualPrice)) {
                    newData.discountPrice = Math.round(actualPrice - (actualPrice * discountPercentage / 100));
                } else {
                    newData.discountPrice = '';
                }
            } else if (name === 'discountPrice') {
                const discountPrice = parseFloat(value);
                if (!isNaN(discountPrice) && !isNaN(actualPrice)) {
                    const discountPercentage = Math.floor((actualPrice - discountPrice) / actualPrice * 100);
                    newData.discountPercentage = discountPercentage >= 2 && discountPercentage <= 99 ? discountPercentage : '';
                } else {
                    newData.discountPercentage = '';
                }
                newData.discountPrice = isNaN(discountPrice) ? '' : Math.round(discountPrice);
            } else if (name === 'actualPrice') {
                if (!isNaN(actualPrice)) {
                    const discountPercentage = parseFloat(newData.discountPercentage);
                    const discountPrice = parseFloat(newData.discountPrice);

                    if (!isNaN(discountPercentage)) {
                        newData.discountPrice = Math.round(actualPrice - (actualPrice * discountPercentage / 100));
                    } else if (!isNaN(discountPrice)) {
                        newData.discountPercentage = Math.floor((actualPrice - discountPrice) / actualPrice * 100);
                    }
                } else {
                    newData.discountPrice = '';
                    newData.discountPercentage = '';
                }
            }

            return newData;
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        console.log(formData);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-test`, formData);
            console.log(response.data);
            setIsLoading(false);

            // toast.success("Test Created Successfully !!");
            toast.success('Test Created Successfully', {
                onClose: () => {
                    navigate('/all-test');
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
                    <h4>Add Test</h4>
                </div>
                <div className="links">
                    <Link to="/all-test" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-8">
                        <label htmlFor="testName" className="form-label">Test Name</label>
                        <input type="text" onChange={handleChange} name='testName' value={formData.testName} className="form-control" id="testName" />
                    </div>
                    <div className="col-md-4"></div>
                    <div className="col-md-3">
                        <label htmlFor="actualPrice" className="form-label">Actual Price</label>
                        <input type="number" onChange={handleChange} name='actualPrice' value={formData.actualPrice} className="form-control" id="actualPrice" />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="discountPrice" className="form-label">Discount Price</label>
                        <input type="number" onChange={handleChange} name='discountPrice' value={formData.discountPrice} className="form-control" id="discountPrice" />
                    </div>
                    <div className="col-md-3">
                        <label htmlFor="discountPercentage" className="form-label">Discount Percentage</label>
                        <input type="number" onChange={handleChange} name='discountPercentage' value={formData.discountPercentage} className="form-control" id="discountPercentage" />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>{isLoading ? "Please Wait..." : "Add Test"}</button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTest;
