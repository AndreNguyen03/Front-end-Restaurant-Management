import React from 'react';
import Pagination from './Pagination';
import './ListView.css'

function ListView({ currentTables, currentPage, totalPages, setCurrentPage }) {
    return (
        <div className="list-view">
            <table>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Date</th>
                        <th>Table</th>
                        <th>Name</th>
                        <th>Phone Number</th>
                        <th>Status</th>
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {currentTables.map((table, index) => (
                        <tr key={index}>
                            <td>{`R00${(currentPage - 1) * 10 + index + 1}`}</td>
                            <td>{table.date}</td>
                            <td>{table.name}</td>
                            <td>Ngọc Anh đẹp trai</td>
                            <td>0937785129</td>
                            <td>Pending</td>
                            <td>
                                <button className="edit-btn">✏️</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="pagination-container">
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                />
            </div>
        </div>
    );
}

export default ListView;
