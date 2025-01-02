import React from 'react'
import './InvoiceView.css'
import formatNumber from '../../utils/FormatNumber';

function InvoiceView({ onClose, invoiceData }) {

    function convertToVietnamTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    }
    
    return (
        <div className='invoice-modal-overlay'>
            <div className='invoice-modal-content'>
                <div className='invoice-container'>
                    <div className='invoice-header'>
                        <div className='btn-component'>
                            <button className='btn-close' onClick={onClose}>X</button>
                        </div>
                        <h2 className='header'>Tomato</h2>
                        <h3>ID Hóa đơn: {invoiceData.customId}</h3>
                        <div className='invoice-info'>
                            <p>Bàn: {invoiceData.table}</p>
                            <p>Ngày: {convertToVietnamTime(invoiceData.createdAt)}</p>
                        </div>
                    </div>
                    <div className='separate-line'></div>
                    <table>
                        <thead>
                            <tr>
                                <th>Món ăn</th>
                                <th>Số lượng</th>
                                <th>Giá</th>
                                <th>Tổng tiền</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(invoiceData.items).map((dish) => (
                                <tr key={dish._id}>
                                    <td>{dish.name}</td>
                                    <td>{dish.quantity}</td>
                                    <td>{formatNumber(dish.price)} vnđ</td>
                                    <td>{formatNumber(dish.totalPrice)} vnđ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='separate-line'></div>
                    <h3>Tổng tiền hóa đơn: {formatNumber(invoiceData.total)} vnđ</h3>
                </div>
            </div>
        </div>
    )
}

export default InvoiceView