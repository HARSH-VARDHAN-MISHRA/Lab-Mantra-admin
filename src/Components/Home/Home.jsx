import React from 'react'
import { Route,Routes } from 'react-router-dom'
import Header from '../Header/Header'
import Dashboard from '../../Pages/Dashboard/Dashboard'
import AllTest from '../../Pages/Test/AllTest'
import AddTest from '../../Pages/Test/AddTest'
import EditTest from '../../Pages/Test/EditTest'
import AllPackageTitle from '../../Pages/PackageTitle/AllPackageTitle'
import AddPackageTitle from '../../Pages/PackageTitle/AddPackageTitle'
import EditPackageTitle from '../../Pages/PackageTitle/EditPackageTitle'
import AllTestCategory from '../../Pages/TestCategory/AllTestCategory'
import AddTestCategory from '../../Pages/TestCategory/AddTestCategory'
import EditTestCategory from '../../Pages/TestCategory/EditTestCategory'
import AllPackage from '../../Pages/Package/AllPackage'
import AddPackage from '../../Pages/Package/AddPackage'
import EditPackage from '../../Pages/Package/EditPackage'
import AddLaboratory from '../../Pages/Laboratory/AddLaboratory'
import AllLaboratory from '../../Pages/Laboratory/AllLaboratory'
import AllUser from '../../Pages/Users/AllUser'
import AllVoucher from '../../Pages/Vouchers/AllVoucher'
import CreateVoucher from '../../Pages/Vouchers/AddVoucher'
import AllOrders from '../../Pages/Orders/AllOrders'
import Login from '../Auth/Login'
import AddLaboratoryBranch from '../../Pages/LaboratoryBranch/AddLaboratoryBranch'
import AllLaboratoryBranch from '../../Pages/LaboratoryBranch/AllLaboratoryBranch'
import ErrorPage from '../../Pages/Error/ErrorPage'
import AllEnquiry from '../../Pages/Enquiry/AllEnquiry'
import AllCity from '../../Pages/City/AllCity'


const Home = () => {

  const labadminToken = sessionStorage.getItem("labadminToken")
  console.log(labadminToken);
  return (
    <>

    {labadminToken ? (
      <>
        <Header/>
      <div className="rightside">
        <Routes>
          <Route path={"/dashboard"} element={<Dashboard/>}/>

          {/* Category --  */}
          <Route path={"/all-test"} element={<AllTest/>}/>
          <Route path={"/add-test"} element={<AddTest/>}/>
          <Route path={"/edit-test/:id"} element={<EditTest/>}/>

          {/* --- Package Title --- */}
          <Route path={"/all-package-title"} element={<AllPackageTitle/>}/>
          <Route path={"/add-package-title"} element={<AddPackageTitle/>}/>
          <Route path={"/edit-package-title/:id"} element={<EditPackageTitle/>}/>

          {/* --- Test Category --- */}
          <Route path={"/all-test-category"} element={<AllTestCategory/>}/>
          <Route path={"/add-test-category"} element={<AddTestCategory/>}/>
          <Route path={"/edit-test-category/:id"} element={<EditTestCategory/>}/>

          {/* --- Packages --- */}
          <Route path={"/all-package"} element={<AllPackage/>}/>
          <Route path={"/add-package"} element={<AddPackage/>}/>
          <Route path={"/edit-package/:id"} element={<EditPackage/>}/>

          {/* --- Laboratory --- */}
          <Route path={"/all-laboratory"} element={<AllLaboratory/>}/>
          <Route path={"/add-laboratory"} element={<AddLaboratory/>}/>
          {/* <Route path={"/edit-package/:id"} element={<EditPackage/>}/> */}

          {/* --- Laboratory Branch --- */}
          <Route path={"/all-laboratory-branch"} element={<AllLaboratoryBranch/>}/>
          <Route path={"/add-laboratory-branch"} element={<AddLaboratoryBranch/>}/>

          {/* --- Users --- */}
          <Route path={"/all-users"} element={<AllUser/>}/>

          {/* --- Vouchers --- */}
          <Route path={"/all-voucher"} element={<AllVoucher/>}/>   {/* // All Vouchers */}
          <Route path={"/add-voucher"} element={<CreateVoucher/>}/>

          {/* --- Orders --- */}
          <Route path={"/all-orders"} element={<AllOrders/>}/>

          {/* --- Cities --- */}
          <Route path={"/all-city"} element={<AllCity/>}/>

          <Route path={"/all-enquiry"} element={<AllEnquiry/>}/>
          <Route path={"/*"} element={<ErrorPage/>}/>
        </Routes>
      </div>
      </>
    ) : (
      <Routes>
        <Route path={"/"} element={<Login/>}/>
        <Route path={"/*"} element={<ErrorPage/>}/>
      </Routes>
    )}
    
      

    </>
  )
}

export default Home