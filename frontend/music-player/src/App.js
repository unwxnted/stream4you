import React from 'react';
import './App.css';
import MusicPlayer from './components/MusicPlayer';
import SignUp from './components/SignUp';
import MusicSearcher from './components/MusicSearcher';
import MusicUploader from './components/MusicUploader';

function App() {
  return (
    <div className="App">
      <h1>Music Streaming API</h1>
      <SignUp />
      <hr></hr>
      <MusicUploader />
      <hr></hr>
      <MusicSearcher />
      <hr></hr>
      <MusicPlayer />
    </div>
  );
}

export default App;
