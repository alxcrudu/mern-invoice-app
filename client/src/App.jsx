import { Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Invoice from "./pages/Invoice";
import Layout from "./pages/Layout";
import Invoices from "./pages/Invoices";
import Dashboard from "./pages/Dashboard";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route exact path="/" element={<Login />} />
      <Route exact path="/signup" element={<Signup />} />
      <Route element={<Layout />}>
        <Route exact path="/home" element={<Invoices />} />
        <Route exact path="/invoice" element={<Invoice />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
