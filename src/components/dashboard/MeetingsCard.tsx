
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { Link } from 'react-router-dom';
import { Separator } from "@/components/ui/separator";

export const MeetingsCard: React.FC = () => {
  // Mock data - in a real app, this would come from calendar API
  const meetings = [
    {
      id: 1,
      title: "Introdução da Equipa",
      time: "Hoje, 14:00",
      host: "Miguel Joel"
    },
    {
      id: 2,
      title: "Sessão de Instalação TI",
      time: "Amanhã, 10:00",
      host: "João Tavares"
    },
    {
      id: 3,
      title: "Onbording de Recursos Humanos",
      time: "9 de Maio, 11:30",
      host: "Jéssica Pires"
    }
  ];

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Próximas Reuniões</CardTitle>
          <Calendar className="text-muted-foreground h-5 w-5" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {meetings.map((meeting, index) => (
            <div key={meeting.id}>
              {index > 0 && <Separator className="my-2" />}
              <div>
                <h3 className="font-medium text-sm">{meeting.title}</h3>
                <div className="flex flex-col sm:flex-row sm:justify-between text-xs text-muted-foreground mt-1">
                  <span>{meeting.time}</span>
                  <span>Anfitrião: {meeting.host}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="pt-0">
        <Button asChild variant="outline" size="sm">
          <Link to="/calendar">Ver Calendário</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
