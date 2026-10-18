import { FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCurrentUser } from "@/contexts/CurrentUserContext";

const priorityOptions = [
  { value: "low", label: "Baixa — não urgente" },
  { value: "medium", label: "Média — afeta o trabalho, mas tem alternativa" },
  { value: "high", label: "Alta — impacta a produtividade" },
  { value: "critical", label: "Crítica — paragem completa do trabalho" },
];

const SupportTicket = () => {
  const navigate = useNavigate();
  const { user } = useCurrentUser();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("medium");

  // Name and email come from the signed-in profile; no need to retype them.
  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    setIsSubmitting(true);

    // Simulating the future API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Ticket submetido com sucesso. A equipa de TI entrará em contacto.");
      // Back to the tab the user came from, not the page default.
      navigate("/it-support?tab=get-help");
    }, 1200);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-2xl">
        <Button variant="ghost" className="mb-4 -ml-2" asChild>
          <Link to="/it-support">
            <ArrowLeft className="mr-2 size-4" aria-hidden="true" />
            Voltar ao Suporte
          </Link>
        </Button>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Submeter Ticket de Suporte</CardTitle>
            <CardDescription>
              Descreva o problema para a equipa de TI o conseguir resolver mais depressa.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit}>
              <div className="space-y-5">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nome</Label>
                    <Input id="name" value={user.name} readOnly aria-readonly="true" />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" value={user.email} readOnly aria-readonly="true" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Assunto</Label>
                  <Input
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Descrição</Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="min-h-32"
                    placeholder="Descreva o problema em detalhe: o que aconteceu, onde e desde quando."
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="priority">Prioridade</Label>
                  <Select value={priority} onValueChange={setPriority}>
                    <SelectTrigger id="priority" className="w-full">
                      <SelectValue placeholder="Escolha a prioridade" />
                    </SelectTrigger>
                    <SelectContent>
                      {priorityOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="flex justify-end">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "A submeter…" : "Submeter Ticket"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default SupportTicket;
