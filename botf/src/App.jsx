import { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "react-query";
import LoginForm from "./components/LoginForm";
import FirstComponent from "./components/FirstComponent";
import SecondComponent from "./components/SecondComponent";
import Navbar from "./components/Navbar";
import Profile from "./components/Profile";
import Search from "./components/Search";
import Home from "./components/Home";
import Favourite from "./components/Favourite";
import CardDetails from "./components/Carddetails";
import Draft from "./components/Draft";
import Dashboard from "./components/Dashboard";
import AdminEmail from "./components/adminEmail";
import AllAgents from "./components/AllAgents";
import AgentDraft from "./components/AgentDraft";
import AgentCard from "./components/AgentCard";
import DraftDetails from "./components/DraftDetails";
import AgentDraftDetails from "./components/AgentDraft";

const App = () => {
  const [step, setStep] = useState(0); // Manages step state for the application
  const queryClient = new QueryClient();
  const role = localStorage.getItem("role");  
  const isAuthenticated = localStorage.getItem("teleNumber");


  console.log(isAuthenticated)
  useEffect(() => {
    if (!isAuthenticated && step !== 0) {
      setStep(0); // Reset step if the user is not authenticated
    }
  }, [isAuthenticated, step]);

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ads" element={<SecondComponent setStep={setStep} />} />
            <Route path="/login" element={<LoginForm setStep={setStep} />} />

            {/* Restricted Pages */}
            <Route
              path="/profile"
              element={
                isAuthenticated ? (
                  role == "admin" ? <AdminEmail /> : <Profile />
                ) : (
                  <Navigate to="/login" />
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
              element={
                isAuthenticated ? <CardDetails /> : <Navigate to="/login" />
              }
            />
             <Route path="/agentPub/:id" element={<AgentCard />} />
             <Route path="/draft-details/:id" element={<DraftDetails />} />

            <Route
              path="/dashboard"
              element={
                isAuthenticated ? <Dashboard /> : <Navigate to="/login" />
              }
            />
            <Route
              path="/draft"
              element={
                isAuthenticated ? <Draft /> : <Navigate to="/login" />
              }
            />

            {/* Admin-Specific Routes */}
            {role === "admin" && (
              <>
                <Route path="/owner-draft" element={<Draft />} />
                <Route path="/agent-draft" element={<AgentDraft />} />
                <Route path="/analytics" element={<Dashboard />} />
                <Route path="/agents-list" element={<AllAgents />} />
                <Route path="/draft-details/:id" element={<AgentDraftDetails />} />

              </>
            )}

            {/* Conditional Rendering for Steps */}
            <Route
              path="/main"
              element={
                isAuthenticated ? (
                  step === 1 ? (
                    <FirstComponent setStep={setStep} />
                  ) : step === 2 ? (
                    <SecondComponent setStep={setStep} />
                  ) : (
                    <Navigate to="/home" /> // Default to home if step is not defined
                  )
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Catch-All Route */}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>

          {/* Navbar is always displayed */}
          <Navbar />
        </div>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
