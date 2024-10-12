import React, { useState } from 'react';

const AddTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'inactive', // Default to "inactive"
    deadline: '',
    subtasks: [],
  });

  // Handle input changes for the task fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

  // Handle input changes for the subtasks
  const handleSubtaskChange = (index, e) => {
    const { name, value } = e.target;
    const updatedSubtasks = task.subtasks.map((subtask, i) =>
      i === index ? { ...subtask, [name]: value } : subtask
    );
    setTask({ ...task, subtasks: updatedSubtasks });
  };

  const removeSubtask = (index) => {
    const updatedSubtasks = task.subtasks.filter((_, i) => i !== index);
    setTask({ ...task, subtasks: updatedSubtasks });
  };
  

  // Add a new subtask input field
  const addSubtask = () => {
    setTask({ ...task, subtasks: [...task.subtasks, { title: '', description: '', status: 'inactive', deadline: '' }] });
  };

  // Submit the form with a POST request
  const handleSubmit = (e) => {
    e.preventDefault();

    // Example POST request
    fetch('http://localhost:8080/api/tasks/import_task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task), // Send task with subtasks as JSON
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to save task');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Task saved:', data);
        // Handle successful task save (e.g., navigate back to task list)
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  return (
    <div>
      <h1>Add Task</h1>
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
        {task.subtasks.map((subtask, index) => (
          <div key={index}>
            <label htmlFor={`title-${index}`}>Subtask {index + 1} Title:</label>
            <input
              type="text"
              id={`title-${index}`}
              name="title"
              value={subtask.title}
              onChange={(e) => handleSubtaskChange(index, e)}
            />
            
            <label htmlFor={`description-${index}`}>Description:</label>
            <input
              type="text"
              id={`description-${index}`}
              name="description"
              value={subtask.description}
              onChange={(e) => handleSubtaskChange(index, e)}
            />
            
            <label htmlFor={`subtaskStatus-${index}`}>Status:</label>
            <select
              id={`status-${index}`}
              name="status"
              value={subtask.status}
              onChange={(e) => handleSubtaskChange(index, e)}
            >
              <option value="inactive">Inactive</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
              <option value="notRelevantAnymore">Not Relevant Anymore</option>
            </select>

            <label htmlFor={`deadline-${index}`}>Deadline:</label>
            <input
              type="date"
              id={`deadline-${index}`}
              name="deadline"
              value={subtask.deadline}
              onChange={(e) => handleSubtaskChange(index, e)}
            />

            <button type="button" onClick={() => removeSubtask(index)}>Remove</button>

          </div>
        ))}

        <button type="button" onClick={addSubtask}>
          Add Subtask
        </button>

        <br />
        <button type="submit">Save</button>
      </form>
    </div>
  );
};

export default AddTask;
