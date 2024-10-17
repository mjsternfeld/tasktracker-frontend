// src/App.js
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import ViewTasks from './components/ViewTasks';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask'
import RecurringTasksPage from './components/RecurringTasksPage'
import EditRecurringTaskPage from './components/EditRecurringTask';
import Login from './components/Login';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Login/>}/>
      <Route path="/dashboard" element={<Dashboard/>}/>
      <Route path="/view-tasks" element={<ViewTasks/>}/>
      <Route path="/add-task" element={<AddTask/>}/>
      <Route path="/edit-task/:taskId" element={<EditTask/>}/>
      <Route path="/recurring-tasks" element={<RecurringTasksPage />} />
      <Route path="/edit-recTask/:id" element={<EditRecurringTaskPage/>} />
      </Routes>
    </div>
  );
};

export default App;
