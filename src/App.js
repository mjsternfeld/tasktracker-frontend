// src/App.js
import React from 'react';
import {Routes, Route} from 'react-router-dom'
import ViewTasks from './components/ViewTasks';
import Dashboard from './components/Dashboard';

const App = () => {
  return (
    <div>
      <Routes>
      <Route path="/" element={<Dashboard/>}/>
      <Route path="/ViewTasks" element={<ViewTasks/>}/>
      </Routes>
    </div>
  );
};

export default App;
