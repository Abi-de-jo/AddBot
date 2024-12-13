import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginForm from "./components/LoginForm";
import FirstComponent from "./components/FirstComponent";
import SecondComponent from "./components/SecondComponent";
 import Navbar from "./components/Navbar";
import Profile from "./components/Profile"; // Import the Profile component
import Search from "./components/Search";
import Home from "./components/Home";
import Favourite from "./components/Favourite";
import CardDetails from "./components/Carddetails";

const App = () => {
  const [step, setStep] = useState(0); // Manages step state for the application
  const queryClient = new QueryClient();

  // Check if the user is authenticated by checking localStorage for email
  const isAuthenticated = localStorage.getItem("email") !== null;

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
            {/* Login Route */}
            <Route path="/" element={<LoginForm setStep={setStep} />} />

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
          </Routes>

          {/* Navbar is always displayed */}
          <Navbar />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
