// src/App.jsx
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './pages/mainpage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/*" element={<MainPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;