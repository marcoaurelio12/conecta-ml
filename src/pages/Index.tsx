import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ListTodo, Book, Users, Settings } from "lucide-react"; // Changed from Checklist to ListTodo
import DashboardLayout from '@/components/layouts/DashboardLayout';
import { CircularProgress } from '@/components/dashboard/CircularProgress';
import { TaskCard } from '@/components/dashboard/TaskCard';
import { MeetingsCard } from '@/components/dashboard/MeetingsCard';
import { QuickLink } from '@/components/dashboard/QuickLink';

const Index = () => {
  const [firstName, setFirstName] = useState("Alex");
  const [onboardingProgress, setOnboardingProgress] = useState(65);
  
  // Simulate loading data
  useEffect(() => {
    // This would be replaced with actual API calls in a real app
    const timer = setTimeout(() => {
      // Simulate progress changing
      setOnboardingProgress(68);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <DashboardLayout>
      {/* Header Section with Greeting */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Bem-vindo de volta, {firstName}!</h1>
          <p className="text-muted-foreground mt-1">Aqui está a sua visão geral do painel.</p>
        </div>
        <div className="mt-4 md:mt-0 w-28">
          <CircularProgress value={onboardingProgress} />
        </div>
      </div>

      {/* Main Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <TaskCard />
        <MeetingsCard />
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="text-xl font-semibold mb-4">Links Rápidos</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <QuickLink 
            icon={<ListTodo size={24} />} 
            title="Lista de Verificação"
            description="Acompanhe as suas tarefas de integração"
            href="/checklist"
          />
          <QuickLink 
            icon={<Book size={24} />} 
            title="Formação"
            description="Aceda a materiais de formação"
            href="/learning"
          />
          <QuickLink 
            icon={<Users size={24} />} 
            title="Organograma"
            description="Conheça os membros da sua equipa"
            href="/org-chart"
          />
          <QuickLink 
            icon={<Settings size={24} />} 
            title="Suporte de TI"
            description="Obtenha ajuda técnica"
            href="/support"
          />
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Index;
