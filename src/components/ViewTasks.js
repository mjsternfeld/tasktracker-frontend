//this page / component is used to show all of the user's tasks, with buttons for the edit / delete functionality for each task
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './ViewTasks.css';

const ViewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();
    const token = localStorage.getItem('token'); //retrieve JWT from localStorage
    const backendUrl = process.env.REACT_APP_API_URL;


    useEffect(() => {
        fetch(`${backendUrl}/api/tasks`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []);

    //navigate to an edit page for the specific task with that ID
    const handleEdit = (taskId) => {
        navigate(`/edit-task/${taskId}`);
    };
    //deleting a task with confirmation dialog
    const handleDelete = (taskId) => {
        if (window.confirm('Are you sure you want to delete this task?')) {
            fetch(`${backendUrl}/api/tasks/${taskId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
                .then(response => {
                    if (response.ok)
                        setTasks(tasks.filter(task => task.id !== taskId)); //remove the deleted task from the tasks list
                    else
                        console.error('Error deleting task');
                })
                .catch(error => console.error('Error:', error));
        }
    }; 


    return (
        <div className="container">
            <h1>Tasks List</h1>
            {tasks.length === 0 ? (
                <p>No tasks available.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Title</th>
                            <th>Description</th>
                            <th>Subtasks</th>
                            <th>Status</th>
                            <th>Deadline</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tasks.map(task => (
                            <tr key={task.id}>
                                <td>{task.id}</td>
                                <td>{task.title}</td>
                                <td>{task.description}</td>
                                <td>
                                    {task.subtasks.length > 0 ? (
                                        <ul>
                                            {task.subtasks.map(subtask => (
                                                <li key={subtask.subtaskId}>{subtask.title}</li>
                                            ))}
                                        </ul>
                                    ) : (
                                        <span>No subtasks</span>
                                    )}
                                </td>
                                <td>{task.status}</td>
                                <td>{task.deadline}</td>
                                <td>
                                <button className="action-buttons" onClick={() => handleEdit(task.id)}>Edit</button>
                                <button className="action-buttons" onClick={() => handleDelete(task.id)}>Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewTasks;
