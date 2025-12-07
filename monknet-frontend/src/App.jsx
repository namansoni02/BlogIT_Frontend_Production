import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginBox from "./components/auth/LoginBox";
import ProtectedRoute from "./components/auth/ProtectedRoute.jsx";
import Dashboard from "./pages/Dashboard.jsx";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginBox />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<LoginPage />} />
      <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    </Routes>
  );  
}
