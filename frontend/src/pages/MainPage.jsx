// src/pages/MainPage.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Home from '../sections/Home';
import SkillDevelopment from '../sections/SkillDevelopment';
import FoodShelter from '../sections/NutritionGuidance';
import Education from '../sections/Education';
import HealthSupport from '../sections/HealthSupport';
import DonorDashboard from '../sections/DonorDashboard';

const MainPage = () => {
  return (
    <>
      <Navbar />
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="skills" element={<SkillDevelopment />} />
          <Route path="food" element={<FoodShelter />} />
        
          <Route path="health" element={<HealthSupport />} />
          <Route path="donor" element={<DonorDashboard />} />
        </Routes>
      </div>
      <Footer />
    </>
  );
};

export default MainPage;