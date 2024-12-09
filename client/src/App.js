import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import './pages/css/App.css';
import { UserProvider } from './context/UserContext';
import TopBar from './pages/TopBar';
import Landing from "./pages/Landing";
import Gameform from "./pages/Gameform";
import Shelf from "./pages/Shelf";
import Game from "./pages/Game";
import Result from "./pages/Result";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import GStudio from "./pages/GStudio";
import Platform from "./pages/Platform";
import AdminTools from "./pages/Admintools";
import Genre from "./pages/GameGenre";

function App() {
  return (
    <UserProvider>
      <div className="App">
        <BrowserRouter>
          <TopBar />
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/profile/:username" element={<Profile />} />
            <Route path="/result" element={<Result />} />
            <Route path="/gameform" element={<Gameform />} />
            <Route path="/game/:gameTitle" element={<Game />} />
            <Route path="/shelf/:username" element={<Shelf />} />
            <Route path="/login" element={<Login />} />
            <Route path="/game_studio/:studioName" element={<GStudio />} />
            <Route path="/Platform/:platformName" element={<Platform />} />
            <Route path="/Genre/:genreName" element={<Genre />} />
            <Route path="/AdminTools" element={<AdminTools />}></Route>
          </Routes>
        </BrowserRouter>
      </div>
    </UserProvider>
  );
}

export default App;
