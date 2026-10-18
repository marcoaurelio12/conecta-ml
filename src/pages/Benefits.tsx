import { useMemo, useState } from "react";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Search } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { benefitsData } from "@/data/benefitData";
import { Benefit, BenefitCategory } from "@/types/benefit";
import { benefitCategoryLabels, benefitStatusMeta } from "@/types/status";
import BenefitCard from "@/components/benefits/BenefitCard";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const contactHRLink = (
  <Button variant="ghost" asChild>
    <a href="mailto:rh@nortia.example" aria-label="Contactar o departamento de RH por email">
      <Mail className="mr-2 size-4" aria-hidden="true" />
      Contactar RH
    </a>
  </Button>
);

const Benefits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BenefitCategory | "All">("All");
  const [selectedBenefit, setSelectedBenefit] = useState<Benefit | null>(null);
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const categories: (BenefitCategory | "All")[] = [
    "All",
    "Health",
    "Retirement",
    "Wellness",
    "Time Off",
    "Perks",
  ];

  const filteredBenefits = useMemo(() => {
    let filtered = benefitsData;

    if (activeCategory !== "All") {
      filtered = filtered.filter((benefit) => benefit.category === activeCategory);
    }

    if (debouncedSearchQuery) {
      const query = debouncedSearchQuery.toLowerCase();
      filtered = filtered.filter(
        (benefit) =>
          benefit.title.toLowerCase().includes(query) ||
          benefit.summary.toLowerCase().includes(query) ||
          benefit.description.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [debouncedSearchQuery, activeCategory]);

  return (
    <DashboardLayout>
      <div aria-live="polite">
        {/* Header */}
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Os Seus Benefícios</h1>
            <p className="mt-1 text-muted-foreground">
              Explore o seu pacote completo de benefícios para colaboradores.
            </p>
          </div>
          {contactHRLink}
        </div>

        {/* Search and category controls */}
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-center">
          <div className="relative md:w-80">
            <Search
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
              aria-hidden="true"
            />
            <Input
              placeholder="Pesquisar benefícios…"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Pesquisar benefícios"
            />
          </div>

          <Tabs
            value={activeCategory}
            onValueChange={(value) => setActiveCategory(value as BenefitCategory | "All")}
          >
            <TabsList className="h-10 flex-wrap justify-start gap-1 bg-muted p-1">
              {categories.map((category) => (
                <TabsTrigger key={category} value={category} className="text-sm">
                  {category === "All" ? "Todos" : benefitCategoryLabels[category]}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredBenefits.length > 0 ? (
            filteredBenefits.map((benefit) => (
              <BenefitCard key={benefit.id} benefit={benefit} onOpen={setSelectedBenefit} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center">
              <p className="text-lg text-muted-foreground">Nenhum benefício encontrado.</p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveCategory("All");
                }}
              >
                Limpar pesquisa e filtros
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Benefit detail dialog — replaces the /benefits/:id dead end. */}
      <Dialog open={!!selectedBenefit} onOpenChange={(open) => !open && setSelectedBenefit(null)}>
        {selectedBenefit && (
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-left text-2xl">{selectedBenefit.title}</DialogTitle>
              <DialogDescription className="text-left">
                {benefitCategoryLabels[selectedBenefit.category]} ·{" "}
                {selectedBenefit.summary}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-5">
              <Badge variant={benefitStatusMeta[selectedBenefit.status].badgeVariant}>
                {selectedBenefit.status}
              </Badge>

              <p className="text-muted-foreground">{selectedBenefit.description}</p>

              <dl className="grid grid-cols-2 gap-3 text-sm">
                <div className="rounded-lg border bg-muted/40 p-3">
                  <dt className="text-xs text-muted-foreground">Custo para o colaborador</dt>
                  <dd className="mt-1 font-medium">{selectedBenefit.cost.employee}</dd>
                </div>
                <div className="rounded-lg border bg-muted/40 p-3">
                  <dt className="text-xs text-muted-foreground">Custo para a empresa</dt>
                  <dd className="mt-1 font-medium">{selectedBenefit.cost.employer}</dd>
                </div>
              </dl>

              <div>
                <h3 className="mb-1 text-sm font-medium">Elegibilidade</h3>
                <p className="text-sm text-muted-foreground">{selectedBenefit.eligibility}</p>
              </div>

              <div>
                <h3 className="mb-2 text-sm font-medium">Como aderir</h3>
                <ol className="list-decimal space-y-1 pl-5 text-sm text-muted-foreground">
                  {selectedBenefit.enrollmentSteps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
              </div>

              <div className="flex justify-end gap-2 border-t pt-4">
                <Button variant="outline" onClick={() => setSelectedBenefit(null)}>
                  Fechar
                </Button>
                <Button asChild>
                  <a href="mailto:rh@nortia.example?subject=Aderir a benefício">
                    Falar com o RH
                  </a>
                </Button>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </DashboardLayout>
  );
};

export default Benefits;
