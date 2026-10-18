import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "lucide-react";
import { Separator } from "@/components/ui/separator";

const meetings = [
  {
    id: 1,
    title: "Introdução da Equipa",
    time: "Hoje, 14:00",
    host: "Grace Lee",
  },
  {
    id: 2,
    title: "Sessão de Configuração de TI",
    time: "Amanhã, 10:00",
    host: "Rui Almeida",
  },
  {
    id: 3,
    title: "Sessão de Integração com RH",
    time: "9 de Maio, 11:30",
    host: "Sofia Garcia",
  },
];

export const MeetingsCard: React.FC = () => {
  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold">Próximas reuniões</CardTitle>
          <Calendar className="size-5 text-muted-foreground" aria-hidden="true" />
        </div>
      </CardHeader>
      <CardContent className="pb-2">
        <div className="space-y-3">
          {meetings.map((meeting, index) => (
            <div key={meeting.id}>
              {index > 0 && <Separator className="my-3" />}
              <div>
                <h3 className="text-sm font-medium">{meeting.title}</h3>
                <div className="mt-1 flex flex-col text-xs text-muted-foreground sm:flex-row sm:justify-between">
                  <span>{meeting.time}</span>
                  <span>Anfitrião: {meeting.host}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Dados de exemplo — a agenda será sincronizada com o calendário da empresa.
        </p>
      </CardContent>
    </Card>
  );
};
