import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const EditTask = () => {
    const { taskId } = useParams(); // Get taskId from URL params
    const navigate = useNavigate();
    const [task, setTask] = useState({
        title: '',
        description: '',
        status: 'inactive',
        deadline: '',
        subtasks: []
    });

    useEffect(() => {
        fetch(`http://localhost:8080/api/tasks/get_task${taskId}`)
            .then(response => response.json())
            .then(data => setTask(data))
            .catch(error => console.error('Error fetching task:', error));
    }, [taskId]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setTask({
            ...task,
            [name]: value,
        });
    };

    // Handle changes to the subtasks
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

    // Add a new blank subtask to the list
    const addSubtask = () => {
        setTask({
        ...task,
        subtasks: [...task.subtasks, { title: '', status: 'inactive' }]
        });
    };

    // Remove a subtask from the list
    const removeSubtask = (index) => {
        const updatedSubtasks = task.subtasks.filter((_, i) => i !== index);
        setTask({
        ...task,
        subtasks: updatedSubtasks,
        });
    };


    const handleSubmit = (e) => {
        e.preventDefault();
        fetch(`http://localhost:8080/api/tasks/update_task`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(task),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update task');
                }
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
    <div>
      <h1>Edit Task</h1>
      <form onSubmit={handleSubmit}>
        <div>
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
        <div>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            id="description"
            name="description"
            value={task.description}
            onChange={handleInputChange}
          />
        </div>
        <div>
          <label htmlFor="status">Status:</label>
          <select
            id="status"
            name="status"
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
        <div>
          <label htmlFor="deadline">Deadline:</label>
          <input
            type="date"
            id="deadline"
            name="deadline"
            value={task.deadline}
            onChange={handleInputChange}
          />
        </div>

        <h3>Subtasks</h3>
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
                <label htmlFor="subtaskDeadline">Subtask deadline:</label>
                <input
                    type="date"
                    id="subtaskDeadline"
                    name="subtaskDeadline"
                    value={subtask.deadline}
                    onChange={handleInputChange}
                />
              </div>
              <button type="button" onClick={() => removeSubtask(index)}>
                Remove Subtask
              </button>
            </div>
          ))
        ) : (
          <p>No subtasks available.</p>
        )}
        <button type="button" onClick={addSubtask}>
          Add Subtask
        </button>

        <div>
          <button type="submit">Save Changes</button>
        </div>
      </form>
    </div>
    );
};

export default EditTask;
