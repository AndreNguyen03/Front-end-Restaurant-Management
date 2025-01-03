import React from "react";
import { useState, useEffect } from "react";
import "./Employees.css";
import axios from "axios";
import { toast } from "react-toastify";
import AddEmployee from "../../components/AddEmployeeForm/AddEmployee";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import EditEmployee from "../../components/EditEmployeeForm/EditEmployee";
import ConfirmationForm from "../../components/ConfirmationForm/ConfirmationForm";

const Employees = ({ url }) => {
  const [list, setList] = useState([]);
  const [showAddEmployee, setShowAddEmployee] = useState(false);
  const [showEditEmployee, setShowEditEmployee] = useState(false);
  const [showConfirmationForm, setShowConfirmationForm] = useState(false);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
  const fetchList = async () => {
    const response = await axios.get(`${url}/api/employee/list`);
    console.log(response);
    if (!response.data.success) {
      toast.error("Employee list not found");
      return;
    }
    setList(response.data.data);
  };
  useEffect(() => {
    fetchList();
  }, []);

  const handleAfterAdd = () => {
    setShowAddEmployee(false);
    fetchList();
  };

  const handleAfterEdit = () => {
    setShowEditEmployee(false);
    fetchList();
  };

  const removeEmployee = async (id) => {
    const response = await axios.post(`${url}/api/employee/delete`, { id });
    if (!response.data.success) {
      toast.fail("Employee deleted failed");
      return;
    }
    toast.success("Xóa nhân viên thành công");
    fetchList();
  };

  return (
    <div className="employee-list-container flex-col">
      <div className="employee-actions">
        <button
          onClick={() => setShowAddEmployee(true)}
          className="add-employee-button"
        >
          Thêm nhân viên
        </button>
      </div>

      <div className="employee-list">
        <div className="employee-list-header">
          <b>Họ và tên</b>
          <b>Số điện thoại</b>
          <b>Số định danh</b>
          <b>Vai trò</b>
          <b>Hành động</b>
        </div>
        {list.map((item, index) => {
          return (
            <div key={index} className="employee-list-row">
              <p>{item.full_name}</p>
              <p>{item.phone_number}</p>
              <p>{item.socialId}</p>
              <p>{item.employee_role}</p>
              <div className="employee-actions-icons">
                <FontAwesomeIcon
                  className="action-icon"
                  icon={faTrash}
                  onClick={() => {
                    setShowConfirmationForm(true);
                    setSelectedEmployeeId(item._id);
                  }}
                />
                <FontAwesomeIcon
                  className="action-icon"
                  icon={faEdit}
                  onClick={() => {
                    setShowEditEmployee(true);
                    setSelectedEmployeeId(item._id);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      {showConfirmationForm && (
        <ConfirmationForm
          onConfirm={() => {
            removeEmployee(selectedEmployeeId);
            setShowConfirmationForm(false);
          }}
          onCancel={() => setShowConfirmationForm(false)}
        />
      )}
      {showAddEmployee && <AddEmployee onEmployeeAdded={handleAfterAdd} />}
      {showEditEmployee && (
        <EditEmployee
          onEmployeeEdited={handleAfterEdit}
          employeeId={selectedEmployeeId}
        />
      )}
    </div>
  );
};

export default Employees;
