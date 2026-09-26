import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";

const SupportTicket = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    description: "",
    priority: "medium",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulating API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Support ticket submitted successfully!");
      navigate("/it-support");
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">

        <div className="max-w-2xl mx-auto">
          <Button variant="outline" className="mb-6" asChild>
            <Link to="/it-support">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar ao Suporte
            </Link>
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Submeter Ticket de Suporte</CardTitle>
              <CardDescription>
                Por favor, forneça detalhes sobre o seu problema para que a nossa equipa de TI possa ajudá-lo eficientemente.
              </CardDescription>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleSubmit}>
                <div className="space-y-6">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome Completo</Label>
                      <Input
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Assunto</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="description">Descrição</Label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      className="flex h-32 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      placeholder="Por favor, descreva o seu problema em detalhe"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="priority">Prioridade</Label>
                    <select
                      id="priority"
                      name="priority"
                      value={formData.priority}
                      onChange={handleChange}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                    >
                      <option value="low">Baixa - Não urgente</option>
                      <option value="medium">Média - Afeta o trabalho, mas tem solução alternativa</option>
                      <option value="high">Alta - Impacta significativamente a produtividade</option>
                      <option value="critical">Crítica - Paragem completa do trabalho</option>
                    </select>
                  </div>
                </div>
                
                <Separator className="my-6" />
                
                <div className="flex justify-end">
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "A submeter..." : "Submeter Ticket"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default SupportTicket;
