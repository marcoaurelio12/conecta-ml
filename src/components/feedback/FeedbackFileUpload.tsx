
import React, { useState, useRef } from "react";
import { Upload } from "lucide-react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";

interface FeedbackFileUploadProps {
  onFileSelected: (file: File) => void;
  isUploading: boolean;
}

const FeedbackFileUpload: React.FC<FeedbackFileUploadProps> = ({
  onFileSelected,
  isUploading,
}) => {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (validateFile(droppedFile)) {
        setFile(droppedFile);
        onFileSelected(droppedFile);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (validateFile(selectedFile)) {
        setFile(selectedFile);
        onFileSelected(selectedFile);
      }
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleRemove = () => {
    setFile(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
  };

  return (
    <Card
      className={`cursor-pointer ${
        dragActive ? "border-primary" : ""
      } transition-all duration-200`}
      onDragEnter={handleDrag}
      onClick={!file ? handleClick : undefined}
    >
      <CardContent className="p-6">
        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept=".jpg,.jpeg,.png,.pdf"
          onChange={handleChange}
          disabled={isUploading}
        />

        <div
          className={`flex flex-col items-center justify-center gap-4 p-6 text-center ${
            dragActive ? "bg-muted/50" : ""
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          {file ? (
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 text-sm">
                  <Upload size={16} />
                  <span className="font-medium truncate max-w-[250px]">
                    {file.name}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemove();
                  }}
                  className="text-sm text-muted-foreground hover:text-destructive"
                  aria-label="Remover ficheiro"
                >
                  Remover
                </button>
              </div>
              <div className="w-full bg-muted h-1.5 rounded-full overflow-hidden">
                <div
                  className={`h-full bg-primary transition-all duration-300 ${
                    isUploading ? "w-3/4" : "w-full"
                  }`}
                />
              </div>
            </div>
          ) : (
            <>
              <div className="rounded-full bg-muted p-4">
                <Upload className="h-6 w-6" />
              </div>
              <div>
                <p className="text-base font-medium mb-1">
                  Arraste e largue o seu ficheiro aqui ou clique para procurar
                </p>
                <p className="text-sm text-muted-foreground">
                  JPG, PNG ou PDF (máx. 5MB)
                </p>
              </div>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FeedbackFileUpload;
