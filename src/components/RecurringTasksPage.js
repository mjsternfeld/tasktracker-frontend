import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecurringTasksPage.css'; 
const RecurringTasksPage = () => {
    const [recurringTasks, setRecurringTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        repeatInterval: 'P1D',
        nextOccurrence: '',
    });
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); //retrieve JWT from localStorage
    const backendUrl = process.env.REACT_APP_API_URL;


    //load the existing recurring tasks from the backend
    useEffect(() => {
        loadRecurringTasks();
    }, []);

    const loadRecurringTasks = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/recurring-tasks`, {
                headers:{
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok) {
                const data = await response.json();
                setRecurringTasks(data);
            } else {
                console.error('Failed to fetch recurring tasks');
            }
        } catch (error) {
            console.error('Error fetching recurring tasks:', error);
        }
    };

    //handle form submission for adding a new recurring task
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`${backendUrl}/api/recurring-tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newTask),
            });

            if (response.ok) {
                // Reload the tasks after adding a new one
                loadRecurringTasks();
                // Reset form
                setNewTask({
                    title: '',
                    description: '',
                    repeatInterval: 'P1D', // Reset to default
                    nextOccurrence: '',
                });
            } else
                console.error('Failed to add recurring task');
        } catch (error) {
            console.error('Error adding recurring task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`${backendUrl}/api/recurring-tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (response.ok)
                loadRecurringTasks(); // Reload tasks after deletion
            else
                console.error('Failed to delete recurring task');
        } catch (error) {
            console.error('Error deleting recurring task:', error);
        }
    };

    const handleEdit = async (taskId) => {
        navigate(`/edit-recTask/${taskId}`);
    };

    return (
        <div className="container">
            <h1>Recurring Tasks</h1>

            <h2>Add New Recurring Tasks</h2>
            <form onSubmit={handleSubmit}>
                <div className="add-rec-field">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                </div>
                <div className="add-rec-field">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                </div>
                <div className="add-rec-field">
                    <label>Repeat Interval:</label>
                    <select
                        className="rec-select"
                        value={newTask.repeatInterval}
                        onChange={(e) => setNewTask({ ...newTask, repeatInterval: e.target.value })}
                    >
                        <option value='P1D'>Daily</option>
                        <option value='P1W'>Weekly</option>
                        <option value='P1M'>Monthly</option>
                    </select>
                </div>
                <div className="add-rec-field">
                    <label>Starting date:</label>
                    <input
                        type="datetime-local"
                        value={newTask.nextOccurrence}
                        onChange={(e) => setNewTask({ ...newTask, nextOccurrence: e.target.value })}
                        required
                    />
                </div>
                <button className="rec-save" type="submit">Save Recurring Task</button>
            </form>

            <h2>Current Recurring Tasks</h2>
            <table>
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Repeat Interval</th>
                        <th>Next Occurrence</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {recurringTasks.map((task) => (
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>{task.description}</td>
                            <td>{task.repeatInterval}</td>
                            <td>{task.nextOccurrence}</td>
                            <td>
                                <button className="rec-actions-buttons" onClick={() => handleEdit(task.id)}>Edit</button>
                                <button className="rec-actions-buttons" onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecurringTasksPage;
