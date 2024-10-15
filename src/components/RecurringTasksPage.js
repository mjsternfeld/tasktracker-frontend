import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './RecurringTasksPage.css'; // Ensure your styles are imported

const RecurringTasksPage = () => {
    const [recurringTasks, setRecurringTasks] = useState([]);
    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        repeatInterval: 'P1D',
        nextOccurrence: '',
    });
    const navigate = useNavigate();

    // Load the existing recurring tasks from the backend
    useEffect(() => {
        loadRecurringTasks();
    }, []);

    const loadRecurringTasks = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/recurring-tasks');
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

    // Handle form submission for adding a new recurring task
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:8080/api/recurring-tasks', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
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
            } else {
                console.error('Failed to add recurring task');
            }
        } catch (error) {
            console.error('Error adding recurring task:', error);
        }
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`http://localhost:8080/api/recurring-tasks/${taskId}`, {
                method: 'DELETE',
            });
            if (response.ok) {
                loadRecurringTasks(); // Reload tasks after deletion
            } else {
                console.error('Failed to delete recurring task');
            }
        } catch (error) {
            console.error('Error deleting recurring task:', error);
        }
    };

    const handleEdit = async (taskId) => {
        navigate(`/edit-recTask/${taskId}`);
    };

    return (
        <div>
            <h1>Recurring Tasks</h1>

            {/* Add New Recurring Task Form */}
            <h2>Add New Recurring Tasks</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        required
                    />
                </div>
                <div>
                    <label>Repeat Interval:</label>
                    <select
                        value={newTask.repeatInterval}
                        onChange={(e) => setNewTask({ ...newTask, repeatInterval: e.target.value })}
                    >
                        <option value='P1D'>Daily</option>
                        <option value='P1W'>Weekly</option>
                        <option value='P1M'>Monthly</option>
                    </select>
                </div>
                <div>
                    <label>Starting date:</label>
                    <input
                        type="datetime-local"
                        value={newTask.nextOccurrence}
                        onChange={(e) => setNewTask({ ...newTask, nextOccurrence: e.target.value })}
                        required
                    />
                </div>
                <button type="submit">Add Recurring Task</button>
            </form>

            {/* Recurring Tasks Table */}
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
                                <button onClick={() => handleEdit(task.id)}>Edit</button>
                                <button onClick={() => handleDelete(task.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RecurringTasksPage;
