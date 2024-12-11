import { useEffect, useState } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';
import LoginForm from './components/LoginForm';
import FirstComponent from './components/FirstComponent';
import SecondComponent from './components/SecondComponent';
import CardDetails from './components/Carddetails';
 
const App = () => {
  const [step, setStep] = useState(0);
  const queryClient = new QueryClient();
  const telegram = window.Telegram.WebApp;
  useEffect(()=>{

    telegram.ready()
  })
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <Routes>
          <Route path="/" element={
            <>
              {step === 0 && <LoginForm setStep={setStep} />}
              {step === 1 && <FirstComponent setStep={setStep} />}
              {step === 2 && <SecondComponent setStep={setStep} />}
            </>
          } />
          <Route path="/card/:cardId" element={<CardDetails />} />
        </Routes>
      </QueryClientProvider>
    </BrowserRouter>
  );
};

export default App;
