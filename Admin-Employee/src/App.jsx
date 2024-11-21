import React from 'react'
import Navbar from './components/Navbar/Navbar'
import Sidebar from './components/Sidebar/Sidebar'
import {Route, Routes} from 'react-router-dom'
import AddDish from './pages/AddDish/AddDish'
import DishList from './pages/DishList/DishList'
import Orders from './pages/Orders/Orders'

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const App = () => {
  const backend_url = 'http://localhost:4000'
  return (
    <div>
      <ToastContainer />
      <Navbar />
      <hr />
      <div className="app-content">
        <Sidebar />
        <Routes>  
          <Route path='/add' element={<AddDish url={backend_url}/>} />
          <Route path='/list' element={<DishList url={backend_url}/>} />
          <Route path='/orders' element={<Orders url={backend_url}/>} />
        </Routes>
      </div>
    </div>
  )
}

export default App