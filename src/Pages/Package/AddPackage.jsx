import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Select from 'react-select';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddPackage = () => {
    const [formData, setFormData] = useState({
        packageName: '',
        testCategoryIds: [],
        testQuantity: 0,
        testGroupQuantity: 0,
        actualPrice: '',
        offPercentage: '',
        currentPrice: ''
    });

    const [isLoading, setIsLoading] = useState(false);
    const [testOptions, setTestOptions] = useState([]);
    const navigate = useNavigate();

    // Handle input change for non-select inputs
    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));

        if (name === 'actualPrice' || name === 'offPercentage') {
            const { actualPrice, offPercentage } = formData;
            const calculatedCurrentPrice = calculateCurrentPrice(
                name === 'actualPrice' ? value : actualPrice,
                name === 'offPercentage' ? value : offPercentage
            );
            setFormData(prevState => ({
                ...prevState,
                currentPrice: calculatedCurrentPrice
            }));
        }
    };

    // Function to calculate currentPrice based on actualPrice and offPercentage
    const calculateCurrentPrice = (actualPrice, offPercentage) => {
        const parsedActualPrice = parseFloat(actualPrice);
        const parsedOffPercentage = parseFloat(offPercentage);

        if (!isNaN(parsedActualPrice) && !isNaN(parsedOffPercentage) && parsedOffPercentage >= 1 && parsedOffPercentage <= 100) {
            const currentPrice = parsedActualPrice - (parsedActualPrice * (parsedOffPercentage / 100));
            return currentPrice.toFixed();
        }
        return '';
    };

    // Handle change for Select component
    const handleTestChange = (selectedOptions) => {
        const selectedCategoryIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
        const selectedTests = selectedOptions ? selectedOptions.map(option => ({
            label: option.label,
            testNumber: option.testNumber
        })) : [];

        const totalTestQuantity = selectedTests.length;
        const totalTestGroupQuantity = selectedTests.reduce((total, test) => total + test.testNumber, 0);

        setFormData(prevState => ({
            ...prevState,
            testCategoryIds: selectedCategoryIds,
            testQuantity: totalTestQuantity,
            testGroupQuantity: totalTestGroupQuantity
        }));

        const updatedOptions = testOptions.map(option => ({
            ...option,
            selectedCount: selectedCategoryIds.includes(option.value) ? selectedTests.filter(test => test.label === option.label).length : 0
        }));
        setTestOptions(updatedOptions);
    };

    // Handle form submission
    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validate required fields
        if (!formData.packageName || formData.testCategoryIds.length === 0 || !formData.actualPrice) {
            toast.error('Please provide all required fields: Package Name, Test Categories, Actual Price');
            return;
        }

        setIsLoading(true);

        try {
            const response = await axios.post('http://localhost:6842/api/v1/create-package', formData);
            setIsLoading(false);
            toast.success('Package Created', {
                onClose: () => navigate('/all-package')
            });
        } catch (error) {
            setIsLoading(false);
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    // Fetch test categories on component mount
    useEffect(() => {
        const fetchTestCategories = async () => {
            try {
                const response = await axios.get('http://localhost:6842/api/v1/get-all-test-category');
                const options = response.data.data.map(category => ({
                    value: category._id,
                    label: category.testCategoryName,
                    testNumber: category.testNumber,
                    selectedCount: 0
                }));
                setTestOptions(options);
            } catch (error) {
                console.error('Error fetching test categories:', error);
            }
        };

        fetchTestCategories();
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
                        <input type="text" onChange={handleInputChange} name="packageName" value={formData.packageName} className="form-control" id="packageName" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="testCategoryIds" className="form-label">Select Tests</label>
                        <Select
                            isMulti
                            options={testOptions.map(option => ({
                                ...option,
                                label: `${option.label} (${option.selectedCount}/${option.testNumber} selected)`
                            }))}
                            onChange={handleTestChange}
                            value={testOptions.filter(option => formData.testCategoryIds.includes(option.value))}
                        />
                    </div>
                    <div className="col-md-3 col-6">
                        <label htmlFor="testQuantity" className="form-label">Test Quantity</label>
                        <input type="text" readOnly name="testQuantity" value={formData.testQuantity} className="form-control" id="testQuantity" />
                    </div>
                    <div className="col-md-3 col-6">
                        <label htmlFor="testGroupQuantity" className="form-label">Test Group Quantity</label>
                        <input type="text" readOnly name="testGroupQuantity" value={formData.testGroupQuantity} className="form-control" id="testGroupQuantity" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="actualPrice" className="form-label">Actual Price</label>
                        <input type="text" onChange={handleInputChange} name="actualPrice" value={formData.actualPrice} className="form-control" id="actualPrice" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="currentPrice" className="form-label">Current Price</label>
                        <input type="text" readOnly name="currentPrice" value={formData.currentPrice} className="form-control" id="currentPrice" />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="offPercentage" className="form-label">Off Percentage</label>
                        <input type="text" onChange={handleInputChange} name="offPercentage" value={formData.offPercentage} className="form-control" id="offPercentage" />
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
