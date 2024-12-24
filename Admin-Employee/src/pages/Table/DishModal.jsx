import { useEffect, useState } from "react";
import './DishModal.css';
import axios from 'axios';
import DishItem from "./DishItem";
import SearchBar from '../../components/SearchBar/SearchBar'
import { useTableCart } from "../../context/TableContext";
import InvoiceModal from "./InvoiceModal";

function DishModal({ tableId, onClose }) {
    const url = 'http://localhost:3056';
    const { cartData, addToCart, updateQuantity, removeFromCart, resetCart } = useTableCart();
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [invoiceData, setInvoiceData] = useState(null);

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
                tableId,
                cartData: cartData[tableId],
                totalAmount: totalAmount
            };
            console.log(`invoice Payload`, invoicePayload);

            const response = await axios.post(`${url}/api/invoices`, invoicePayload);
            setInvoiceData(response.data); // Lưu thông tin hóa đơn trả về
            console.log(`invoice data response: `,response.data);
            setIsModalOpen(true); // Mở modal hóa đơn
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


    const totalAmount = cartData[tableId]?.reduce((sum, item) => sum + item.price * item.quantity, 0);


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
                                    <DishItem name={dish.name} description={dish.description} price={dish.price} image={`${url}/images/` + dish.image} onClick={() => addToCart(tableId, dish)} />
                                </div>
                            ))}
                        </div>
                        <div className="cart-container">
                            <div className="button-component">
                                <button className="button" onClick={() => resetCart(tableId)}>Reset</button>
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
                                            {cartData[tableId]?.map(item => (
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
                                                            onChange={(e) => updateQuantity(tableId, item._id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>${item.price * item.quantity}</td>
                                                    <td><button onClick={() => removeFromCart(tableId, item._id)}>X</button></td>
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
                    cartData={cartData[tableId]}  
                    totalAmount={totalAmount}
                />
            )}
        </>
    );
}

export default DishModal;
