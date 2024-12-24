import React, { useEffect, useState } from 'react'
import DishModal from './DishModal';
import './Table.css'

function TableLayout() {
    const mock_table = [
        { id: 1, name: "table 1" },
        { id: 2, name: "table 2" },
        { id: 3, name: "table 3" },
        { id: 4, name: "table 4" },
        { id: 5, name: "table 5" },
        { id: 6, name: "table 6" },
        { id: 7, name: "table 7" },
        { id: 8, name: "table 8" },
        { id: 9, name: "table 9" },
        { id: 10, name: "table 10" },
        { id: 11, name: "table 11" },
        { id: 12, name: "table 12" },
    ]

    const [selectedTable, setSelectedTable] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        
    },[])

    const handleTableClick = (tableId) => {
        setSelectedTable(tableId);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
    };

    return (
        <div className='table-container'>
            {mock_table.map((table) => (
                <div key={table.id}>
                    <button className='table-btn' onClick={() => handleTableClick(table.id)}>
                        {table.name}
                    </button>
                </div>
            ))}

            {isModalOpen && (
                <DishModal
                    tableId={selectedTable}
                    onClose={closeModal}
                />
            )}
        </div>
    )
}

export default TableLayout