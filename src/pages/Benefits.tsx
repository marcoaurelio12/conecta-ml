import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import DashboardLayout from "@/components/layouts/DashboardLayout";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Search, HelpCircle, Plus, Mail } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import { useIsMobile } from "@/hooks/use-mobile";

import { useMemo } from "react";
import { benefitsData } from "@/data/benefitData";
import { Benefit, BenefitCategory } from "@/types/benefit";
import BenefitCard from "@/components/benefits/BenefitCard";


const Benefits = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<BenefitCategory | 'All'>('All');
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const isMobile = useIsMobile();

  const categories: (BenefitCategory | 'All')[] = ['All', 'Health', 'Retirement', 'Wellness', 'Time Off', 'Perks'];

  const filteredBenefits = useMemo(() => {
    let filtered = benefitsData;

    if (activeCategory !== 'All') {
      filtered = filtered.filter(benefit => benefit.category === activeCategory);
    }

    if (debouncedSearchQuery) {
      filtered = filtered.filter(benefit =>
        benefit.title.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        benefit.summary.toLowerCase().includes(debouncedSearchQuery.toLowerCase()) ||
        benefit.description.toLowerCase().includes(debouncedSearchQuery.toLowerCase())
      );
    }

    return filtered;
  }, [debouncedSearchQuery, activeCategory]);

  const contactHRButton = (
    <Button
      variant="secondary"
      size="lg"
      className={`flex items-center gap-2 ${!isMobile ? "fixed bottom-6 right-6 z-10 shadow-lg" : ""}`}
      onClick={() => window.location.href = "mailto:rh@nortia.example"}
      aria-label="Contactar departamento de RH"
    >
      <Mail size={16} />
      Contactar RH
    </Button>
  );

  return (
    <DashboardLayout>
      <div className="container mx-auto" aria-live="polite">

        {/* Hero Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Os Seus Benefícios</h1>
          <p className="text-muted-foreground text-lg">Explore e gira o seu pacote completo de benefícios para colaboradores.</p>
        </div>

        {/* Progress Bar */}
        {/* You can add a progress bar here if you have data to track enrollment */}

        {/* Search and Filter Controls */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative md:w-80">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
            <Input
              placeholder="Pesquisar benefícios..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
              aria-label="Pesquisar benefícios"
            />
          </div>

          {/* Tabs for categories */}
          <Tabs value={activeCategory} onValueChange={(value) => setActiveCategory(value as BenefitCategory | 'All')}>
            <TabsList>
              {categories.map(category => (
                <TabsTrigger key={category} value={category}>{category}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {filteredBenefits.length > 0 ? (
            filteredBenefits.map(benefit => (
              <BenefitCard key={benefit.id} benefit={benefit} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-muted-foreground text-lg">Nenhum benefício encontrado.</p>
            </div>
          )}
        </div>

        {/* You can add a Compare Plans Button here if needed */}

        {/* You can add an FAQ Accordion here if needed */}

        {/* Contact HR Button */}
        {isMobile ? (
          <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-10">
            {contactHRButton}
          </div>
        ) : (
          contactHRButton
        )}
      </div>
    </DashboardLayout>
  );
};

export default Benefits;
