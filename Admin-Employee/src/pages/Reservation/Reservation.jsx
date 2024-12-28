import React, { useState } from 'react';
import './Reservation.css';
import Header from './Header';
import TableView from './TableView';
import ListView from './ListView';
import moment from 'moment'; // Để xử lý ngày

function Reservation() {
    const [viewMode, setViewMode] = useState('list');
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedDate, setSelectedDate] = useState(new Date());
    const tablesPerPage = 10;

    // Dữ liệu giả lập (có ngày để lọc)
    const tables = Array.from({ length: 20 }, (_, i) => ({
        name: `Table ${i + 1}`,
    }));

    // Lọc danh sách bàn dựa trên tìm kiếm và ngày đã chọn
    const filteredTables = tables.filter((table) => {
        const searchMatch = table.name.toLowerCase().includes(searchQuery.toLowerCase());
        const dateMatch = selectedDate
            ? moment(table.date).isSame(selectedDate, 'day')
            : true; // Kiểm tra xem ngày có khớp không
        return searchMatch && dateMatch;
    });

    // Lấy các bàn trong trang hiện tại
    const totalPages = Math.ceil(filteredTables.length / tablesPerPage);
    const currentTables = filteredTables.slice(
        (currentPage - 1) * tablesPerPage,
        currentPage * tablesPerPage
    );

    return (
        <div className="container">
            <Header
                viewMode={viewMode}
                setViewMode={(mode) => {
                    setViewMode(mode);
                    setCurrentPage(1); // Reset về trang đầu
                }}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
            />
            {viewMode === 'table' ? (
                <TableView
                    currentTables={currentTables}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            ) : (
                <ListView
                    currentTables={currentTables}
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            )}
        </div>
    );
}

export default Reservation;
