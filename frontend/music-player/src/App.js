import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import SignUp from './components/SignUp';
import SignIn from './components/SignIn';
import MusicUploader from './components/MusicUploader';
import Music from './components/Music';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/upload" element={<MusicUploader />} />
        <Route path="/music" element={<Music />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
