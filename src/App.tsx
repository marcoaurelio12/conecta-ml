
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Checklist from "./pages/Checklist";
import Learning from "./pages/Learning";
import NotFound from "./pages/NotFound";
import ITSupport from "./pages/ITSupport";
import SupportTicket from "./pages/SupportTicket";
import OrgChart from "./pages/OrgChart";
import Documents from "./pages/Documents";
import Benefits from "./pages/Benefits";
import BenefitDetail from "./pages/BenefitDetail";
import Feedback from "./pages/Feedback";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/checklist" element={<Checklist />} />
          <Route path="/learning" element={<Learning />} />
          <Route path="/learning/:id" element={<Learning />} />
          <Route path="/it-support" element={<ITSupport />} />
          <Route path="/support/ticket" element={<SupportTicket />} />
          <Route path="/org-chart" element={<OrgChart />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/benefits" element={<Benefits />} />
          <Route path="/benefits/:id" element={<BenefitDetail />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/calendar" element={<NotFound />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
