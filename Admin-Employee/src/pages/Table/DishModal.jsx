import { useEffect, useState } from "react";
import './DishModal.css';
import axios from 'axios';
import DishItem from "./DishItem";
import SearchBar from '../../components/SearchBar/SearchBar'
import { useTableCart } from "../../context/TableContext";
import InvoiceModal from "./InvoiceModal";
import formatNumber from '../../utils/FormatNumber'

function DishModal({ tableId, onClose,tableName }) {
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
                tableName,
                cartData: cartData[tableId],
                totalAmount: totalAmount
            };
            console.log(`invoice Payload`, invoicePayload);

            const response = await axios.post(`${url}/api/invoices`, invoicePayload);
            setInvoiceData(response.data); // Lưu thông tin hóa đơn trả về
            console.log(`invoice data response: `,response.data);
            setIsModalOpen(true); // Mở modal hóa đơn
            resetCart(tableId);
        } catch (err) {
            setError(err.response?.data?.message || err.message);
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        resetCart(tableId);
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
                                <button className="button" onClick={() => resetCart(tableId)}>Đặt lại</button>
                                <button className="button" onClick={() => handleInvoiceClick()}>Hóa đơn</button>
                            </div>
                            <div className="cart">
                                <div>
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>Hình ảnh</th>
                                                <th>Tên món</th>
                                                <th>Giá</th>
                                                <th>Số lượng</th>
                                                <th>Tổng tiền</th>
                                                <th>Hành động</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {cartData[tableId]?.map(item => (
                                                <tr key={item._id}>
                                                    <td><img className='cartdish-img' src={`${url}/images/${item.image}`} alt={item.name} /></td>
                                                    <td>{item.name}</td>
                                                    <td>{formatNumber(item.price)} vnđ</td>
                                                    <td>
                                                        <input
                                                            className="quantity-input"
                                                            type="number"
                                                            min="1"
                                                            value={item.quantity}
                                                            onChange={(e) => updateQuantity(tableId, item._id, e.target.value)}
                                                        />
                                                    </td>
                                                    <td>{formatNumber(item.price * item.quantity)} vnđ</td>
                                                    <td><button onClick={() => removeFromCart(tableId, item._id)}>X</button></td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <p className="total-amount">Tổng tiền hóa đơn: {formatNumber(totalAmount)} vnđ</p>
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
