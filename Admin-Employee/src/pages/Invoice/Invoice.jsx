import React, { useEffect, useState } from 'react';
import './Invoice.css';
import DishModal from './DishModal';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import axios from 'axios';
import InvoiceView from './InvoiceView';
import ReactPaginate from 'react-paginate';

function Invoice() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 12;
  const url = 'http://localhost:3056';

  function convertToVietnamTime(dateString) {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
  }

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axios.get(`${url}/api/invoices`, {
          params: { date: selectedDate.toISOString() },
        });
        setInvoices(response.data.metadata);
      } catch (error) {
        console.error("Có lỗi xảy ra khi lấy dữ liệu hóa đơn", error);
      }
    };

    fetchInvoices();
  }, [selectedDate]);

  const filteredInvoices = invoices
    .filter((invoice) =>
      invoice.customId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.table?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const pageCount = Math.ceil(filteredInvoices.length / itemsPerPage);
  const offset = currentPage * itemsPerPage;
  const currentItems = filteredInvoices.slice(offset, offset + itemsPerPage);

  const handlePageClick = ({ selected }) => {
    setCurrentPage(selected);
  };

  const handleRowClick = (invoice) => {
    setSelectedInvoice(invoice);
    setIsInvoiceModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);
  const closeInvoiceModal = () => setIsInvoiceModalOpen(false);

  return (
    <div className="container">
      <header className="header">
        <div className='left-header-component'>
          <h1>Invoices</h1>
          <input
            type="text"
            placeholder="Search by ID or Table..."
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date || new Date())}
            dateFormat="yyyy-MM-dd"
            className="date-picker"
            popperPlacement="bottom-start"
          />
        </div>
        <button className="create-button" onClick={() => setIsModalOpen(true)}>
          Create Invoice
        </button>
      </header>

      <table className="invoice-table">
        <thead>
          <tr>
            <th>#</th>
            <th>ID</th>
            <th>Table</th>
            <th>Date Time</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((invoice, index) => (
            <tr key={index} style={{ cursor: 'pointer' }} onClick={() => handleRowClick(invoice)}>
              <td>{offset + index + 1}</td>
              <td>{invoice.customId}</td>
              <td>{invoice.table || "none"}</td>
              <td>{convertToVietnamTime(invoice.createdAt)}</td>
              <td style={{ color: `#65A425` }}>{invoice.total} đ</td>
            </tr>
          ))}
        </tbody>
      </table>

      <ReactPaginate
        previousLabel={"Prev"}
        nextLabel={"Next"}
        breakLabel={"..."}
        pageCount={pageCount}
        marginPagesDisplayed={2}
        pageRangeDisplayed={3}
        onPageChange={handlePageClick}
        containerClassName={"pagination"}
        activeClassName={"active"}
        previousClassName={"prev-button"}
        nextClassName={"next-button"}
        disabledClassName={"disabled"}
      />

      {isModalOpen && (
        <DishModal
          onClose={closeModal}
          updateInvoices={(newInvoice) => setInvoices([...invoices, newInvoice])}
        />
      )}

      {isInvoiceModalOpen && (
        <InvoiceView
          onClose={closeInvoiceModal}
          invoiceData={selectedInvoice}
        />
      )}
    </div>
  );
}

export default Invoice;
