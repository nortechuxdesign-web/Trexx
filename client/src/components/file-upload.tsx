import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { CloudUpload, X, CheckCircle } from "lucide-react";

interface FileUploadProps {
  onUpload: (logoPath: string) => void;
}

interface UploadResponse {
  success: boolean;
  logoPath: string;
  fileName: string;
  dimensions: string;
}

export default function FileUpload({ onUpload }: FileUploadProps) {
  const [dragOver, setDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    preview: string;
    path: string;
  } | null>(null);
  const { toast } = useToast();

  const uploadMutation = useMutation({
    mutationFn: async (file: File): Promise<UploadResponse> => {
      const formData = new FormData();
      formData.append("logo", file);

      const response = await fetch("/api/upload-logo", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Upload failed");
      }

      return response.json();
    },
    onSuccess: (data) => {
      const fileSize = uploadedFile?.size && uploadedFile.size.includes("KB") ? 
        uploadedFile.size : 
        `${Math.round(parseInt(uploadedFile?.size || "0") / 1024)} KB`;

      setUploadedFile({
        name: data.fileName,
        size: fileSize,
        preview: data.logoPath,
        path: data.logoPath,
      });
      
      onUpload(data.logoPath);
      
      toast({
        title: "Logo enviado com sucesso!",
        description: `Dimensões: ${data.dimensions}`,
      });
    },
    onError: (error) => {
      toast({
        title: "Erro no upload",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleFileSelect = (file: File) => {
    // Validate file type
    if (!file.type.includes("png")) {
      toast({
        title: "Formato inválido",
        description: "Apenas arquivos PNG são aceitos",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (10MB max)
    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Arquivo muito grande",
        description: "O arquivo deve ter no máximo 10MB",
        variant: "destructive",
      });
      return;
    }

    uploadMutation.mutate(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileSelect(files[0]);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    onUpload("");
  };

  if (uploadedFile) {
    return (
      <div className="flex items-center space-x-3 p-3 bg-secondary rounded-md" data-testid="uploaded-file-preview">
        <img 
          src={uploadedFile.preview} 
          alt="Logo preview" 
          className="w-12 h-12 object-cover rounded"
        />
        <div className="flex-1">
          <p className="text-sm font-medium text-foreground">{uploadedFile.name}</p>
          <p className="text-xs text-muted-foreground">{uploadedFile.size}</p>
        </div>
        <CheckCircle className="w-5 h-5 text-green-500" />
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={removeFile}
          className="text-destructive hover:text-destructive/80"
          data-testid="button-remove-file"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    );
  }

  return (
    <div
      className={`file-upload-zone border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer ${
        dragOver 
          ? "border-primary bg-primary/5" 
          : "border-border hover:border-primary"
      }`}
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragOver(true);
      }}
      onDragLeave={() => setDragOver(false)}
      onClick={() => document.getElementById("file-input")?.click()}
      data-testid="file-upload-zone"
    >
      <CloudUpload className="w-8 h-8 text-muted-foreground mx-auto mb-2" />
      <p className="text-sm text-muted-foreground mb-1">
        {uploadMutation.isPending ? "Enviando..." : "Clique para fazer upload ou arraste aqui"}
      </p>
      <p className="text-xs text-muted-foreground">PNG mínimo 500x500px</p>
      
      <input
        id="file-input"
        type="file"
        accept=".png"
        onChange={handleFileInput}
        className="hidden"
        data-testid="file-input"
      />
      
      {uploadMutation.isPending && (
        <div className="mt-2">
          <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      )}
    </div>
  );
}
