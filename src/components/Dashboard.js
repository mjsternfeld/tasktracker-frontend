// src/components/Dashboard.js
import React, {useState} from 'react';
import './Dashboard.css'; // Create a CSS file for styling

const Dashboard = () => {

    const [message, setMessage] = useState('');

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


  return (
    <div className="dashboard-container">
      <h1>Task Tracker</h1>
      <div className="button-container">
        <button className="dashboard-button" onClick={handleHelloRequest}>Hello World button</button>
        <button className="dashboard-button">Add Task</button>
        <button className="dashboard-button">Add Task-Template</button>
        <button className="dashboard-button">Settings</button>
        <button className="dashboard-button">View Task History and Statistics</button>        
      </div>
      {message && <p>{message}</p>}
    </div>
  );
};

export default Dashboard;
