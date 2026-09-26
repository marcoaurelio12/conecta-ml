import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDebounce } from "@/hooks/useDebounce";
import { Book, SearchIcon, MessageSquare, HelpCircle, FileText, ArrowDown, ArrowUp } from "lucide-react";
import { toast } from "sonner";
import DashboardLayout from "@/components/layouts/DashboardLayout";

// Mock data for Setup Guides
const setupGuides = [
  { id: 1, title: "Guia de Configuração do Computador da Empresa", description: "Como configurar o seu novo computador da empresa.", downloadUrl: "#" },
  { id: 2, title: "Configuração de E-mail", description: "Etapas para configurar o seu e-mail.", downloadUrl: "#" },
  { id: 3, title: "Configuração de Acesso VPN", description: "Como configurar acesso seguro por via VPN aos serviços da empresa.", downloadUrl: "#" },
  { id: 4, title: "Gerenciamento de Senhas", description: "Guia para utilizar o nosso sistema de gestão de palavras-passe.", downloadUrl: "#" },
  { id: 5, title: "Configuração de Conferências em Vídeo", description: "Como configurar as suas ferramentas de vídeo-conferência.", downloadUrl: "#" },
  { id: 6, title: "Autenticação de Dois Fatores", description: "Ative e utilize a autenticação de dois fatores.", downloadUrl: "#" },
  { id: 7, title: "Configuração de Dispositivo Móvel da Empresa", description: "Como configurar o seu dispositivo móvel da empresa.", downloadUrl: "#" },
  { id: 8, title: "Configuração de Impressoras", description: "Como adicionar e utilizar impressoras de rede.", downloadUrl: "#" },
  { id: 9, title: "Portal de Licenças de Software", description: "Como aceder e utilizar o portal de licenças de software.", downloadUrl: "#" },
  { id: 10, title: "Acesso a Desktop Remoto", description: "Como configurar acesso remoto ao desktop de trabalho.", downloadUrl: "#" }
];

// Mock data for Knowledge Base FAQs
const knowledgeBaseFAQs = [
  { id: 1, question: "Como redefinir minha senha?", answer: "Aceda ao portal da conta e clique em 'Esqueci-me da Palavra-passe'. Siga as instruções enviadas para o seu e-mail." },
  { id: 2, question: "Onde posso descarregar o software aprovado?", answer: "Todo o software aprovado pode ser encontrado na aplicação Software Center no seu desktop ou através do portal de software da intranet." },
  { id: 3, question: "O meu computador está lento, o que devo fazer?", answer: "Tente reiniciar o seu computador, feche aplicações não utilizadas e verificar malware. Se os problemas persistirem, envie um ticket de suporte." },
  { id: 4, question: "Como me conectar à rede Wi-Fi da empresa?", answer: "Selecione a rede 'Nortia-WiFi', insira seu ID de funcionário como nome de utilizador e sua senha de rede." },
  { id: 5, question: "Posso aceder ao meu e-mail corporativo a partir de casa?", answer: "Sim, pode aceder ao seu e-mail por meio do portal web em mail.nortia.example ou configurar o seu cliente de e-mail em casa com as suas credenciais corporativas." },
  { id: 6, question: "Como agendar uma sala de reunião?", answer: "Utilize o sistema de agendamento de calendário do Outlook para agendar salas de reunião. Salas podem ser adicionadas como recursos ao criar uma nova reunião." },
  { id: 7, question: "O que devo fazer se suspeitar de uma violação de segurança?", answer: "Desconecte-se imediatamente da rede, entre em contato com a equipa segurança de TI em ciberseguranca@nortia.example e não partilhe detalhes por canais não oficiais." },
  { id: 8, question: "Como solicitar equipamentos adicionais?", answer: "Envie um formulário de solicitação de equipamento pelo portal de TI, incluindo a aprovação do seu gestor/chefia." },
  { id: 9, question: "Quando são os horários de manutenção do sistema?", answer: "A manutenção regular do sistema está programada todas as domingos das 1h às 5h. A manutenção de emergência será anunciada por e-mail." },
  { id: 10, question: "Posso utilizar o meu dispositivo pessoal para trabalho?", answer: "Sim, sob a nossa política de dispositivos pessoais (BYOD), mas o seu dispositivo deve atender aos nossos requisitos de segurança e estar inscrito no nosso sistema de gestão de dispositivos móveis." }
];

// Support contact options
const contactOptions = [
  { id: 1, method: "Email", contact: "suporte@nortia.example", description: "Para questões não urgentes. Resposta dentro de 24 horas." },
  { id: 2, method: "Telefone", contact: "+351 919 874 516", description: "Para questões urgentes durante horário comercial (8h-18h)." },
  { id: 3, method: "Emergência", contact: "+351 919 874 516", description: "Para questões críticas fora do horário laboral." }
];

const ITSupport = () => {
  const [activeTab, setActiveTab] = useState("setup-guides");
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState(knowledgeBaseFAQs);
  const [visibleFAQs, setVisibleFAQs] = useState(5);
  const [showScrollTop, setShowScrollTop] = useState(false);
  
  // Use debounce hook for search
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  
  // Filter FAQs based on search term
  useEffect(() => {
    if (debouncedSearchTerm) {
      const searchResults = knowledgeBaseFAQs.filter(faq => 
        faq.question.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) || 
        faq.answer.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
      );
      setFilteredFAQs(searchResults);
    } else {
      setFilteredFAQs(knowledgeBaseFAQs);
    }
    setVisibleFAQs(5); // Reset pagination when search changes
  }, [debouncedSearchTerm]);

  // Detect scroll position for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Load more FAQs for infinite scroll
  const loadMoreFAQs = () => {
    setVisibleFAQs(prev => Math.min(prev + 5, filteredFAQs.length));
  };

  // Handle download
  const handleDownload = (guide) => {
    toast.success(`A descarregar ${guide.title}...`);
    // In a real app, this would trigger the file download
  };

  // Scroll to top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-8 px-4">

        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">Centro de Suporte de TI</h1>
            <p className="text-muted-foreground mb-6">
              Encontre guias, artigos da base de conhecimento e obtenha ajuda da nossa equipa de suporte técnico.
            </p>
          </div>

          {/* Tabs Interface */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3 mb-8" aria-label="Opções de Suporte TI">
              <TabsTrigger
                value="setup-guides"
                aria-controls="setup-guides-tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Book className="mr-2 h-4 w-4" />
                Guias de Configuração
              </TabsTrigger>
              
              <TabsTrigger
                value="knowledge-base"
                aria-controls="knowledge-base-tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <HelpCircle className="mr-2 h-4 w-4" />
                Base de Conhecimento
              </TabsTrigger>
              
              <TabsTrigger
                value="get-help"
                aria-controls="get-help-tab"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                Obter Ajuda
              </TabsTrigger>
            </TabsList>

            {/* Setup Guides Tab Content */}
            <TabsContent value="setup-guides" id="setup-guides-tab" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Guias de Configuração</h2>
                  <p className="text-muted-foreground mb-6">
                    Guias essenciais para ajudar a configurar e preparar o seu ambiente de trabalho.
                  </p>
                  
                  <Accordion type="single" collapsible className="w-full">
                    {setupGuides.map((guide) => (
                      <AccordionItem key={guide.id} value={`guide-${guide.id}`}>
                        <AccordionTrigger className="text-left">
                          <div className="flex items-center">
                            <FileText className="mr-2 h-5 w-5 text-primary" />
                            <span>{guide.title}</span>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent>
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-2">
                            <p className="text-muted-foreground">{guide.description}</p>
                            <Button 
                              variant="outline"
                              size="sm"
                              onClick={() => handleDownload(guide)}
                              className="self-start md:self-center"
                            >
                              <ArrowDown className="mr-2 h-4 w-4" />
                              Descarregar Guia
                            </Button>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Knowledge Base Tab Content */}
            <TabsContent value="knowledge-base" id="knowledge-base-tab" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Base de Conhecimento</h2>
                  <p className="text-muted-foreground mb-4">
                    Encontre respostas para perguntas e problemas comuns.
                  </p>
                  
                  <div className="relative mb-6">
                    <SearchIcon className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Pesquisar na base de conhecimento..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  
                  {filteredFAQs.length === 0 ? (
                    <p className="text-center py-8 text-muted-foreground">
                      Nenhum resultado encontrado. Tente um termo de pesquisa diferente.
                    </p>
                  ) : (
                    <ScrollArea className="h-[600px] pr-4">
                      <div className="space-y-4">
                        {filteredFAQs.slice(0, visibleFAQs).map((faq) => (
                          <Collapsible key={faq.id} className="border rounded-md">
                            <CollapsibleTrigger className="flex justify-between items-center w-full p-4 text-left">
                              <span className="font-medium">{faq.question}</span>
                            </CollapsibleTrigger>
                            <CollapsibleContent>
                              <div className="p-4 pt-0 border-t">
                                <p className="text-muted-foreground">{faq.answer}</p>
                              </div>
                            </CollapsibleContent>
                          </Collapsible>
                        ))}
                        
                        {visibleFAQs < filteredFAQs.length && (
                          <div className="flex justify-center pt-4">
                            <Button variant="outline" onClick={loadMoreFAQs}>
                              Carregar Mais
                            </Button>
                          </div>
                        )}
                      </div>
                    </ScrollArea>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Get Help Tab Content */}
            <TabsContent value="get-help" id="get-help-tab" className="space-y-4">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-2xl font-semibold mb-4">Obter Ajuda</h2>
                  <p className="text-muted-foreground mb-6">
                    Entre em contacto com a nossa equipa de suporte técnico para obter ajuda.
                  </p>
                  
                  <div className="grid gap-6 md:grid-cols-3 mb-8">
                    {contactOptions.map((option) => (
                      <Card key={option.id} className="border">
                        <CardContent className="pt-6">
                          <h3 className="text-lg font-medium mb-2">{option.method}</h3>
                          <p className="text-primary font-medium mb-2">{option.contact}</p>
                          <p className="text-sm text-muted-foreground">{option.description}</p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                  
                  <div className="flex flex-col items-center justify-center py-6">
                    <p className="text-center mb-4">
                      Precisa submeter um pedido detalhado? Crie um ticket de suporte e a nossa equipa entrará em contacto.
                    </p>
                    <Button asChild size="lg">
                      <Link to="/support/ticket">
                        <MessageSquare className="mr-2 h-5 w-5" />
                        Submeter Ticket
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
        
        {/* Back to Top Button */}
        {showScrollTop && (
          <Button
            className="fixed bottom-8 right-8 rounded-full p-3 shadow-lg"
            onClick={scrollToTop}
            aria-label="Voltar ao topo"
            size="icon"
          >
            <ArrowUp className="h-5 w-5" />
          </Button>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ITSupport;
