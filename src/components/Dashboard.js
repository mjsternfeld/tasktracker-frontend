//this page lists all of the user's active tasks and links to other features
//also contains a dialog for marking tasks as complete / changing a task's status in general
import React, {useState, useEffect} from 'react';
import './Dashboard.css';
import { useNavigate } from 'react-router-dom';


const Dashboard = () => {

    const [tasks, setTasks] = useState([]);
    const token = localStorage.getItem('token'); //retrieve JWT from localStorage
    const backendUrl = process.env.REACT_APP_API_URL;

    useEffect(() => {
        fetchTasks();
    }, []);

    //call tasks API to fetch all of the user's tasks, then filter them by "active" status
    const fetchTasks = () => {
      fetch(`${backendUrl}/api/tasks`, {
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


    const [isDialogOpen, setIsDialogOpen] = useState(false); //track if the dialog is open
    const [selectedTask, setSelectedTask] = useState(null); //track which task is being updated
    const [newStatus, setNewStatus] = useState(''); //track the selected status from the new status dialog

    //opens a dialog for updating a task's status
    const handleComplete = async (task) => {
      setSelectedTask(task)  
      setIsDialogOpen(true);
    }

    //updates the task's status to the new status set in the dialog by calling the API
    const handleSubmit = async () => {
      const updatedTask = {
        ...selectedTask,
        status: newStatus, //update only the status
      };
      try {
          const response = await fetch(`${backendUrl}/api/tasks/${updatedTask.id}`, {
              method: 'PUT',
              headers: {
                  'Content-Type': 'application/json',
                  'Authorization': `Bearer ${token}`
              },
              body: JSON.stringify(updatedTask),
          });

          if (response.ok) {
              console.log('Task status updated successfully!');
              setIsDialogOpen(false); //close dialog after success
          } else
              console.error('Failed to update task status');
      } catch (error) {
          console.error('Error updating task status:', error);
      }
      fetchTasks(); //update tasks to visually confirm the status was changed
    };

    const handleCancel = () => {
        setIsDialogOpen(false); //close the dialog without making changes
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


  return (
    <div className="container">
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
                            <th></th>
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
                                <td><button className="dashboard-button complete-button" onClick={() => handleComplete(task)}>Complete task</button></td>
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
