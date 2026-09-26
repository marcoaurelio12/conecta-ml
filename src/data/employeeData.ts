
import { EmployeeType } from "@/types/employee";

export const employeeData: EmployeeType[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    title: "Diretora Executiva",
    department: "Executivo",
    email: "sarah.johnson@nortia.example",
    phone: "+1 (555) 123-4567",
    imageUrl: "https://i.pravatar.cc/300?img=1",
    managerId: null,
    bio: "Sarah lidera a empresa há 5 anos, com foco no crescimento sustentável e inovação."
  },
  {
    id: "2",
    name: "Michael Chen",
    title: "Diretor de Tecnologia",
    department: "Tecnologia",
    email: "michael.chen@nortia.example",
    phone: "+1 (555) 123-4568",
    imageUrl: "https://i.pravatar.cc/300?img=11",
    managerId: "1",
    bio: "Michael supervisiona toda a estratégia e implementação técnica em toda a organização."
  },
  {
    id: "3",
    name: "Aisha Patel",
    title: "Diretora Financeira",
    department: "Finanças",
    email: "aisha.patel@nortia.example",
    phone: "+1 (555) 123-4569",
    imageUrl: "https://i.pravatar.cc/300?img=5",
    managerId: "1",
    bio: "Aisha gere os riscos financeiros e o planeamento da empresa com mais de 15 anos de experiência."
  },
  {
    id: "4",
    name: "James Wilson",
    title: "VP de Marketing",
    department: "Marketing",
    email: "james.wilson@nortia.example",
    phone: "+1 (555) 123-4570",
    imageUrl: "https://i.pravatar.cc/300?img=12",
    managerId: "1",
    bio: "James lidera a equipa global de marketing com campanhas e estratégias inovadoras."
  },
  {
    id: "5",
    name: "Elena Rodriguez",
    title: "VP de Recursos Humanos",
    department: "RH",
    email: "elena.rodriguez@nortia.example",
    phone: "+1 (555) 123-4571",
    imageUrl: "https://i.pravatar.cc/300?img=3",
    managerId: "1",
    bio: "Elena foca-se na construção da cultura da empresa e em programas de desenvolvimento de colaboradores."
  },
  {
    id: "6",
    name: "David Kim",
    title: "Gestor de Engenharia",
    department: "Tecnologia",
    email: "david.kim@nortia.example",
    phone: "+1 (555) 123-4572",
    imageUrl: "https://i.pravatar.cc/300?img=15",
    managerId: "2",
    bio: "David lidera a equipa de engenharia principal, focando-se na arquitetura do produto."
  },
  {
    id: "7",
    name: "Priya Sharma",
    title: "Líder de Ciência de Dados",
    department: "Tecnologia",
    email: "priya.sharma@nortia.example",
    phone: "+1 (555) 123-4573",
    imageUrl: "https://i.pravatar.cc/300?img=6",
    managerId: "2",
    bio: "Priya especializa-se em aplicações de machine learning e plataformas de análise de dados."
  },
  {
    id: "8",
    name: "Thomas Jackson",
    title: "Analista Financeiro",
    department: "Finanças",
    email: "thomas.jackson@nortia.example",
    phone: "+1 (555) 123-4574",
    imageUrl: "https://i.pravatar.cc/300?img=14",
    managerId: "3",
    bio: "Thomas trabalha em modelagem financeira e estratégias de investimento."
  },
  {
    id: "9",
    name: "Grace Lee",
    title: "Gestora de Marketing",
    department: "Marketing",
    email: "grace.lee@nortia.example",
    phone: "+1 (555) 123-4575",
    imageUrl: "https://i.pravatar.cc/300?img=9",
    managerId: "4",
    bio: "Grace especializa-se em estratégias de marketing digital e gestão de marca."
  },
  {
    id: "10",
    name: "Marcus Brown",
    title: "Engenheiro de Software Sénior",
    department: "Tecnologia",
    email: "marcus.brown@nortia.example",
    phone: "+1 (555) 123-4576",
    imageUrl: "https://i.pravatar.cc/300?img=13",
    managerId: "6",
    bio: "Marcus é um especialista em arquitetura cloud e sistemas distribuídos."
  },
  {
    id: "11",
    name: "Sofia Garcia",
    title: "Especialista de RH",
    department: "RH",
    email: "sofia.garcia@nortia.example",
    phone: "+1 (555) 123-4577",
    imageUrl: "https://i.pravatar.cc/300?img=8",
    managerId: "5",
    bio: "Sofia gere a integração de colaboradores e programas de bem-estar."
  },
  {
    id: "12",
    name: "Lucas Nguyen",
    title: "Engenheiro de Software",
    department: "Tecnologia",
    email: "lucas.nguyen@nortia.example",
    phone: "+1 (555) 123-4578",
    imageUrl: "https://i.pravatar.cc/300?img=20",
    managerId: "6",
    bio: "Lucas especializa-se em desenvolvimento front-end e experiência do utilizador."
  }
];
