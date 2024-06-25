import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Select from 'react-select';

const EditTestCategory = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setData] = useState({
        testCategoryName: '',
        testId: [],
        testNumber: 0
    });

    const [isLoading, setIsLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [testOptions, setTestOptions] = useState([]);

    const fetchTest = async () => {
        try {
            const testRes = await axios.get('http://localhost:6842/api/v1/get-all-test');
            const options = testRes.data.data.map(test => ({
                value: test._id,
                label: test.testName
            }));
            setTestOptions(options);
        } catch (error) {
            console.error('There was an error fetching the tests!', error);
        }
    };

    const fetchTestCategory = async () => {
        try {
            const response = await axios.get(`http://localhost:6842/api/v1/get-all-test-category`);
            const resData = response.data.data;
            const filterData = resData.filter((item) => item._id === id);
            if (filterData.length > 0) {
                const testCategory = filterData[0];
                setData({
                    testCategoryName: testCategory.testCategoryName,
                    testId: testCategory.testId.map(test => test._id),
                    testNumber: testCategory.testId.length
                });
            }
            setIsLoading(false);
        } catch (error) {
            console.error('There was an error fetching the test category!', error);
            setIsLoading(false);
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
            testId: selectedOptions ? selectedOptions.map(option => option.value) : [],
            testNumber: selectedOptions ? selectedOptions.length : 0
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);

        try {
            await axios.put(`http://localhost:6842/api/v1/update-test-category/${id}`, formData);
            setBtnLoading(false);
            toast.success('Test Category Updated!', {
                onClose: () => {
                    navigate('/all-test-category');
                }
            });
        } catch (error) {
            setBtnLoading(false);
            console.error('Error updating Test Category:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    useEffect(() => {
        fetchTest();
        fetchTestCategory();
    }, [id]);

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Test Category</h4>
                </div>
                <div className="links">
                    <Link to="/all-test-category" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {isLoading ? (
                    <p>Loading...</p>
                ) : (
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
                            <button type="submit" disabled={btnLoading} className={`${btnLoading ? 'not-allowed' : 'allowed'}`}>
                                {btnLoading ? "Please Wait.." : "Update Test Category"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditTestCategory;
