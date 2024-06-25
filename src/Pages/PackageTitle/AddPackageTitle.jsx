import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const AddPackageTitle = () => {
    const navigate = useNavigate();
    const [formData, setData] = useState({
        packageTitle: '',
        packages: [],
        packagesQuantity: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [packageOptions, setPackageOptions] = useState([]);

    const fetchPackages = async () => {
        try {
            const response = await axios.get('http://localhost:6842/api/v1/get-all-package');
            const options = response.data.data.map(pkg => ({
                value: pkg._id,
                label: pkg.packageName
            }));
            setPackageOptions(options);
        } catch (error) {
            console.error('There was an error fetching the packages!', error);
        }
    };

    useEffect(() => {
        fetchPackages();
    }, []);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePackageChange = (selectedOptions) => {
        console.log(selectedOptions)
        const selectedPackages = selectedOptions ? selectedOptions.map(option => option.value) : [];
        console.log(selectedPackages)
        setData(prevData => ({
            ...prevData,
            packages: selectedPackages,
            packagesQuantity: selectedPackages.length
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        // Validation
        if (!formData.packageTitle || formData.packages.length === 0) {
            toast.error('Please submit all fields');
            return;
        }

        setIsLoading(true);
        try {
            const response = await axios.post('http://localhost:6842/api/v1/create-package-title', formData);
            setIsLoading(false);
            toast.success("Package Title Added", {
                onClose: () => {
                    navigate('/all-package-title');
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
                    <h4>Add Package Title</h4>
                </div>
                <div className="links">
                    <Link to="/all-package-title" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                <form className="row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                        <label htmlFor="packageTitle" className="form-label">Package Title</label>
                        <input type="text" onChange={handleChange} name='packageTitle' value={formData.packageTitle} className="form-control" id="packageTitle" />
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="packages" className="form-label">Select Packages</label>
                        <Select
                            isMulti
                            options={packageOptions}
                            onChange={handlePackageChange}
                            value={packageOptions.filter(option => formData.packages.includes(option.value))}
                        />
                    </div>
                    <div className="col-md-4">
                        <label htmlFor="packagesQuantity" className="form-label">Packages Quantity</label>
                        <input type="number" name='packagesQuantity' value={formData.packagesQuantity} className="form-control" id="packagesQuantity" readOnly />
                    </div>
                    <div className="col-12 text-center">
                        <button type="submit" disabled={isLoading} className={`${isLoading ? 'not-allowed' : 'allowed'}`}>
                            {isLoading ? "Please Wait..." : "Add Package Title"}
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}

export default AddPackageTitle;
