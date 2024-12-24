import React, { useState } from 'react'
import './Invoice.css'
import DishModal from './DishModal';

function Invoice() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const invoices = [
        { id: "I001", date: "11/2/1024", total: "58$" },
        { id: "I001", date: "11/2/1024", total: "58$" },
        { id: "I001", date: "11/2/1024", total: "58$" },
        { id: "I001", date: "11/2/1024", total: "58$" },
        { id: "I001", date: "11/2/1024", total: "58$" },
        { id: "I001", date: "11/2/1024", total: "58$" },
      ];

      const handleCreateInvoice = () => {
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };
    
      return (
        <div className="container">
          <header className="header">
            <h1>Invoices</h1>
            <button className="create-button" onClick={handleCreateInvoice}>Create Invoice</button>
          </header>
          <table className="invoice-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Table</th>
                <th>Date Time</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {invoices.map((invoice, index) => (
                <tr key={index}>
                  <td>{invoice.id}</td>
                  <td>none</td>
                  <td>{invoice.date}</td>
                  <td>{invoice.total}</td>
                  <td>
                    <button className="edit-button">
                      <span className="edit-icon">✏️</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {isModalOpen && (
                <DishModal
                    onClose={closeModal}
                />
            )}

        </div>
      );
}

export default Invoice