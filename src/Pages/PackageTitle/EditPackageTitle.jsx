import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import Select from 'react-select';
import 'react-toastify/dist/ReactToastify.css';

const EditPackageTitle = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        packageTitle: '',
        packages: [],
        packagesQuantity: 0
    });

    const [loading, setLoading] = useState(true);
    const [btnLoading, setBtnLoading] = useState(false);
    const [packageOptions, setPackageOptions] = useState([]);

    useEffect(() => {
        const fetchPackageTitle = async () => {
            try {
                // Fetch all available packages
                const responsePackages = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-package`);
                const availablePackages = responsePackages.data.data;

                // Fetch package title by id
                const responseTitle = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/get-all-package-title`);
                const packageTitles = responseTitle.data.data;
                const packageTitleData = packageTitles.find(title => title._id === id);
                // console.log(packageTitleData)
                if (!packageTitleData) {
                    throw new Error(`Package title with id ${id} not found`);
                }

                const { packageTitle, packages } = packageTitleData;

                // Prepare package options for Select component
                const options = availablePackages.map(pkg => ({
                    value: pkg.packageName,
                    label: pkg._id
                }));

                setPackageOptions(options);
                setFormData({
                    packageTitle: packageTitleData.packageTitle,
                    packages: packageTitleData.packagesId.map((items) => items.packageName),
                    packagesQuantity: packageTitleData.testQuantity
                });

                setLoading(false);
            } catch (error) {
                console.error('Error fetching package title:', error);
                setLoading(false);
            }
        };

        fetchPackageTitle();
    }, [id]);

    const handleChange = (event) => {
        const { name, value } = event.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const handlePackageChange = (selectedOptions) => {
        console.log(selectedOptions)
        const selectedPackages = selectedOptions ? selectedOptions.map(option => ({
            label: option.label,
            value: option.value
        })) : [];
        setFormData(prevData => ({
            ...prevData,
            packages: selectedPackages,
            packagesQuantity: selectedPackages.length
        }));
    };


    const handleSubmit = async (event) => {
        event.preventDefault();
        setBtnLoading(true);

        try {
            const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/update-package-title/${id}`, formData);
            setBtnLoading(false);
            toast.success('Package Title Updated!', {
                onClose: () => {
                    navigate('/all-package-title');
                }
            });
        } catch (error) {
            setBtnLoading(false);
            console.error('Error updating Package Title:', error);
            toast.error(error.response?.data?.message || 'An error occurred');
        }
    };

    return (
        <>
            <ToastContainer />
            <div className="bread">
                <div className="head">
                    <h4>Edit Package Title</h4>
                </div>
                <div className="links">
                    <Link to="/all-package-title" className="add-new">Back <i className="fa-regular fa-circle-left"></i></Link>
                </div>
            </div>

            <div className="d-form">
                {loading ? (
                    <p>Loading...</p>
                ) : (
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
                                value={packageOptions.filter(option => formData.packages.some(pkg => pkg.value === option.value))}
                                getOptionLabel={(option) => option.value}
                                getOptionValue={(option) => option.label}
                            />
                        </div>

                        <div className="col-md-4">
                            <label htmlFor="packagesQuantity" className="form-label">Packages Quantity</label>
                            <input type="number" name='packagesQuantity' value={formData.packagesQuantity} className="form-control" id="packagesQuantity" readOnly />
                        </div>
                        <div className="col-12 text-center">
                            <button type="submit" disabled={btnLoading} className={`${btnLoading ? 'not-allowed' : 'allowed'}`}>
                                {btnLoading ? "Please Wait..." : "Update Package Title"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
};

export default EditPackageTitle;
