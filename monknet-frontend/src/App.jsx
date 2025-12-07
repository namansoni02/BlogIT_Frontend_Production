import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import SignUpPage from "./pages/SignUpPage.jsx";
import LoginBox from "./components/auth/LoginBox";
export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginBox />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="*" element={<LoginPage />} />
    </Routes>
  );  
}
