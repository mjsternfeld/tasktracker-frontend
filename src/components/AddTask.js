import React, { useState } from 'react';
import { useEffect } from 'react';

const AddTask = () => {
  const [task, setTask] = useState({
    title: '',
    description: '',
    status: 'inactive',
    deadline: '',
    subtasks: [],
  });

  const [templates, setTemplates] = useState([]);
  const token = localStorage.getItem('token'); //retrieve JWT from localStorage
  const backendUrl = process.env.REACT_APP_API_URL;


  const loadTemplate = (template) => {
    
    const formattedDeadline = template.deadline ? new Date(template.deadline).toISOString().split('T')[0] : ''; //to avoid the issue where the date is null when the date format isn't correct
    
    setTask({
      title: template.title,
      description: template.description,
      status: template.status,
      deadline: formattedDeadline,
      subtasks: template.subtasks || [],  //ensure that subtasks are handled even if undefined
    });
  };

  //fetch task templates from the API
  const fetchTemplates = () => {
    fetch(`${backendUrl}/api/tasks/templates`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setTemplates(data))  //save templates into state
      .catch(error => console.error('Error fetching templates:', error));
  };


  useEffect(() => {
    fetchTemplates();
  }, []); 

  //for the "normal" task fields
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setTask({
      ...task,
      [name]: value,
    });
  };

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
  

  //add a new subtask input field
  const addSubtask = () => {
    setTask({ ...task, subtasks: [...task.subtasks, { title: '', description: '', status: 'inactive', deadline: '' }] });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    //shallow copy of the task object to avoid mutating the state directly
    const taskToSubmit = {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,  
      subtasks: task.subtasks.map(subtask => {
        const { subtaskId, ...rest } = subtask;  //remove id
        return rest
      })
    };

    const token = localStorage.getItem('token');

    fetch(`${backendUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskToSubmit), //Send task with subtasks array as JSON
    })
      .then((response) => {
        if (!response.ok)
          throw new Error('Failed to save task');
        return response.json();
      })
      .then((data) => {
        console.log('Task saved:', data);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  const handleSubmitTemplate = (e) => {
    e.preventDefault();
    //shallow copy of the task object to avoid mutating the state directly
    const taskToSubmit = {
      title: task.title,
      description: task.description,
      status: task.status,
      deadline: task.deadline,
      template: true,  
      subtasks: task.subtasks.map(subtask => {
        const { subtaskId, ...rest } = subtask;  //remove ID
        return rest
      })
    };

    const token = localStorage.getItem('token');
    fetch(`${backendUrl}/api/tasks`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(taskToSubmit), //send task with subtasks array as JSON
    })
      .then((response) => {
        if (!response.ok)
          throw new Error('Failed to save template');
        return response.json();
      })
      .then((data) => {
        console.log('Template saved:', data);
        fetchTemplates();
      })
      .catch((error) => {
        console.error('Error:', error);
      });
      task.template = false;
      
  };


  const handleDeleteTemplate = (template) => {
    if (window.confirm('Are you sure you want to delete this template?')) {
        fetch(`${backendUrl}/api/tasks/${template.id}`, {
            method: 'DELETE',
            headers: {
              'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (response.ok)
                  fetchTemplates();
                else
                    console.error('Error deleting task');
            })
            .catch(error => console.error('Error:', error));
    }
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
        <button type="button" onClick={handleSubmitTemplate}>Save as Template</button>        
      </form>
    
      <h2>Or choose a template</h2>
        {templates.length === 0 ? (
            <p>No templates available.</p>
        ) : (
            <ul>
                {templates.map(template => (
                    <li key={template.id}>
                        <span>{template.title}</span>
                        <button onClick={() => loadTemplate(template)}>Use this template</button>
                        <button onClick={() => handleDeleteTemplate(template)}>Delete this template</button>
                    </li>
                ))}
            </ul>
        )}
    
    
    
    </div>
    


  );
};

export default AddTask;
