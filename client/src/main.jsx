import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import './index.css';
import Layout from './components/Layout';
import Home from './pages/Home';
import About from './pages/About';
import Services from './pages/Services';
import ServiceDetails from './pages/ServiceDetails';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Team from './pages/Team';
import TeamMemberDetails from './pages/TeamMemberDetails';
import TeamWorkDetails from './pages/TeamWorkDetails';
import AdminLogin from './admin/AdminLogin';
import Dashboard from './admin/Dashboard';

const Protected = ({ children }) =>
  localStorage.getItem('adminToken') ? children : <Navigate to="/admin/login" />;

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Toaster
        position="top-center"
        toastOptions={{
          style: {
            background: '#111',
            color: '#fff',
            border: '1px solid #D6A83A',
          },
        }}
      />

      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:id" element={<ServiceDetails />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/team" element={<Team />} />
          <Route path="/team/:id" element={<TeamMemberDetails />} />
          <Route path="/team/:id/works/:workId" element={<TeamWorkDetails />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Protected><Dashboard /></Protected>} />
        <Route path="/admin/team" element={<Protected><Dashboard initialTab="team" /></Protected>} />
        <Route
          path="/admin/team/:id"
          element={
            <Protected>
              <Dashboard initialTab="team" />
            </Protected>
          }
        />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
