import { useMemo } from "react";
import { Link } from "react-router-dom";
import { Gift, GraduationCap, LifeBuoy, ListChecks } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { CircularProgress } from "@/components/dashboard/CircularProgress";
import { TaskCard } from "@/components/dashboard/TaskCard";
import { MeetingsCard } from "@/components/dashboard/MeetingsCard";
import { QuickLink } from "@/components/dashboard/QuickLink";
import { useCurrentUser } from "@/contexts/CurrentUserContext";
import { loadSavedChecklist } from "@/data/checklistData";

const greetingForHour = (hour: number): string => {
  if (hour < 12) return "Bom dia";
  if (hour < 20) return "Boa tarde";
  return "Boa noite";
};

const Index = () => {
  const { user } = useCurrentUser();
  const firstName = user.name.split(" ")[0];

  // Real progress from the persisted checklist, not a simulated number.
  const onboardingProgress = useMemo(() => {
    const tasks = loadSavedChecklist();
    if (tasks.length === 0) return 0;
    return (tasks.filter((task) => task.completed).length / tasks.length) * 100;
  }, []);

  return (
    <DashboardLayout>
      {/* Header Section with Greeting */}
      <div className="mb-8 flex flex-col justify-between gap-6 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            {greetingForHour(new Date().getHours())}, {firstName}
          </h1>
          <p className="mt-1 text-muted-foreground">
            Aqui está a sua visão geral do processo de integração — o primeiro dia já vem
            pré-marcado pela equipa de RH.
          </p>
        </div>
        <div className="w-28 shrink-0">
          <CircularProgress value={onboardingProgress} />
        </div>
      </div>

      {/* Main Cards */}
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        <TaskCard />
        <MeetingsCard />
      </div>

      {/* Quick Links Grid */}
      <div>
        <h2 className="mb-4 text-xl font-semibold">Atalhos</h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickLink
            icon={<ListChecks className="size-6" />}
            title="Lista de Verificação"
            description="Acompanhe as suas tarefas de integração"
            href="/checklist"
          />
          <QuickLink
            icon={<GraduationCap className="size-6" />}
            title="Formação"
            description="Aceda aos módulos do catálogo"
            href="/learning"
          />
          <QuickLink
            icon={<Gift className="size-6" />}
            title="Benefícios"
            description="Conheça o seu pacote completo"
            href="/benefits"
          />
          <QuickLink
            icon={<LifeBuoy className="size-6" />}
            title="Suporte de TI"
            description="Obtenha ajuda técnica"
            href="/it-support"
          />
        </div>
      </div>

      <p className="mt-10 text-sm text-muted-foreground">
        Novo por aqui? Comece pela{" "}
        <Link to="/checklist" className="font-medium text-primary underline-offset-4 hover:underline">
          lista de verificação
        </Link>{" "}
        — ela guia a sua primeira semana.
      </p>
    </DashboardLayout>
  );
};

export default Index;
