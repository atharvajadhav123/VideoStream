import { useState } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NavLink } from "react-router-dom";
import Genre from './Genre';
import Navbar from './Navbar';
import Home from './Home';
import './App.css';
import VideoPage from './VideoPage';
function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/Genre' element={<Genre />} />
          <Route path='/VideoPage/:name/:id' element={<VideoPage />} />
        </Routes>
      </BrowserRouter>;


    </>
  )
}

export default App
