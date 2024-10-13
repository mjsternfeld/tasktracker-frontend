// src/components/Dashboard.js
import React, {useState} from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';

const Dashboard = () => {

    const [message, setMessage] = useState('');

    const navigate = useNavigate();

    const handleHelloRequest = async () => {
        try{
            const response = await fetch('http://localhost:8080/hello');
            const data = await response.text();
            setMessage(data);
        }catch(error){
            console.error('Error fetching data: ', error);
            setMessage('Error fetching data');
        }
    }

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
        <button className="dashboard-button" onClick={handleHelloRequest}>Hello World button</button>
        <button className="dashboard-button" onClick={handleViewTasks}>View / Edit Tasks</button>
        <button className="dashboard-button" onClick={handleAddTask}>Add Task or Template</button>
        <button className="dashboard-button" onClick={handleRecTasks}>Add / View / Edit Recurring Tasks</button>
        <button className="dashboard-button">View Task History and Statistics</button>        
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
