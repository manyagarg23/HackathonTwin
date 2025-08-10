import React from 'react'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AdminHackPortal from '../Pages/AdminHackPortal.jsx'
import AdminSignUp from '../Pages/AdminSignUp.jsx'
import AdminDashboard from '../Pages/AdminDashboard.jsx'
import Homepage from '../Pages/Homepage.jsx'
import HackathonPage from '../Pages/HackathonPage.jsx'
import ChatInterface from '../Components/ChatInterface.jsx'

import "./App.css"

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/adminsignup" element={<AdminSignUp />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/adminhack" element={<AdminHackPortal />} />
        <Route path="/dummyhack" element={<HackathonPage />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="*" element={<Homepage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App