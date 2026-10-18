import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useDebounce } from "@/hooks/useDebounce";
import {
  ArrowDown,
  ArrowUp,
  Book,
  FileText,
  HelpCircle,
  MessageSquare,
  Search as SearchIcon,
} from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layouts/DashboardLayout";

interface SetupGuide {
  id: number;
  title: string;
  description: string;
}

// Mock data for Setup Guides
const setupGuides: SetupGuide[] = [
  { id: 1, title: "Configuração do Computador da Empresa", description: "Como configurar o seu novo computador da empresa." },
  { id: 2, title: "Configuração de E-mail", description: "Passos para configurar o seu e-mail." },
  { id: 3, title: "Configuração de Acesso VPN", description: "Como configurar o acesso seguro por VPN aos serviços da empresa." },
  { id: 4, title: "Gestão de Palavras-passe", description: "Guia para utilizar o gestor de palavras-passe da empresa." },
  { id: 5, title: "Configuração de Conferências em Vídeo", description: "Como configurar as suas ferramentas de videoconferência." },
  { id: 6, title: "Autenticação de Dois Fatores", description: "Ative e utilize a autenticação de dois fatores." },
  { id: 7, title: "Configuração do Telemóvel da Empresa", description: "Como configurar o seu telemóvel da empresa." },
  { id: 8, title: "Configuração de Impressoras", description: "Como adicionar e utilizar impressoras de rede." },
  { id: 9, title: "Portal de Licenças de Software", description: "Como aceder e utilizar o portal de licenças de software." },
  { id: 10, title: "Acesso a Ambiente de Trabalho Remoto", description: "Como configurar o acesso remoto ao seu posto de trabalho." }
];

interface Faq {
  id: number;
  question: string;
  answer: string;
}

// Mock data for Knowledge Base FAQs
const knowledgeBaseFAQs: Faq[] = [
  { id: 1, question: "Como redefinir a minha palavra-passe?", answer: "Aceda ao portal da conta e escolha «Esqueci-me da palavra-passe». Siga as instruções enviadas para o seu e-mail." },
  { id: 2, question: "Onde posso descarregar o software aprovado?", answer: "Todo o software aprovado está disponível na aplicação Software Center do seu ambiente de trabalho ou no portal de software da intranet." },
  { id: 3, question: "O meu computador está lento, o que devo fazer?", answer: "Tente reiniciar o computador, feche as aplicações que não está a utilizar e procure malware. Se os problemas persistirem, envie um ticket de suporte." },
  { id: 4, question: "Como me ligar à rede Wi-Fi da empresa?", answer: "Selecione a rede «Nortia-WiFi», introduza o seu ID de funcionário como nome de utilizador e a sua palavra-passe de rede." },
  { id: 5, question: "Posso aceder ao meu e-mail da empresa a partir de casa?", answer: "Sim, pode aceder através do portal web em mail.nortia.example ou configurar o seu cliente de e-mail em casa com as credenciais da empresa." },
  { id: 6, question: "Como agendar uma sala de reunião?", answer: "Utilize o calendário do Outlook para agendar salas de reunião. As salas podem ser adicionadas como recursos ao criar uma nova reunião." },
  { id: 7, question: "O que devo fazer se suspeitar de uma violação de segurança?", answer: "Desligue o computador da rede imediatamente e contacte a equipa de segurança de TI em ciberseguranca@nortia.example. Não partilhe detalhes por canais não oficiais." },
  { id: 8, question: "Como solicitar equipamento adicional?", answer: "Envie um pedido de equipamento pelo portal de TI, com a aprovação do seu gestor." },
  { id: 9, question: "Quando decorrem as manutenções do sistema?", answer: "A manutenção regular decorre todos os domingos, das 1h às 5h. A manutenção de emergência é anunciada por e-mail." },
  { id: 10, question: "Posso utilizar o meu dispositivo pessoal para trabalho?", answer: "Sim, ao abrigo da nossa política de dispositivos pessoais (BYOD), desde que cumpra os requisitos de segurança e esteja inscrito no sistema de gestão de dispositivos." }
];

// Support contact options — the emergency line is a separate channel, on purpose.
const contactOptions = [
  { id: 1, method: "Email", contact: "suporte@nortia.example", description: "Para questões não urgentes. Resposta em 24 horas." },
  { id: 2, method: "Telefone", contact: "+351 919 874 516", description: "Para questões urgentes durante o horário laboral (8h–18h)." },
  { id: 3, method: "Emergência", contact: "+351 919 874 517", description: "Linha 24/7 só para incidentes críticos: segurança da informação ou paragem total de trabalho." }
];

const ITSupport = () => {
  const [searchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState(searchParams.get("tab") ?? "setup-guides");
  const [guideSearchTerm, setGuideSearchTerm] = useState("");
  const [faqSearchTerm, setFaqSearchTerm] = useState("");
  const [visibleFAQs, setVisibleFAQs] = useState(5);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const debouncedGuideSearch = useDebounce(guideSearchTerm, 300);
  const debouncedFaqSearch = useDebounce(faqSearchTerm, 300);

  const filteredGuides = useMemo(() => {
    const query = debouncedGuideSearch.trim().toLowerCase();
    if (!query) return setupGuides;
    return setupGuides.filter(
      (guide) =>
        guide.title.toLowerCase().includes(query) ||
        guide.description.toLowerCase().includes(query)
    );
  }, [debouncedGuideSearch]);

  const filteredFAQs = useMemo(() => {
    const query = debouncedFaqSearch.trim().toLowerCase();
    if (!query) return knowledgeBaseFAQs;
    return knowledgeBaseFAQs.filter(
      (faq) =>
        faq.question.toLowerCase().includes(query) ||
        faq.answer.toLowerCase().includes(query)
    );
  }, [debouncedFaqSearch]);

  useEffect(() => {
    setVisibleFAQs(5); // Reset pagination when the search changes.
  }, [debouncedFaqSearch]);

  // Detect scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadMoreFAQs = () => {
    setVisibleFAQs((prev) => Math.min(prev + 5, filteredFAQs.length));
  };

  const handleDownload = (guide: SetupGuide) => {
    // The guides are fixtures; pretending to download would be a lie at the
    // exact moment the user is already frustrated. One deduplicated toast.
    toast.info(
      "Os guias são dados de exemplo — o ficheiro real ficará disponível na intranet.",
      { id: "guide-download" }
    );
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight md:text-3xl">Centro de Suporte de TI</h1>
          <p className="mt-1 text-muted-foreground">
            Encontre guias, respostas na base de conhecimento e ajuda da equipa de suporte técnico.
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid w-full grid-cols-3" aria-label="Opções de Suporte TI">
            <TabsTrigger value="setup-guides" aria-controls="setup-guides-tab">
              <Book className="mr-2 h-4 w-4" aria-hidden="true" />
              Guias de Configuração
            </TabsTrigger>

            <TabsTrigger value="knowledge-base" aria-controls="knowledge-base-tab">
              <HelpCircle className="mr-2 h-4 w-4" aria-hidden="true" />
              Base de Conhecimento
            </TabsTrigger>

            <TabsTrigger value="get-help" aria-controls="get-help-tab">
              <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
              Obter Ajuda
            </TabsTrigger>
          </TabsList>

          {/* Setup Guides Tab Content */}
          <TabsContent value="setup-guides" id="setup-guides-tab" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-1 text-xl font-semibold">Guias de Configuração</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Guias essenciais para preparar o seu ambiente de trabalho.
                </p>

                <div className="relative mb-4">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar nos guias…"
                    value={guideSearchTerm}
                    onChange={(e) => setGuideSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Pesquisar nos guias de configuração"
                  />
                </div>

                {filteredGuides.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    Nenhum guia corresponde a “{debouncedGuideSearch}”.
                  </p>
                ) : (
                  <Accordion type="single" collapsible className="w-full">
                    {filteredGuides.map((guide) => (
                      <AccordionItem key={guide.id} value={`guide-${guide.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-primary" aria-hidden="true" />
                            <span>{guide.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col gap-4 p-2 md:flex-row md:items-center md:justify-between">
                            <p className="text-muted-foreground">{guide.description}</p>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(guide)}
                              className="self-start md:self-center"
                            >
                              <ArrowDown className="mr-2 h-4 w-4" aria-hidden="true" />
                              Descarregar Guia
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Knowledge Base Tab Content */}
          <TabsContent value="knowledge-base" id="knowledge-base-tab" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-1 text-xl font-semibold">Base de Conhecimento</h2>
                <p className="mb-4 text-sm text-muted-foreground">
                  Encontre respostas para perguntas e problemas comuns.
                </p>

                <div className="relative mb-6">
                  <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Pesquisar na base de conhecimento…"
                    value={faqSearchTerm}
                    onChange={(e) => setFaqSearchTerm(e.target.value)}
                    className="pl-10"
                    aria-label="Pesquisar na base de conhecimento"
                  />
                </div>

                {filteredFAQs.length === 0 ? (
                  <p className="py-8 text-center text-muted-foreground">
                    Nenhum resultado encontrado. Tente um termo de pesquisa diferente.
                  </p>
                ) : (
                  <div className="space-y-4">
                    {filteredFAQs.slice(0, visibleFAQs).map((faq) => (
                      <Collapsible key={faq.id} className="rounded-md border">
                        <CollapsibleTrigger className="flex w-full items-center justify-between p-4 text-left">
                          <span className="font-medium">{faq.question}</span>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <div className="border-t p-4 pt-4">
                            <p className="text-muted-foreground">{faq.answer}</p>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    ))}

                    {visibleFAQs < filteredFAQs.length && (
                      <div className="flex justify-center pt-2">
                        <Button variant="outline" onClick={loadMoreFAQs}>
                          Carregar Mais ({filteredFAQs.length - visibleFAQs} restantes)
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Get Help Tab Content */}
          <TabsContent value="get-help" id="get-help-tab" className="space-y-4">
            <Card>
              <CardContent className="pt-6">
                <h2 className="mb-1 text-xl font-semibold">Obter Ajuda</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  Contacte a equipa de suporte técnico pelos canais abaixo.
                </p>

                <div className="mb-8 grid gap-4 md:grid-cols-3">
                  {contactOptions.map((option) => (
                    <div key={option.id} className="rounded-lg border p-4">
                      <h3 className="mb-2 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                        {option.method}
                      </h3>
                      <p className="mb-2 break-all font-medium text-primary">{option.contact}</p>
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-6">
                  <p className="mb-4 max-w-md text-center text-sm text-muted-foreground">
                    Precisa de submeter um pedido detalhado? Crie um ticket e a equipa entrará em
                    contacto.
                  </p>
                  <Button asChild>
                    <Link to="/support/ticket">
                      <MessageSquare className="mr-2 h-4 w-4" aria-hidden="true" />
                      Submeter Ticket
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Back to Top Button — left corner, clear of the toast stack */}
        {showScrollTop && (
          <Button
            className="fixed bottom-6 left-6 rounded-full p-3 shadow-lg md:bottom-8 md:left-8"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" aria-hidden="true" />
          </Button>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ITSupport;
