import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AddTestCategory = () => {
    const [formData, setData] = useState({
        testCategoryName: '',
        testId: [],
        testNumber: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [testOptions, setTestOptions] = useState([]);
    const navigate = useNavigate();

    const fetchTest = async () => {
        try {
            const testRes = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-test`);
            const options = testRes.data.data.map(test => ({
                value: test._id,
                label: test.testName
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
        setData(prevData => ({
            ...prevData,
            testId: selectedOptions ? selectedOptions.map(option => option.value) : []
        }));
    };

    useEffect(() => {
        fetchTest();
    }, []);

    useEffect(() => {
        setData(prevData => ({
            ...prevData,
            testNumber: formData.testId.length
        }));
    }, [formData.testId]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setIsLoading(true);
        try {
            const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/create-test-category`, formData);
            setIsLoading(false);
            toast.success('Test Category Created', {
                onClose: () => {
                    navigate('/all-test-category');
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
                    <h4>Add Test Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-test-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-8">
                        <label htmlFor="testCategoryName" className="form-label">Test Category Name</label>
                        <input type="text" onChange={handleCategoryNameChange} name='testCategoryName' value={formData.testCategoryName} className="form-control" id="testCategoryName" />
                    </div>
                    <div className="col-md-8">
                        <label htmlFor="testName" className="form-label">Select Tests</label>
                        <Select
                            isMulti
                            options={testOptions}
                            onChange={handleTestChange}
                            value={testOptions.filter(option => formData.testId.includes(option.value))}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="testNumber" className="form-label">Test Quantity</label>
                        <input type="number" name='testNumber' value={formData.testNumber} className="form-control" id="testNumber" readOnly />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Test Category"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
};

export default AddTestCategory;
