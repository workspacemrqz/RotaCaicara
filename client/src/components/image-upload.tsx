import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, X, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ImageUploadProps {
  value: string;
  onChange: (url: string) => void;
  label?: string;
}

export default function ImageUpload({ value, onChange, label }: ImageUploadProps) {
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const uploadToImgBB = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("image", file);
    formData.append("key", "e3dbd564060fbccd1a8290cb22925d7f");

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Upload failed");
    }

    const data = await response.json();
    return data.data.url;
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Erro",
        description: "Por favor, selecione apenas arquivos de imagem.",
        variant: "destructive",
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erro",
        description: "A imagem deve ter no máximo 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const imageUrl = await uploadToImgBB(file);
      onChange(imageUrl);
      toast({
        title: "Sucesso",
        description: "Imagem enviada com sucesso!",
      });
    } catch (error) {
      console.error("Error uploading image:", error);
      toast({
        title: "Erro",
        description: "Falha ao enviar a imagem. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = () => {
    onChange("");
  };

  return (
    <div className="space-y-4">
      {label && <Label>{label}</Label>}
      
      {value ? (
        <div className="relative">
          <img
            src={value}
            alt={label}
            className="w-full h-48 object-cover rounded-lg border"
            style={{
              objectFit: 'cover',
              objectPosition: 'center'
            }}
          />
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2"
            onClick={removeImage}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      ) : (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center">
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            disabled={isUploading}
            className="hidden"
            id={`upload-${label}`}
          />
          <Label
            htmlFor={`upload-${label}`}
            className={`cursor-pointer flex flex-col items-center space-y-2 ${
              isUploading ? "opacity-50" : ""
            }`}
          >
            {isUploading ? (
              <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
            ) : (
              <Upload className="w-8 h-8 text-gray-400" />
            )}
            <span className="text-sm text-gray-500">
              {isUploading ? "Enviando..." : "Clique para selecionar uma imagem"}
            </span>
            <span className="text-xs text-gray-400">
              PNG, JPG até 5MB
            </span>
          </Label>
        </div>
      )}
    </div>
  );
}