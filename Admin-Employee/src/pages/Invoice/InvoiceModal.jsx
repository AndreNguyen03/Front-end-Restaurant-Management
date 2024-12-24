import React from 'react'
import './InvoiceModal.css'

function InvoiceModal({ onClose, invoiceData }) {

    const mockDish = [
        { name: "Greek Salad", quantity: 1, price: 14, amount: 14 },
        { name: "Chicken Rolls", quantity: 2, price: 14, amount: 14 },
        { name: "Peri Peri Rolls", quantity: 2, price: 14, amount: 14 },
        { name: "Greek Salad", quantity: 2, price: 14, amount: 14 },
        { name: "Greek Salad", quantity: 2, price: 14, amount: 14 },
    ]

    return (
        <div className='invoice-modal-overlay'>
            <div className='invoice-modal-content'>
                <div className='invoice-container'>
                    <div className='invoice-header'>
                        <div className='btn-component'>
                            <button className='btn-close' onClick={onClose}>X</button>
                        </div>
                        <h2 className='header'>Tomato</h2>
                        <h3>INVOICE NUMBER: {invoiceData.metadata.customId}</h3>
                        <div className='invoice-info'>
                            <p>Table: {invoiceData.metadata.table}</p>
                            <p>Date: {invoiceData.metadata.createdAt}</p>
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
                            {invoiceData.metadata.items.map((dish) => (
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
                    <h3>Total Amount: {invoiceData.metadata.total}đ</h3>
                    <button className='btn-print'>Print invoice</button>
                </div>
            </div>
        </div>
    )
}

export default InvoiceModal