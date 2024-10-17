import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './EditRecurringTask.css';

const EditRecurringTaskPage = () => {

    const [task, setTask] = useState({
        title: '',
        description: '',
        repeatInterval: '',
        nextOccurrence: '',
        customInterval: '',
    });
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage

    
    const { id } = useParams(); // Get the task ID from the URL params
    
    const navigate = useNavigate();

    // Fetch the task details from the server
    const loadCurrentTask = async () => {
        try {
            const response = await fetch('http://localhost:8080/api/recurring-tasks/${id}', {
                method: 'GET',
                headers: {
                  'Authorization': `Bearer ${token}`
                }
              })

            if (response.ok) {
                const data = await response.json();
                setTask({
                    ...data,
                    customInterval: '', // Reset the custom interval if the task is using predefined intervals
                });
            } else {
                console.error('Failed to load recurring task');
            }
        } catch (error) {
            console.error('Error loading recurring task:', error);
        }
    };

    // Load the task data on mount and when the id changes
    useEffect(() => {
        loadCurrentTask();
    });

    // Handle the form submission to update the task
    const handleSubmit = async (e) => {
        e.preventDefault();

        // Determine the final repeat interval, handling custom intervals
        const finalRepeatInterval =
            task.repeatInterval === 'custom' ? task.customInterval : task.repeatInterval;

        const taskToSubmit = {
            ...task,
            repeatInterval: finalRepeatInterval,
        };

        try {
            const response = await fetch(`/api/recurring-tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(taskToSubmit),
            });

            if (response.ok) {
                navigate('/recurring-tasks'); // Redirect back to the recurring tasks list
            } else {
                console.error('Failed to save recurring task');
            }
        } catch (error) {
            console.error('Error saving recurring task:', error);
        }
    };

    return (
        <div className="container">
            <h1>Edit Recurring Task</h1>

            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title:</label>
                    <input
                        type="text"
                        value={task.title}
                        onChange={(e) => setTask({ ...task, title: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Description:</label>
                    <input
                        type="text"
                        value={task.description}
                        onChange={(e) => setTask({ ...task, description: e.target.value })}
                        required
                    />
                </div>

                <div>
                    <label>Repeat Interval:</label>
                    <select
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

                {task.repeatInterval === 'custom' && (
                    <div>
                        <label>Custom Interval:</label>
                        <input
                            type="text"
                            placeholder="e.g., 3h, 2d"
                            value={task.customInterval}
                            onChange={(e) => setTask({ ...task, customInterval: e.target.value })}
                            required
                        />
                    </div>
                )}

                <div>
                    <label>Next Occurrence:</label>
                    <input
                        type="datetime-local"
                        value={task.nextOccurrence}
                        onChange={(e) => setTask({ ...task, nextOccurrence: e.target.value })}
                        required
                    />
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>

    );

};

export default EditRecurringTaskPage;
