import React, { useState, useRef } from "react";
import { Paperclip, Upload, X } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackFileUploadProps {
  onFileSelected: (file: File) => void;
}

const FeedbackFileUpload: React.FC<FeedbackFileUploadProps> = ({ onFileSelected }) => {
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateFile = (file: File): boolean => {
    const validTypes = ["image/jpeg", "image/jpg", "image/png", "application/pdf"];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!validTypes.includes(file.type)) {
      toast.error("Tipo de ficheiro inválido. Por favor, carregue um ficheiro JPG, PNG ou PDF.");
      return false;
    }

    if (file.size > maxSize) {
      toast.error("O ficheiro é muito grande. O tamanho máximo é de 5MB.");
      return false;
    }

    return true;
  };

  const acceptFile = (candidate: File) => {
    if (validateFile(candidate)) {
      setFile(candidate);
      onFileSelected(candidate);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      acceptFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      acceptFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  const handleDropZoneKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      inputRef.current?.click();
    }
  };

  return (
    <Card
      className={`transition-colors duration-fast ${
        dragActive ? "border-primary" : ""
      }`}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
    >
      <CardContent className="p-6">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          aria-hidden="true"
          tabIndex={-1}
        />

        {file ? (
          <div className="flex items-center justify-between gap-4 rounded-lg border bg-muted/40 px-4 py-3">
            <div className="flex min-w-0 items-center gap-2 text-sm">
              <Paperclip className="size-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span className="truncate font-medium">{file.name}</span>
              <span className="shrink-0 text-muted-foreground">
                ({Math.round(file.size / 1024)} KB)
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemove}
              className="flex shrink-0 items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-destructive"
            >
              <X className="size-4" aria-hidden="true" />
              Remover
            </button>
          </div>
        ) : (
          <div
            role="button"
            tabIndex={0}
            aria-label="Escolher ficheiro para anexar (JPG, PNG ou PDF até 5MB)"
            onClick={() => inputRef.current?.click()}
            onKeyDown={handleDropZoneKeyDown}
            className={`flex cursor-pointer flex-col items-center justify-center gap-4 rounded-lg p-6 text-center outline-none transition-colors duration-fast focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
              dragActive ? "bg-muted/50" : ""
            }`}
          >
            <div className="rounded-full bg-muted p-4">
              <Upload className="h-6 w-6" aria-hidden="true" />
            </div>
            <div>
              <p className="mb-1 text-base font-medium">
                Arraste e largue o seu ficheiro aqui, ou prima Enter para procurar
              </p>
              <p className="text-sm text-muted-foreground">JPG, PNG ou PDF (máx. 5MB)</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default FeedbackFileUpload;
