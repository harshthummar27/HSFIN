import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DailyDebit from './pages/DailyDebit';
import Loan from './pages/Loan';
import CreditCard from './pages/CreditCard';
import CreditPerson from './pages/CreditPerson';
import DebitPerson from './pages/DebitPerson';
import OtherNote from './pages/OtherNote';
import Rules from './pages/Rules';
import StockMarket from './pages/StockMarket';
import Balance from './pages/Balance';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route
              path="/dashboard"
              element={
                <PrivateRoute>
                  <Dashboard />
                </PrivateRoute>
              }
            />
            <Route
              path="/daily-debit"
              element={
                <PrivateRoute>
                  <DailyDebit />
                </PrivateRoute>
              }
            />
            <Route
              path="/loan"
              element={
                <PrivateRoute>
                  <Loan />
                </PrivateRoute>
              }
            />
            <Route
              path="/credit-card"
              element={
                <PrivateRoute>
                  <CreditCard />
                </PrivateRoute>
              }
            />
            <Route
              path="/credit-person"
              element={
                <PrivateRoute>
                  <CreditPerson />
                </PrivateRoute>
              }
            />
            <Route
              path="/debit-person"
              element={
                <PrivateRoute>
                  <DebitPerson />
                </PrivateRoute>
              }
            />
            <Route
              path="/other-note"
              element={
                <PrivateRoute>
                  <OtherNote />
                </PrivateRoute>
              }
            />
            <Route
              path="/rules"
              element={
                <PrivateRoute>
                  <Rules />
                </PrivateRoute>
              }
            />
            <Route
              path="/stock-market"
              element={
                <PrivateRoute>
                  <StockMarket />
                </PrivateRoute>
              }
            />
            <Route
              path="/balance"
              element={
                <PrivateRoute>
                  <Balance />
                </PrivateRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

