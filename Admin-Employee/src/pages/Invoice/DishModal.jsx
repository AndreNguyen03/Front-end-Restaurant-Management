import { useEffect, useState } from "react";
import './DishModal.css';
import axios from 'axios';
import DishItem from "./DishItem";
import SearchBar from '../../components/SearchBar/SearchBar'
import InvoiceModal from "./InvoiceModal";

function DishModal({ onClose,updateInvoices }) {
    const url = 'http://localhost:3056';
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cartData, setCartData] = useState([]);
    const [invoiceData,setInvoiceData] = useState(null);

    const filteredFoodList = dishes.filter((item) => {
        const isSearchMatch = item.name
            .toLowerCase()
            .startsWith(searchQuery.toLowerCase());
        return isSearchMatch;
    });


    const handleInvoiceClick = async () => {
        try {
            // Lấy dữ liệu giỏ hàng và tổng số tiền để gửi lên server
            const invoicePayload = {
                cartData: cartData,
                totalAmount: totalAmount
            };
            console.log(`invoice Payload`, invoicePayload);

            const response = await axios.post(`${url}/api/invoices`, invoicePayload);
            setInvoiceData(response.data); // Lưu thông tin hóa đơn trả về
            console.log(`invoice data response: `,response.data);
            updateInvoices(response.data.metadata)
            setIsModalOpen(true); // Mở modal hóa đơn
            resetCart();
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        async function fetchAllDish() {
            try {
                const response = await axios.get(`${url}/api/dish/list`);
                setDishes(response.data.data);
            } catch (err) {
                setError(err.response?.data?.message || err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchAllDish()

        document.body.style.overflow = 'hidden';
        return () => {
            // Mở lại cuộn khi đóng modal
            document.body.style.overflow = 'auto';
        };
    }, [])


    const addToCart = (dish) => {
        setCartData((prevData) => {
            const updatedCart = [...prevData]; // Sao chép giỏ hàng hiện tại
            // Kiểm tra xem món đã có trong giỏ hàng chưa
            const existingItem = updatedCart.find((item) => item._id === dish._id);
            if (existingItem) {
                existingItem.quantity += 1; // Tăng số lượng nếu món đã có
            } else {
                updatedCart.push({ ...dish, quantity: 1 }); // Thêm món mới vào giỏ
            }
            return updatedCart; // Trả về mảng mới
        });
    };


    const updateQuantity = (dishId, newQuantity) => {
        setCartData((prevData) => {
            return prevData.map((item) =>
                item._id === dishId
                    ? { ...item, quantity: newQuantity > 0 ? newQuantity : item.quantity }
                    : item
            );
        });
    };


    // Xóa món khỏi giỏ hàng
    const removeFromCart = (dishId) => {
        setCartData((prevData) => prevData.filter((item) => item._id !== dishId));
    };


    // Reset giỏ hàng của một bàn
    const resetCart = () => {
        setCartData([]); // Đặt lại giỏ hàng về trạng thái ban đầu
    };


    const totalAmount = cartData.reduce((sum, item) => sum + item.price * item.quantity, 0);

    return (
        <>
            <div className="modal-overlay" >
                <div className="modal-content" >
                    <div className="modal-header">
                        <SearchBar setSearchQuery={setSearchQuery} />
                        <button className="close-button" onClick={onClose}>X</button>
                    </div>
                    <div className="modal-body" onWheel={(e) => e.stopPropagation()}>
                        <div className="dishes-list">
                            {filteredFoodList.map((dish) => (
                                <div key={dish._id}>
                                    <DishItem name={dish.name} description={dish.description} price={dish.price} image={`${url}/images/` + dish.image} onClick={() => addToCart(dish)} />
                                </div>
                            ))}
                        </div>
                        <div className="cart-container">
                            <div className="button-component">
                                <button className="button" onClick={() => resetCart()}>Reset</button>
                                <button className="button" onClick={() => handleInvoiceClick()}>Invoice</button>
                            </div>
                            <div className="cart">
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Items</th>
                                                <th>Title</th>
                                                <th>Price</th>
                                                <th>Quantity</th>
                                                <th>Total</th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData?.map(item => (
                                                <tr key={item._id}>
                                                    <td><img className='cartdish-img' src={`${url}/images/${item.image}`} alt={item.name} /></td>
                                                    <td>{item.name}</td>
                                                    <td>${item.price}</td>
                                                    <td>
                                                        <input
                                                            className="quantity-input"
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(item._id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>${item.price * item.quantity}</td>
                                                    <td><button onClick={() => removeFromCart(item._id)}>X</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className="total-amount">Total Amount: ${totalAmount}</p>
                        </div>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <InvoiceModal
                    onClose={closeModal}
                    invoiceData={invoiceData}
                />
            )}
        </>
    );
}

export default DishModal;
