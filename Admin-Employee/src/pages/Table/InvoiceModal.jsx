import React from 'react'
import './InvoiceModal.css'

function InvoiceModal({ onClose, cartData, totalAmount }) {

    const mockDish = [
        {
            dishId: "1",
            name: "Grilled Chicken",
            quantity: 2,
            price: 10,
            amount: 20, // price * quantity
        },
        {
            dishId: "2",
            name: "Spaghetti Carbonara",
            quantity: 1,
            price: 12,
            amount: 12, // price * quantity
        },
        {
            dishId: "3",
            name: "Caesar Salad",
            quantity: 3,
            price: 8,
            amount: 24, // price * quantity
        },
        {
            dishId: "4",
            name: "Margherita Pizza",
            quantity: 1,
            price: 15,
            amount: 15, // price * quantity
        },
        {
            dishId: "5",
            name: "Tiramisu",
            quantity: 2,
            price: 6,
            amount: 12, // price * quantity
        },
    ];
    


    return (
        <div className='invoice-modal-overlay'>
            <div className='invoice-modal-content'>
                <div className='invoice-container'>
                    <div className='invoice-header'>
                        <div className='btn-component'>
                            <button className='btn-close' onClick={onClose}>X</button>
                        </div>
                        <h2 className='header'>Tomato</h2>
                        <h3>INVOICE NUMBER: I001</h3>
                        <div className='invoice-info'>
                            <p>Table: 03</p>
                            <p>Date: 5:23 - 12/03/2024</p>
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
                            {mockDish.map((dish) => (
                                <tr key={dish.dishId}>
                                    <td>{dish.name}</td>
                                    <td>{dish.quantity}</td>
                                    <td>{dish.price}$</td>
                                    <td>{dish.amount}$</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className='separate-line'></div>
                    <h3>Total Amount: 110$</h3>
                    <button className='btn-print'>Print invoice</button>
                </div>
            </div>
        </div>
    )
}

export default InvoiceModal