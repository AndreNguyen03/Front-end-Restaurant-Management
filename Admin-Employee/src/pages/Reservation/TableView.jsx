import React from 'react';
import Pagination from './Pagination';
import './TableView.css';

function generateRandomReservations(tables, startHour, endHour) {
    const reservations = {};
    const phonePrefixes = ['091', '098', '090', '093', '094'];

    tables.forEach((table) => {
        reservations[table.name] = [];

        while (reservations[table.name].length < Math.floor(Math.random() * 3) + 1) {
            const start = Math.floor(Math.random() * ((endHour - startHour) * 2)) / 2 + startHour; // Thời gian bắt đầu
            const duration = Math.floor(Math.random() * 3) + 1; // Thời lượng đặt chỗ (1-3 giờ)
            const end = Math.min(start + duration, endHour);

            // Kiểm tra trùng lặp thời gian
            const isOverlap = reservations[table.name].some(
                (res) => !(end <= res.start || start >= res.end) // Không có khoảng giao nhau
            );

            if (!isOverlap) {
                const phoneNumber = `${phonePrefixes[Math.floor(Math.random() * phonePrefixes.length)]}${Math.floor(1000000 + Math.random() * 9000000)}`;
                reservations[table.name].push({ phoneNumber, start, end });
            }
        }
    });

    return reservations;
}

function formatTime(time) {
    const hour = Math.floor(time);
    const minutes = (time % 1) === 0.5 ? '30' : '00';
    return `${hour}:${minutes}`;
}

function TableView({ currentTables, currentPage, totalPages, setCurrentPage }) {
    const reservations = generateRandomReservations(currentTables, 9, 21);

    console.log(`current Tables`, currentTables);

    const validTables = currentTables.filter((table) => table.name); // Bỏ qua bàn không có tên

    return (
        <div className="table-view">
            <table>
                <thead>
                    <tr>
                        <th>Time</th>
                        {validTables.map((table, index) => (
                            <th key={`${index}-${table.name}`}>{table.name}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {Array.from({ length: 24 }).map((_, rowIndex) => {
                        const time = 9 + rowIndex * 0.5;
                        return (
                            <tr key={rowIndex}>
                                <td>{formatTime(time)}</td>
                                {validTables.map((table, tableIndex) => {
                                    const reservation = reservations[table.name].find(
                                        (res) => res.start === time
                                    );

                                    if (reservation) {
                                        return (
                                            <td
                                                key={`${tableIndex}`}
                                                rowSpan={(reservation.end - reservation.start) * 2}
                                                style={{
                                                    backgroundColor: '#FFFACD',
                                                    textAlign: 'center',
                                                    verticalAlign: 'middle',
                                                }}
                                            >
                                                {reservation.phoneNumber}
                                            </td>
                                        );
                                    }

                                    const isPartOfSpan = reservations[table.name].some(
                                        (res) => time > res.start && time < res.end
                                    );

                                    if (!isPartOfSpan) {
                                        return <td key={`${tableIndex}`}></td>;
                                    }

                                    return null;
                                })}
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />
        </div>
    );
}

export default TableView;
