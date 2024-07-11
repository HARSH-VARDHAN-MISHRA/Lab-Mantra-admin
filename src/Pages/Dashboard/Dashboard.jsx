import React from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

const Dashboard = () => {
  const navigate = useNavigate();

  const categories = [
    {
      label: 'Tests',
      actions: [
        { path: '/all-test', label: 'All Tests' },
        { path: '/add-test', label: 'Add Test' }
      ]
    },
    {
      label: 'Package Titles',
      actions: [
        { path: '/all-package-title', label: 'All Package Titles' },
        { path: '/add-package-title', label: 'Add Package Title' }
      ]
    },
    {
      label: 'Test Categories',
      actions: [
        { path: '/all-test-category', label: 'All Test Categories' },
        { path: '/add-test-category', label: 'Add Test Category' }
      ]
    },
    {
      label: 'Packages',
      actions: [
        { path: '/all-package', label: 'All Packages' },
        { path: '/add-package', label: 'Add Package' }
      ]
    },
    {
      label: 'Laboratories',
      actions: [
        { path: '/all-laboratory', label: 'All Laboratories' },
        { path: '/add-laboratory', label: 'Add Laboratory' }
      ]
    },
    {
      label: 'Laboratory Branches',
      actions: [
        { path: '/all-laboratory-branch', label: 'All Laboratory Branches' },
        { path: '/add-laboratory-branch', label: 'Add Laboratory Branch' }
      ]
    },
    {
      label: 'Users',
      actions: [
        { path: '/all-users', label: 'All Users' }
      ]
    },
    {
      label: 'Vouchers',
      actions: [
        { path: '/all-voucher', label: 'All Vouchers' },
        { path: '/add-voucher', label: 'Add Voucher' }
      ]
    },
    {
      label: 'Orders',
      actions: [
        { path: '/all-orders', label: 'All Orders' }
      ]
    }
  ];

  return (
    <div className="container">
      <h2 className="text-center mb-4" style={{ color: 'var(--bg-dark-blue)' }}>Welcome To Lab Mantra Admin Panel</h2>
      <div className="row mt-3">
        {categories.map((category, index) => (
          <div key={index} className="col-md-4 mb-4">
            <div className="card  shadow-sm" style={{ backgroundColor: 'var(--bg-light-greenblue)', borderRadius: '10px' }}>
              <div className="card-body">
                <h5 className="card-title text-center" style={{ color: 'var(--bg-dark-blue)' }}>{category.label}</h5>
                <div className="d-flex justify-content-between flex-wrap">
                  {category.actions.map((action, idx) => (
                    <button
                      key={idx}
                      className="btn m-2"
                      style={{ backgroundColor: 'var(--bg-light-green)', color: 'var(--bg-dark-blue)', flex: '1 1 45%' , borderColor : 'var(--bg-greenblue)' }}
                      onClick={() => navigate(action.path)}
                    >
                      {action.label}
                    </button>
                  ))}
                </div>

              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
