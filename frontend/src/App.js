import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import DailyDebit from './pages/DailyDebit';
import MonthlyDebit from './pages/MonthlyDebit';
import MonthlyIncome from './pages/MonthlyIncome';
import Loan from './pages/Loan';
import CreditCard from './pages/CreditCard';
import CreditPerson from './pages/CreditPerson';
import DebitPerson from './pages/DebitPerson';
import OtherNote from './pages/OtherNote';
import Rules from './pages/Rules';
import StockMarket from './pages/StockMarket';
import Balance from './pages/Balance';
import PrivateRoute from './components/PrivateRoute';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
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
              path="/monthly-debit"
              element={
                <PrivateRoute>
                  <MonthlyDebit />
                </PrivateRoute>
              }
            />
            <Route
              path="/monthly-income"
              element={
                <PrivateRoute>
                  <MonthlyIncome />
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
          <ToastContainer 
            position="top-right" 
            autoClose={500}
            closeOnClick
            pauseOnHover
            theme="light"
          />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

