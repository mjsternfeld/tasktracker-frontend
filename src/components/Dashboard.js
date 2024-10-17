// src/components/Dashboard.js
import React, {useState, useEffect} from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem('token'); // Retrieve the JWT token from localStorage



    useEffect(() => {
        fetchTasks();
    }, []); // Empty dependency array means this runs once on mount


    const fetchTasks = () => {
      fetch('http://localhost:8080/api/tasks', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(response => response.json())
      .then(data => {
        const activeTasks = data.filter(task => task.status === 'active');
        setTasks(activeTasks)})
      .catch(error => console.error('Error fetching tasks:', error));
    };


    const [isDialogOpen, setIsDialogOpen] = useState(false); // Track if the dialog is open
    const [selectedTask, setSelectedTask] = useState(null); // Track which task is being updated
    const [newStatus, setNewStatus] = useState(''); // Track the selected status

    const handleComplete = async (task) => {
      setSelectedTask(task)  
      setIsDialogOpen(true); // Open the dialog
    }

    const handleSubmit = async () => {
      const updatedTask = {
        ...selectedTask,
        status: newStatus, // Update the status while keeping other fields unchanged
      };
      try {
          const response = await fetch(`http://localhost:8080/api/tasks/${updatedTask.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedTask),
          });

          if (response.ok) {
              console.log('Task status updated successfully!');
              setIsDialogOpen(false); // Close the dialog after success
              // Optionally reload tasks or update task list in the UI here
          } else {
              console.error('Failed to update task status');
          }
      } catch (error) {
          console.error('Error updating task status:', error);
      }
      fetchTasks();
    };

    const handleCancel = () => {
        setIsDialogOpen(false); // Close the dialog without making changes
    };



    //navigation
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
    const handleStats = async () => {
      navigate('/dashboard');
    }


  return (
    <div className="dashboard-container">
      <h1>Task Tracker</h1>
      
      <div className='highlightTasks'>
      <div>
            
            {tasks.length === 0 ? (
                <p>No active tasks.</p>
            ) : (
                <table border="1">
                    <thead>
                        <tr>
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
                                <button className="dashboard-button complete-button" onClick={() => handleComplete(task)}>Complete task</button>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>

      {isDialogOpen && (
                <div className="dialog">
                    <h3>Update Task Status</h3>
                    <label htmlFor="status">Select new status:</label>
                    <select
                        id="status"
                        value={newStatus}
                        onChange={(e) => setNewStatus(e.target.value)}
                    >
                        <option value="">Select status</option>
                        <option value="completed">Completed</option>
                        <option value="inactive">Inactive</option>
                        <option value="failed">Failed</option>
                        <option value="notRelevantAnymore">Not relevant anymore</option>
                    </select>
                    <br />
                    <button onClick={handleSubmit}>Confirm</button>
                    <button onClick={handleCancel}>Cancel</button>
                </div>
            )}

      <div className="button-container">
        <button className="dashboard-button" onClick={handleViewTasks}>View / Edit all Tasks</button>
        <button className="dashboard-button" onClick={handleAddTask}>Add Task or Template</button>
        <button className="dashboard-button" onClick={handleRecTasks}>Add / View / Edit Recurring Tasks</button> 
      </div>
    </div>
  );
};

export default Dashboard;
