import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Footer from './components/Footer';
import Navbar from './components/Navbar';
import NoPage from "./pages/NoPage";
import Home from './components/Home';



function App() {

  
  return (
    <div style={{ "minHeight": "100vh" }}>
      <Navbar />

      <BrowserRouter>
        
        <Routes>
          <Route path="/" element={<Home />}>

            <Route path="*" element={<NoPage />} />
          </Route>
        </Routes>

      </BrowserRouter>

      <Footer />
    </div>
  );
}

export default App;
