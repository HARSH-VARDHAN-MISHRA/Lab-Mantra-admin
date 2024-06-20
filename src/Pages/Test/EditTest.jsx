import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EditTest = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        testName: '',
        actualPrice: '',
        discountPrice: '',
        discountPercentage: ''

    });

    const [loading, setLoading] = useState(true); // Add loading state
    const [btnLoading, setBtnLoading] = useState(false);

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

    const handleFetch = async () => {
        try {
            const res = await axios.get(`http://localhost:6842/api/v1/get-all-test`);
            const tests = res.data.data;
            const filterData = tests.filter((item) => item._id === id);
            if (filterData.length > 0) {
                setData({
                    testName: filterData[0].testName,
                    actualPrice: filterData[0].actualPrice,
                    discountPrice: filterData[0].discountPrice,
                    discountPercentage: filterData[0].discountPercentage
                });
            }
            setLoading(false); // Set loading to false after data is fetched
        } catch (error) {
            console.error('Error fetching Tests:', error);
            setLoading(false); // Set loading to false even if there's an error
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true)

        try {
            const response = await axios.put(`http://localhost:6842/api/v1/update-test/${id}`, formData);
            setBtnLoading(false);
            // toast.success("Test Updated Successfully!");
            toast.success('Test Updated Successfully!', {
                onClose: () => {
                    navigate('/all-test');
                }
            });
        } catch (error) {
            setBtnLoading(false)
            console.error('Error updating Test:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        handleFetch();
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Test</h4>
                </div>
                <div className="links">
                    <Link to="/all-test" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
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
                            <button type="submit" className={`${btnLoading ? 'not-allowed' : 'allowed'}`} >{btnLoading ? "Please Wait.." : "Update Test"} </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditTest;
