import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditRecurringTask.css';

const EditRecurringTaskPage = () => {

    const [task, setTask] = useState({
        title: '',
        description: '',
        repeatInterval: '',
        nextOccurrence: ''
    });
    const token = localStorage.getItem('token'); //retrieve the JWT token from localStorage. If there is none, all the requests will fail with 403
    const backendUrl = process.env.REACT_APP_API_URL;

    
    const { id } = useParams(); //get the task ID from the URL params
    
    const navigate = useNavigate();

    //call API to fetch the correct task
    const loadCurrentTask = async () => {
        try {
            const response = await fetch(`${backendUrl}/api/recurring-tasks/${id}`, {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })

            if (response.ok) {
                const data = await response.json();
                setTask(data);
            }else
                console.error('Failed to load recurring task');
        } catch (error) {
            console.error('Error loading recurring task:', error);
        }
    };

    //load the task data on mount and when the id changes
    useEffect(() => {
        loadCurrentTask();
    });

    //handle the form submission to update the task in the DB / backend
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch(`${backendUrl}/api/recurring-tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(task),
            });

            if (response.ok)
                navigate('/recurring-tasks'); // Redirect back to the recurring tasks list
            else
                console.error('Failed to save recurring task');
            
        } catch (error) {
            console.error('Error saving recurring task:', error);
        }
    };

    return (
        <div className="container">
            <h1>Edit Recurring Task</h1>

            <form onSubmit={handleSubmit}>
                <div className="edit-rec-field">
                    <label>Title:</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                </div>

                <div className="edit-rec-field">
                    <label>Description:</label>
                    <input
                        type="text"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        required
                    />
                </div>

                <div className="edit-rec-field">
                    <label>Repeat Interval:</label>
                    <select
                        className="status-select"
                        value={task.repeatInterval}
                        onChange={(e) => setTask({ ...task, repeatInterval: e.target.value })}
                    >
                        <option value="1h">Hourly</option>
                        <option value="1d">Daily</option>
                        <option value="1w">Weekly</option>
                        <option value="1M">Monthly</option>
                        <option value="custom">Custom</option>
                    </select>
                </div>

                <div className="edit-rec-field">
                    <label>Next Occurrence:</label>
                    <input
                        type="datetime-local"
                        value={task.nextOccurrence}
                        onChange={(e) => setTask({ ...task, nextOccurrence: e.target.value })}
                        required
                    />
                </div>

                <button className="edit-rec-save" type="submit">Save Changes</button>
            </form>
        </div>

    );

};

export default EditRecurringTaskPage;
