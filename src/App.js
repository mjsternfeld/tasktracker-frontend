// src/App.js
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import ViewTasks from './components/ViewTasks';
import Dashboard from './components/Dashboard';
import AddTask from './components/AddTask';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/ViewTasks" element={<ViewTasks/>}/>
      <Route path="/AddTask" element={<AddTask/>}/>
      </Routes>
    </div>
  );
};

export default App;
