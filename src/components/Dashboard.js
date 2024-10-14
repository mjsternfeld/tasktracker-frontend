// src/components/Dashboard.js
import React, {useState} from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {


    const navigate = useNavigate();

    const handleViewTasks = async () => {
      navigate('/view-tasks');
    }

    const handleAddTask = async () => {
      navigate('/add-task');
    }

    const handleRecTasks = async () => {
      navigate('/recurring-tasks');
    }


  return (
    <div className="dashboard-container">
      <h1>Task Tracker</h1>
      <div className="button-container">
        <button className="dashboard-button" onClick={handleViewTasks}>View / Edit Tasks</button>
        <button className="dashboard-button" onClick={handleAddTask}>Add Task or Template</button>
        <button className="dashboard-button" onClick={handleRecTasks}>Add / View / Edit Recurring Tasks</button>
        <button className="dashboard-button">View Task History and Statistics</button>        
      </div>
    </div>
  );
};

export default Dashboard;
