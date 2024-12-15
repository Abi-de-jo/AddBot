import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginForm from "./components/LoginForm";
import FirstComponent from "./components/FirstComponent";
import SecondComponent from "./components/SecondComponent";
<<<<<<< HEAD
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
=======
 import Navbar from "./components/Navbar";
import Profile from "./components/Profile"; // Import the Profile component
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
import Search from "./components/Search";
import Home from "./components/Home";
import Favourite from "./components/Favourite";
import CardDetails from "./components/Carddetails";
<<<<<<< HEAD
import Draft from "./components/Draft";
import Dashboard from "./components/Dashboard";
import AdminEmail from "./components/adminEmail";
=======
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713

const App = () => {
  const [step, setStep] = useState(0); // Manages step state for the application
  const queryClient = new QueryClient();
<<<<<<< HEAD
  const role = localStorage.getItem("role"); // Retrieve role from localStorage

  // Check if the user is authenticated by checking localStorage for email
  const isAuthenticated = !!localStorage.getItem("email"); // `!!` converts to boolean
=======

  // Check if the user is authenticated by checking localStorage for email
  const isAuthenticated = localStorage.getItem("email") !== null;
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713

  useEffect(() => {
    if (!isAuthenticated && step === 2) {
      setStep(0); // Reset step if the user is not authenticated
    }
  }, [isAuthenticated, step]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <Routes>
<<<<<<< HEAD
            {/* Default Route: Home Page */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />

            {/* Free Access Pages */}
            <Route path="/search" element={<Search />} />
            <Route path="/ads" element={<SecondComponent setStep={setStep} />} />

            {/* Login Route */}
            <Route path="/login" element={<LoginForm setStep={setStep} />} />

            {/* Restricted Pages */}
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  role === "admin" ? <AdminEmail /> : <Profile />
                ) : (
                  <Navigate to="/login" /> // Redirect to login if not authenticated
                )
              }
            />
            <Route
              path="/favorites"
              element={
                isAuthenticated ? <Favourite /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/card/:cardId"
              element={isAuthenticated ? <CardDetails /> : <Navigate to="/login" />}
            />
            <Route
              path="/dashboard"
              element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />}
            />
            <Route
              path="/draft"
              element={isAuthenticated ? <Draft /> : <Navigate to="/login" />}
            />
=======
            {/* Login Route */}
            <Route path="/" element={<LoginForm setStep={setStep} />} />
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713

            {/* Conditional Rendering for Steps */}
            <Route
              path="/main"
              element={
                isAuthenticated ? (
                  <>
                    {step === 1 && <FirstComponent setStep={setStep} />}
                    {step === 2 && <SecondComponent setStep={setStep} />}
                  </>
                ) : (
<<<<<<< HEAD
                  <Navigate to="/login" /> // Redirect to login if not authenticated
                )
              }
            />
=======
                  <Navigate to="/" /> // Redirect to login if not authenticated
                )
              }
            />

            {/* Card Details Route */}
            <Route
              path="/card/:cardId"
              element={isAuthenticated ? <CardDetails /> : <Navigate to="/" />}
            />

            {/* Additional Routes */}
            <Route
              path="/ads"
              element={
                isAuthenticated ? (
                  <SecondComponent setStep={setStep} />
                ) : (
                  <Navigate to="/" />
                )
              }
            />
            <Route
              path="/search"
              element={isAuthenticated ? <Search/> : <Navigate to="/" />}
            />
            <Route
              path="/favorites"
              element={
                isAuthenticated ? <Favourite/> : <Navigate to="/" />
              }
            />
            <Route
              path="/home"
              element={
                isAuthenticated ? <Home/> : <Navigate to="/" />
              }
            />

            {/* Profile Route */}
            <Route
              path="/profile"
              element={isAuthenticated ? <Profile /> : <Navigate to="/" />}
            />
>>>>>>> 9f26180c6a9f254a3848072cc9b365117cf52713
          </Routes>

          {/* Navbar is always displayed */}
          <Navbar />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
