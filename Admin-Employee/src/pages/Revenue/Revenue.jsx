import React, { useState, useEffect } from 'react';
import './Revenue.css';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const Revenue = () => {
  const [data, setData] = useState({
    totalRevenue: 0,
    todayRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    chartData: [],
  });
  const [month, setMonth] = useState('');

  const url = 'http://localhost:3056';

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    fetchRevenue();
  }, []);

  // Fetch dữ liệu biểu đồ khi thay đổi tháng
  useEffect(() => {
    fetchChartData();
  }, [month]);

  const fetchRevenue = async () => {
    try {
      console.log('Fetching revenue data...');
      const response = await axios.get(`${url}/api/revenue/revenue`);
      console.log('Revenue response:', response.data);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching revenue data:', error);
      alert('Error fetching revenue data. Please check the backend logs.');
    }
  };
  
  
  const fetchChartData = async () => {
    try {
      const response = await axios.get(`${url}/api/revenue/revenue?month=${month}`);
      setData((prevData) => ({
        ...prevData,
        chartData: response.data.chartData,
      }));
    } catch (error) {
      console.error('Error fetching chart data:', error);
      alert('Error fetching chart data. Please check the backend logs.');
    }
  };

  const handleMonthChange = (e) => setMonth(e.target.value);

  const chartOptions = {
    responsive: true,
    plugins: { legend: { position: 'top' } },
  };

  const chartData = {
    labels: data.chartData.map((item) => item.week),
    datasets: [
      {
        label: `Doanh thu trong ${month || 'tháng này'}`,
        data: data.chartData.map((item) => item.revenue),
        fill: true,
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  };

  return (
    <div className="revenue-page">
      <div className="revenue-header">
        <div className="revenue-box-total">
          <h3>Tổng doanh thu</h3>
          <p>{data.totalRevenue.toFixed(0)} vnđ</p>
        </div>
        <div className="revenue-box today">
          <h3>Doanh thu hôm nay</h3>
          <p>{data.todayRevenue.toFixed(0)} vnđ</p>
        </div>
        <div className="revenue-box weekly">
          <h3>Doanh thu tuần này</h3>
          <p>{data.weeklyRevenue.toFixed(0)} vnđ</p>
        </div>
        <div className="revenue-box monthly">
          <h3>Doanh thu tháng này</h3>
          <p>{data.monthlyRevenue.toFixed(0)} vnđ</p>
        </div>
      </div>

      <div className="revenue-graph">
        <div className="month-picker">
          <label htmlFor="month">Tháng:</label>
          <input
            type="month"
            id="month"
            value={month}
            onChange={handleMonthChange}
          />
        </div>
        <Line data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default Revenue;
