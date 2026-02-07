import { Routes, Route, Navigate } from "react-router-dom";
import Signup from "./pages/signup";
import BankConnection from "./pages/BankConnection";
import Dashboard from "./pages/Dashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/signup" />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/bank-connection" element={<BankConnection />} />
      <Route path="/dashboard" element={<Dashboard />} />
    </Routes>
  );
}
