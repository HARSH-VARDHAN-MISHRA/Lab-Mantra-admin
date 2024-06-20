import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AddPackage = () => {
    const [formData, setData] = useState({
        packageName: '',
        testCategoryName: [],
        testQuantity: '',
        testGroupQuantity: 0, // Changed to number
        currentPrice: '',
        actualPrice: '',
        offPercentage: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [testOptions, setTestOptions] = useState([]);
    const navigate = useNavigate();

    const fetchTest = async () => {
        try {
            const testRes = await axios.get('http://localhost:6842/api/v1/get-all-test-category');
            const options = testRes.data.data.map(test => ({
                value: test._id,
                label: test.testCategoryName,
                testNumber: test.testNumber // Include testNumber in options
            }));
            setTestOptions(options);
        } catch (error) {
            console.error('There was an error fetching the test!', error);
        }
    };

    const handleCategoryNameChange = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleTestChange = (selectedOptions) => {
        const selectedTests = selectedOptions ? selectedOptions.map(option => ({
            label: option.label,
            testNumber: option.testNumber // Retrieve testNumber from selected options
        })) : [];
        
        // Calculate total test group quantity
        const totalTestGroupQuantity = selectedTests.reduce((total, test) => total + test.testNumber, 0);

        setData(prevData => ({
            ...prevData,
            testCategoryName: selectedTests.map(test => test.label),
            testQuantity: selectedTests.length.toString(),
            testGroupQuantity: totalTestGroupQuantity
        }));
    };

    const handleCurrentPriceChange = (event) => {
        const { value } = event.target;
        const currentPrice = parseFloat(value);
        const actualPrice = parseFloat(formData.actualPrice);
        if (!isNaN(currentPrice) && !isNaN(actualPrice)) {
            const offPercentage = ((actualPrice - currentPrice) / actualPrice) * 100;
            setData(prevData => ({
                ...prevData,
                currentPrice: value,
                offPercentage: isNaN(offPercentage) ? '' : offPercentage.toFixed()
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                currentPrice: value,
                offPercentage: ''
            }));
        }
    };

    const handleOffPercentageChange = (event) => {
        const { value } = event.target;
        const offPercentage = parseFloat(value);
        const actualPrice = parseFloat(formData.actualPrice);
        if (!isNaN(offPercentage) && !isNaN(actualPrice)) {
            const currentPrice = actualPrice - (actualPrice * (offPercentage / 100));
            setData(prevData => ({
                ...prevData,
                offPercentage: value,
                currentPrice: isNaN(currentPrice) ? '' : currentPrice.toFixed()
            }));
        } else {
            setData(prevData => ({
                ...prevData,
                offPercentage: value,
                currentPrice: ''
            }));
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:6842/api/v1/create-package', formData);
            setIsLoading(false);
            toast.success('Package Created', {
                onClose: () => {
                    navigate('/all-package');
                }
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        fetchTest();
    }, []);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Add Package</h4>
                </div>
                <div className="links">
                    <Link to="/all-package" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-8">
                        <label htmlFor="packageName" className="form-label">Package Name</label>
                        <input type="text" onChange={handleCategoryNameChange} name='packageName' value={formData.packageName} className="form-control" id="packageName" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="testCategoryName" className="form-label">Select Tests</label>
                        <Select
                            isMulti
                            options={testOptions}
                            onChange={handleTestChange}
                            value={testOptions.filter(option => formData.testCategoryName.includes(option.label))}
                        />
                    </div>
                    <div className="col-md-3 col-6">
                        <label htmlFor="testQuantity" className="form-label">Test Quantity</label>
                        <input type="text" readOnly name='testQuantity' value={formData.testQuantity} className="form-control" id="testQuantity" />
                    </div>
                    <div className="col-md-3 col-6">
                        <label htmlFor="testGroupQuantity" className="form-label">Test Group Quantity</label>
                        <input type="text" readOnly name='testGroupQuantity' value={formData.testGroupQuantity} className="form-control" id="testGroupQuantity" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="actualPrice" className="form-label">Actual Price</label>
                        <input type="text" onChange={handleCategoryNameChange} name='actualPrice' value={formData.actualPrice} className="form-control" id="actualPrice" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="currentPrice" className="form-label">Current Price</label>
                        <input type="text" onChange={handleCurrentPriceChange} name='currentPrice' value={formData.currentPrice} className="form-control" id="currentPrice" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="offPercentage" className="form-label">Off Percentage</label>
                        <input type="text" onChange={handleOffPercentageChange} name='offPercentage' value={formData.offPercentage} className="form-control" id="offPercentage" />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Package"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddPackage;
