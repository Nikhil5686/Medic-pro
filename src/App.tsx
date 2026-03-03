import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import CalculatorPage from "./pages/CalculatorPage";
import DrugSelection from "./pages/DrugSelection";
import EmergencyDrugs from "./pages/EmergencyDrugs";
import Patients from "./pages/Patients";
import PatientInput from "./pages/PatientInput";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/calculator" element={<CalculatorPage />} />
          <Route path="/drugs" element={<DrugSelection />} />
          <Route path="/emergency" element={<EmergencyDrugs />} />
          <Route path="/patients" element={<Patients />} />
          <Route path="/patient/new" element={<PatientInput />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <BottomNav />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
