import { useState, useEffect } from 'react';
import './DishList.css';
import axios from 'axios';
import {toast} from 'react-toastify';


const DishList = ({url}) => {
  const [list,setList] = useState([]);

  const fetchList = async () => {
    const response = await axios.get(`${url}/api/dish/list`);
    console.log(response);
    if(!response.data.success){
      toast.error('Dish list not found')
    }
        setList(response.data.data);
  }

  const removeFood = async (dishId) => {
    try {
      const response = await axios.post(`${url}/api/dish/delete`, {
        id: dishId
      });
      console.log(response);
      if (response.data.success) {
        toast.success('Dish removed successfully');
        await fetchList();
      } else {
        toast.error('Failed to remove dish');
      }
    } catch (error) {
      toast.error('Error removing dish');
      console.error(error);
    }
  };


  useEffect(() => {
    fetchList();

  }, [])

  return (
    <div className='list add flex-col'>

 
      <p>All Food Lists</p>
      <div className="list-table">
        <div className="list-table-format title">
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b>Action</b>
        </div>
        {
          list.map((item,index) => {
            return (
              <div key={index} className='list-table-format'>
                <img src={`${url}/images/` +item.image} alt="" />
                <p>{item.name}</p>
                <p>{item.category}</p>
                <p>{item.price}</p>
                <p onClick={() => removeFood(item._id)} className='action-button'>X</p>
              </div>
            )
          })
        }
      </div>
 
    </div>
  )
}

export default DishList