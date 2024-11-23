//this page is used to edit specific tasks from the task list
//url contains the ID of the task to be edited
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './EditTask.css';

const EditTask = () => {
    const { taskId } = useParams(); //get taskId from URL params
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'inactive',
        deadline: '',
        subtasks: []
    });
    const token = localStorage.getItem('token'); //retrieve JWT from localStorage
    const backendUrl = process.env.REACT_APP_API_URL;

    //fetch task to be edited using API
    useEffect(() => {
        fetch(`${backendUrl}/api/tasks/${taskId}`, {
            headers:{
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => setTask(data))
            .catch(error => console.error('Error fetching task:', error));
    }, [taskId]);
    //update specific fields in the editor
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: value,
        });
    };
    //update specific fields in the subtask editor
    const handleSubtaskChange = (index, e) => {
        const { name, value } = e.target;
        const updatedSubtasks = [...task.subtasks];
        updatedSubtasks[index] = {
        ...updatedSubtasks[index],
        [name]: value,
        };
        setTask({
        ...task,
        subtasks: updatedSubtasks,
        });
    };

    //add a new blank subtask to the list
    const addSubtask = () => {
        setTask({
        ...task,
        subtasks: [...task.subtasks, { title: '', status: 'inactive' }]
        });
    };

    //remove a subtask from the list
    const removeSubtask = (index) => {
        const updatedSubtasks = task.subtasks.filter((_, i) => i !== index);
        setTask({
        ...task,
        subtasks: updatedSubtasks,
        });
    };

    //update task in DB
    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`${backendUrl}/api/tasks/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(task),
        })
            .then(response => {
                if (!response.ok)
                    throw new Error('Failed to update task');
                return response.json();
            })
            .then(() => {
                navigate('/view-tasks'); // Navigate back to tasks list
            })
            .catch(error => {
                console.error('Error:', error);
            });
    };

    return (
      <div className="edit-container">
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
          <div className='edit-field'>
              <label htmlFor="title">Title:</label>
              <input
                  type="text"
                  id="title"
                  name="title"
                  value={task.title}
                  onChange={handleInputChange}
                  required
              />
          </div>
          <div className='edit-field'>
              <label htmlFor="description">Description:</label>
              <input
                  type="text"
                  id="description"
                  name="description"
                  value={task.description}
                  onChange={handleInputChange}
              />
          </div>
          <div className='edit-field'>
              <label htmlFor="status">Status:</label>
              <select
                  id="status"
                  name="status"
                  className="status-select"
                  value={task.status}
                  onChange={handleInputChange}
              >
                  <option value="inactive">Inactive</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="failed">Failed</option>
                  <option value="notRelevantAnymore">Not Relevant Anymore</option>
              </select>
          </div>
          <div className='edit-field'>
              <label htmlFor="deadline">Deadline:</label>
              <input
                  type="date"
                  id="deadline"
                  name="deadline"
                  value={task.deadline}
                  onChange={handleInputChange}
              />
          </div>

          <h3 className="subtask-h3">Subtasks</h3>
          {task.subtasks.length > 0 ? (
              task.subtasks.map((subtask, index) => (
                  <div key={index}>
                      <div>
                          <label htmlFor={`subtaskTitle-${index}`}>Subtask title:</label>
                          <input
                              type="text"
                              id={`subtaskTitle-${index}`}
                              name="title"
                              value={subtask.title}
                              onChange={(e) => handleSubtaskChange(index, e)}
                          />
                      </div>
                      <div>
                          <label htmlFor={`subtaskDescription-${index}`}>Subtask description:</label>
                          <input
                              type="text"
                              id={`subtaskDescription-${index}`}
                              name="description"
                              value={subtask.description}
                              onChange={(e) => handleSubtaskChange(index, e)}
                          />
                      </div>
                      <div>
                          <label htmlFor={`subtaskStatus-${index}`}>Subtask status:</label>
                          <select
                              className="status-select"
                              id={`subtaskStatus-${index}`}
                              name="status"
                              value={subtask.status}
                              onChange={(e) => handleSubtaskChange(index, e)}
                          >
                              <option value="inactive">Inactive</option>
                              <option value="active">Active</option>
                              <option value="completed">Completed</option>
                              <option value="failed">Failed</option>
                          </select>
                      </div>
                      <div>
                          <label htmlFor={`subtaskDeadline-${index}`}>Subtask deadline:</label>
                          <input
                              type="date"
                              id={`subtaskDeadline-${index}`}
                              name="deadline"
                              value={subtask.deadline}
                              onChange={(e) => handleSubtaskChange(index, e)}
                          />
                      </div>
                      <button className="remove-button" type="button" onClick={() => removeSubtask(index)}>
                          Remove Subtask
                      </button>
                  </div>
              ))
          ) : (
              <p>No subtasks available.</p>
          )}
          <div className='buttons-container'>
              <button className="add-st-button" type="button" onClick={addSubtask}>
              Add Subtask
              </button>
              <button className="save-button" type="submit">Save Changes</button>
          </div>
      </form>
  </div>
    );
};

export default EditTask;
