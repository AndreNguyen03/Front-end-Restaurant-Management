import React from 'react'
import './InvoiceView.css'

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
                        <h3>INVOICE NUMBER: {invoiceData.customId}</h3>
                        <div className='invoice-info'>
                            <p>Table: {invoiceData.table}</p>
                            <p>Date: {convertToVietnamTime(invoiceData.createdAt)}</p>
                        </div>
                    </div>
                    <div className='separate-line'></div>
                    <table>
                        <thead>
                            <tr>
                                <th>Dish</th>
                                <th>Quantity</th>
                                <th>Price</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {(invoiceData.items).map((dish) => (
                                <tr key={dish._id}>
                                    <td>{dish.name}</td>
                                    <td>{dish.quantity}</td>
                                    <td>{dish.price}đ</td>
                                    <td>{dish.totalPrice}đ</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='separate-line'></div>
                    <h3>Total Amount: {invoiceData.total} đ</h3>
                </div>
            </div>
        </div>
    )
}

export default InvoiceView