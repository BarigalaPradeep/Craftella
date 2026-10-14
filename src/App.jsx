import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';
import About from './pages/About';
import Location from './pages/Location';
import BookTickets from './pages/BookTickets';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { PaymentCardProvider } from './context/PaymentCardContext';

export default function App() {
  return (
    <PaymentCardProvider>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Home />} />
          <Route path="about" element={<About />} />
          <Route path="location" element={<Location />} />
          <Route path="book-tickets" element={<BookTickets />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="admin/login" element={<AdminLogin />} />
          {/* Aliases & Fallbacks */}
          <Route path="login" element={<Navigate to="/admin/login" replace />} />
          <Route path="book" element={<Navigate to="/book-tickets" replace />} />
          <Route path="dashboard" element={<Navigate to="/book-tickets" replace />} />
          <Route path="user-dashboard" element={<Navigate to="/book-tickets" replace />} />
          {/* Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </PaymentCardProvider>
  );
}
