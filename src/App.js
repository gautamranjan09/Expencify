import "./App.css";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import UserProfile from "./components/UserProfile";
import Header from "./components/Header";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase";
import { DotLoader } from "react-spinners";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading)
    return (
      <div className="loader-wrapper">
        <DotLoader color="#2970ff" />
      </div>
    );

  if (!user) {
    return <Navigate to="/" />;
  }

  return children;
};

function App() {
  const [user] = useAuthState(auth);

  return (
    <>
      <ToastContainer />
      <BrowserRouter>
        <Routes>
          {/* Redirect to /dashboard if user is logged in and tries to access / */}
          <Route path="/" element={user ? <Navigate to="/dashboard" /> : <Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Header />
                <UserProfile />
              </ProtectedRoute>
            }
          />
          {/* Catch-all route to redirect unrecognized paths to "/" */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
