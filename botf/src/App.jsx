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
  const queryClient = new QueryClient();

  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <div className="app-container">
          <Routes>
            {/* Public Pages */}
            <Route path="/" element={<Home />} />
            <Route path="/home" element={<Home />} />
            <Route path="/search" element={<Search />} />
            <Route path="/ads" element={<SecondComponent />} />

            {/* Unrestricted Pages */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/favorites" element={<Favourite />} />
            <Route path="/card/:cardId" element={<CardDetails />} />
            <Route path="/agentPub/:id" element={<AgentCard />} />
            <Route path="/draft-details/:id" element={<DraftDetails />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/draft" element={<Draft />} />

            {/* Admin-Specific Routes (Now Accessible to Everyone) */}
            <Route path="/owner-draft" element={<Draft />} />
            <Route path="/agent-draft" element={<AgentDraft />} />
            <Route path="/analytics" element={<Dashboard />} />
            <Route path="/agents-list" element={<AllAgents />} />
            <Route path="/draft-details/:id" element={<AgentDraftDetails />} />

            {/* Steps Conditional Rendering */}
            <Route path="/main" element={<FirstComponent />} />
            <Route path="/main-2" element={<SecondComponent />} />

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
