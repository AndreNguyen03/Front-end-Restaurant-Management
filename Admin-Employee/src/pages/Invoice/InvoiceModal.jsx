import React, { useRef } from 'react'
import './InvoiceModal.css'
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function InvoiceModal({ onClose, invoiceData }) {

    const ref = useRef();

    function convertToVietnamTime(dateString) {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });
    }


    // Hàm in và tạo PDF
    const handlePrint = () => {
        html2canvas(ref.current, { scale: window.devicePixelRatio }).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF('p', 'mm', 'a6'); // Tạo PDF với khổ A4
    
            // Lấy kích thước thực tế của canvas
            const pageWidth = pdf.internal.pageSize.getWidth();
            const pageHeight = pdf.internal.pageSize.getHeight();
            const canvasWidth = canvas.width;
            const canvasHeight = canvas.height;
    
            // Tỷ lệ để vừa với trang A4
            const scale = Math.min(pageWidth / canvasWidth, pageHeight / canvasHeight);
    
            const imgWidth = canvasWidth * scale; // Chiều rộng ảnh trong PDF
            const imgHeight = canvasHeight * scale; // Chiều cao ảnh trong PDF
    
            pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    
            // Xuất PDF ra dạng blob
            const pdfBlob = pdf.output('blob');
    
            // Tạo URL cho PDF
            const pdfUrl = URL.createObjectURL(pdfBlob);
    
            // Mở PDF trong tab mới
            window.open(pdfUrl, '_blank');
        });
    };
    
    return (
        <div className='invoice-modal-overlay'>
            <div className='invoice-modal-content'>
                {/* Đặt nút đóng, modal content và nút in vào trong một div */}
                <div className='modal-inner'>
                    <div className='btn-component'>
                        <button className='btn-close' onClick={onClose}>X</button>
                    </div>
                    <div className='invoice-container' ref={ref}>
                        <div className='invoice-header'>
                            <h2 className='header'>Tomato</h2>
                            <h3>INVOICE NUMBER: {invoiceData.metadata.customId}</h3>
                            <div className='invoice-info'>
                                <p>Table: {invoiceData.metadata.table}</p>
                                <p>Date: {convertToVietnamTime(invoiceData.metadata.createdAt)}</p>
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
                                    <tr key={dish.dish}>
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
                    </div>
                    {/* Nút Print */}
                    <button className='btn-print' onClick={handlePrint}>Print invoice</button>
                </div>
            </div>
        </div>
    )
}

export default InvoiceModal
