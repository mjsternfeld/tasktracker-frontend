// src/App.js
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import ViewTasks from './components/ViewTasks';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask'

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/view-tasks" element={<ViewTasks/>}/>
      <Route path="/add-task" element={<AddTask/>}/>
      <Route path="/edit-task/:taskId" element={<EditTask/>}/>
      </Routes>
    </div>
  );
};

export default App;
