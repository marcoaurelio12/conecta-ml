
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Upload } from "lucide-react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import FeedbackFileUpload from "@/components/feedback/FeedbackFileUpload";
import PrivacyBanner from "@/components/feedback/PrivacyBanner";
import ConfettiEffect from "@/components/feedback/ConfettiEffect";

// Define the form schema with validation
const formSchema = z.object({
  story: z.string().max(600, { message: "Maximum 600 characters allowed" }).min(1, { message: "Partilha uma história, por favor." }),
  levelUp: z.string().max(600, { message: "Maximum 600 characters allowed" }).min(1, { message: "Partilha o teu momento, por favor." }),
  podcastTitle: z.string().max(600, { message: "Maximum 600 characters allowed" }).min(1, { message: "Dê um título, por favor." }),
  receivedEquipment: z.boolean(),
  metManager: z.boolean(),
  knowTimeOff: z.boolean(),
  uploadFile: z.instanceof(File).optional(),
});

type FeedbackFormValues = z.infer<typeof formSchema>;

const Feedback = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(1);
  const [showConfetti, setShowConfetti] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  
  const totalSections = 3;
  const progressPercentage = (activeSection / totalSections) * 100;

  const form = useForm<FeedbackFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      story: "",
      levelUp: "",
      podcastTitle: "",
      receivedEquipment: false,
      metManager: false,
      knowTimeOff: false,
    },
  });

  const handleSectionFocus = (section: number) => {
    setActiveSection(section);
  };

  const onSubmit = async (data: FeedbackFormValues) => {
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      console.log("Formulário submetido:", data);
      
      // Show success animation and message
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setShowThankYou(true);
      }, 3000);
      
      // In a real implementation, you would POST to an API endpoint
      // await fetch('/api/feedback', {
      //   method: 'POST',
      //   body: formData,
      // });
    } catch (error) {
      toast.error("Algo correu mal. Por favor, tente novamente.");
    }
  };

  return (
    <DashboardLayout>
      <div className="container max-w-4xl mx-auto">
        <div className="mb-8">
          
          <h1 className="text-4xl font-bold mb-2">A Sua Voz Importa</h1>
          <p className="text-xl text-muted-foreground">Conte-nos sobre as suas primeiras semanas</p>
        </div>
        
        <PrivacyBanner />
        
        <div className="mb-8">
          <p className="text-muted-foreground">
            Tempo estimado: 4–5 min • As respostas são anónimas, a menos que escolha adicionar o seu nome.
          </p>
        </div>
        
        <div className="mb-8">
          <Progress value={progressPercentage} className="h-2" />
        </div>
        
        {showThankYou ? (
          <Card className="animate-fade-in mb-8">
            <CardHeader>
              <CardTitle className="text-2xl">Obrigado pelo seu feedback!</CardTitle>
              <CardDescription>
                As suas opiniões ajudam-nos a melhorar a experiência de integração para todos.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>Agradecemos por dedicar o seu tempo a partilhar os seus pensamentos connosco.</p>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => window.open('mailto:rh@nortia.example?subject=Schedule%20a%2015-min%20chat', '_blank')}
                variant="outline"
                className="mt-4"
              >
                Quer falar mais? Agende uma conversa de 15 minutos
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12">
              {/* Section 1: Open Questions */}
              <div 
                className="space-y-6" 
                onFocus={() => handleSectionFocus(1)}
                aria-labelledby="section1-title"
              >
                <h2 id="section1-title" className="text-2xl font-semibold">Perguntas Abertas</h2>
                
                <FormField
                  control={form.control}
                  name="story"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Imagine que um amigo pergunta sobre o seu novo emprego — qual é a primeira história que partilha?
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none"
                            placeholder="Escreva a sua resposta aqui..."
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value.length}/600
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="levelUp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Qual momento de 'evolução' o fez sentir mais confiante esta semana?
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none"
                            placeholder="Escreva a sua resposta aqui..."
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value.length}/600
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="podcastTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-lg">
                        Se a nossa empresa fosse um podcast, qual seria o título do próximo episódio — e porquê?
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Textarea
                            {...field}
                            className="min-h-[120px] resize-none"
                            placeholder="Escreva a sua resposta aqui..."
                          />
                          <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                            {field.value.length}/600
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Section 2: Yes/No Toggles */}
              <div 
                className="space-y-6" 
                onFocus={() => handleSectionFocus(2)}
                aria-labelledby="section2-title"
              >
                <h2 id="section2-title" className="text-2xl font-semibold">Verificações Rápidas</h2>
                
                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="receivedEquipment"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Recebeu todo o equipamento necessário antes do Dia 1?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className={field.value ? "text-muted-foreground" : "text-foreground font-semibold"}>Não</span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label="Recebeu todo o equipamento necessário antes do Dia 1?"
                            />
                            <span className={field.value ? "text-foreground font-semibold" : "text-muted-foreground"}>Sim</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metManager"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Já se encontrou com o seu gestor ou mentor?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className={field.value ? "text-muted-foreground" : "text-foreground font-semibold"}>Não</span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label="Já se encontrou com o seu gestor ou mentor?"
                            />
                            <span className={field.value ? "text-foreground font-semibold" : "text-muted-foreground"}>Sim</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="knowTimeOff"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between p-4 border rounded-lg">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">
                            Sabe como solicitar folgas?
                          </FormLabel>
                        </div>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <span className={field.value ? "text-muted-foreground" : "text-foreground font-semibold"}>Não</span>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              aria-label="Sabe como solicitar folgas?"
                            />
                            <span className={field.value ? "text-foreground font-semibold" : "text-muted-foreground"}>Sim</span>
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Section 3: Optional Upload */}
              <div 
                className="space-y-6" 
                onFocus={() => handleSectionFocus(3)}
                aria-labelledby="section3-title"
              >
                <h2 id="section3-title" className="text-2xl font-semibold">Carregamento Opcional</h2>
                <p className="text-muted-foreground">
                  Tem uma captura de ecrã ou foto que ilustre um obstáculo que encontrou? Partilhe connosco.
                </p>
                
                <FeedbackFileUpload
                  onFileSelected={(file) => form.setValue("uploadFile", file)}
                  isUploading={isUploading}
                />
              </div>
              
              <div className="pt-6 border-t">
                <Button 
                  type="submit" 
                  size="lg"
                  disabled={form.formState.isSubmitting}
                  className="w-full md:w-auto"
                >
                  {form.formState.isSubmitting ? "A enviar..." : "Enviar Feedback"}
                </Button>
              </div>
            </form>
          </Form>
        )}
        
        {showConfetti && <ConfettiEffect />}
        
        <div className="fixed bottom-6 right-6 z-10 hidden md:block">
          <Button
            onClick={() => window.open('mailto:rh@nortia.example', '_blank')}
            variant="secondary"
            className="shadow-lg"
          >
            Contactar RH
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Feedback;
