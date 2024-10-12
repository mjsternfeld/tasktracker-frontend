import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ViewTasks = () => {
    const [tasks, setTasks] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        fetch('http://localhost:8080/api/tasks/get_tasks')
            .then(response => response.json())
            .then(data => setTasks(data))
            .catch(error => console.error('Error fetching tasks:', error));
    }, []); // Empty dependency array means this runs once on mount


    const handleEdit = (taskId) => {
        navigate(`/edit-task/${taskId}`);
    };    


    return (
        <div>
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
                                <button onClick={() => handleEdit(task.id)}>Edit</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default ViewTasks;
