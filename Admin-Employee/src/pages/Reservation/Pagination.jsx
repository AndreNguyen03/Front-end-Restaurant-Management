import React from 'react';
import './Pagination.css';

function Pagination({ currentPage, totalPages, setCurrentPage }) {
    return (
        <div className="pagination">
            <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
            >
                Trước
            </button>
            <span>
                Trang {currentPage} - {totalPages}
            </span>
            <button
                onClick={() =>
                    setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={currentPage === totalPages}
            >
                Sau
            </button>
        </div>
    );
}

export default Pagination;
