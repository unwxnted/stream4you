import React from 'react';
import './App.css';
import MusicPlayer from './components/MusicPlayer';
import SignUp from './components/SignUp';
import MusicSearcher from './components/MusicSearcher';

function App() {
  return (
    <div className="App">
      <SignUp />
      <hr></hr>
      <MusicSearcher />
      <hr></hr>
      <MusicPlayer />
    </div>
  );
}

export default App;
