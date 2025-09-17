import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { artworkFormSchema, type ArtworkFormData, type Artwork } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import FileUpload from "@/components/file-upload";
import ColorPicker from "@/components/color-picker";
import CanvasPreview from "@/components/canvas-preview";
import { Download, WandSparkles, Eye, RotateCcw, Instagram, Gamepad2 } from "lucide-react";

export default function ArtGenerator() {
  const [logoPath, setLogoPath] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedArtwork, setGeneratedArtwork] = useState<Artwork | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<ArtworkFormData>({
    resolver: zodResolver(artworkFormSchema),
    defaultValues: {
      companyName: "",
      primaryColor: "#22C55E",
      missionType: "follow-instagram",
      templateType: "instagram",
    },
  });

  // Fetch recent artworks
  const { data: recentArtworks = [] } = useQuery<Artwork[]>({
    queryKey: ["/api/artworks/recent"],
  });

  // Create artwork mutation
  const createArtworkMutation = useMutation({
    mutationFn: async (data: ArtworkFormData & { logoPath?: string }) => {
      const response = await apiRequest("POST", "/api/artworks", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/artworks/recent"] });
    },
  });

  // Generate artwork mutation
  const generateArtworkMutation = useMutation({
    mutationFn: async (artworkId: string) => {
      const response = await apiRequest("POST", `/api/artworks/${artworkId}/generate`);
      return response.json();
    },
  });

  const onSubmit = async (data: ArtworkFormData) => {
    try {
      setIsGenerating(true);
      
      // Create artwork record
      const artwork = await createArtworkMutation.mutateAsync({
        ...data,
        logoPath,
      });

      // Generate the actual image
      await generateArtworkMutation.mutateAsync(artwork.id);
      
      setGeneratedArtwork(artwork);
      
      toast({
        title: "Arte gerada com sucesso!",
        description: "Sua arte está pronta para download",
      });
    } catch (error) {
      toast({
        title: "Erro ao gerar arte",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleLogoUpload = (uploadedLogoPath: string) => {
    setLogoPath(uploadedLogoPath);
  };

  const handleDownload = () => {
    // Canvas download will be handled by CanvasPreview component
    toast({
      title: "Download iniciado",
      description: "Sua arte está sendo baixada",
    });
  };

  const selectedMissionType = form.watch("missionType");
  const selectedColor = form.watch("primaryColor");
  const companyName = form.watch("companyName");

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Form Panel */}
      <div className="lg:col-span-2">
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-foreground mb-6">Configurações da Arte</h2>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Logo Upload */}
              <FormField
                control={form.control}
                name="companyName"
                render={() => (
                  <FormItem>
                    <FormLabel>
                      Logo da Empresa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <FileUpload onUpload={handleLogoUpload} />
                    </FormControl>
                  </FormItem>
                )}
              />

              {/* Company Name */}
              <FormField
                control={form.control}
                name="companyName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Nome da Empresa <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Digite o nome da empresa"
                        data-testid="input-company-name"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Primary Color */}
              <FormField
                control={form.control}
                name="primaryColor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Cor Primária <span className="text-destructive">*</span>
                    </FormLabel>
                    <FormControl>
                      <ColorPicker
                        value={field.value}
                        onChange={field.onChange}
                        data-testid="color-picker-primary"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Mission Type */}
              <FormField
                control={form.control}
                name="missionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      Tipo de Missão <span className="text-destructive">*</span>
                    </FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-mission-type">
                          <SelectValue placeholder="Selecione o tipo de missão" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="follow-instagram">Seguir no Instagram</SelectItem>
                        <SelectItem value="choose-proplayer">Escolha o seu Pro Player Favorito</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  type="submit"
                  className="w-full"
                  disabled={isGenerating || createArtworkMutation.isPending}
                  data-testid="button-generate-art"
                >
                  {isGenerating ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                      Gerando...
                    </>
                  ) : (
                    <>
                      <WandSparkles className="w-4 h-4 mr-2" />
                      Gerar Arte
                    </>
                  )}
                </Button>
                
                <Button
                  type="button"
                  variant="secondary"
                  className="w-full"
                  disabled={!generatedArtwork}
                  onClick={handleDownload}
                  data-testid="button-download-art"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Baixar PNG
                </Button>
              </div>
            </form>
          </Form>
        </Card>

        {/* Template Selection */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Templates Disponíveis</h3>
          <div className="grid grid-cols-2 gap-3">
            <div 
              className={`border-2 rounded-lg p-3 cursor-pointer hover:bg-primary/5 transition-colors ${
                selectedMissionType === "follow-instagram" ? "border-primary" : "border-border"
              }`}
              onClick={() => form.setValue("missionType", "follow-instagram")}
              data-testid="template-instagram"
            >
              <div className="aspect-square bg-gradient-to-br from-green-500 to-black rounded-md mb-2 flex items-center justify-center">
                <Instagram className="text-white text-xl" />
              </div>
              <p className="text-xs font-medium text-center">Instagram</p>
            </div>
            <div 
              className={`border rounded-lg p-3 cursor-pointer hover:bg-muted transition-colors ${
                selectedMissionType === "choose-proplayer" ? "border-primary" : "border-border"
              }`}
              onClick={() => form.setValue("missionType", "choose-proplayer")}
              data-testid="template-proplayer"
            >
              <div className="aspect-square bg-gradient-to-br from-green-500 to-black rounded-md mb-2 flex items-center justify-center">
                <Gamepad2 className="text-white text-xl" />
              </div>
              <p className="text-xs font-medium text-center">Pro Player</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="lg:col-span-3">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-foreground">Preview da Arte</h2>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">1080x1080px</span>
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span className="text-sm text-muted-foreground">Live Preview</span>
            </div>
          </div>
          
          <CanvasPreview
            companyName={companyName}
            primaryColor={selectedColor}
            missionType={selectedMissionType}
            logoPath={logoPath}
          />
          
          {/* Preview Controls */}
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">100%</span>
            </div>
            <div className="flex items-center space-x-2">
              <Button variant="secondary" size="sm" data-testid="button-fullscreen">
                <Eye className="w-3 h-3 mr-1" />
                Fullscreen
              </Button>
              <Button variant="secondary" size="sm" data-testid="button-reset">
                <RotateCcw className="w-3 h-3 mr-1" />
                Reset
              </Button>
            </div>
          </div>
        </Card>
        
        {/* Art History */}
        <Card className="p-6 mt-6">
          <h3 className="text-lg font-semibold text-foreground mb-4">Artes Recentes</h3>
          <div className="grid grid-cols-4 gap-3">
            {recentArtworks.map((artwork: Artwork) => (
              <div 
                key={artwork.id}
                className="aspect-square bg-gradient-to-br from-green-500 to-black rounded-lg cursor-pointer hover:ring-2 hover:ring-primary transition-all relative group"
                style={{ background: `linear-gradient(135deg, ${artwork.primaryColor} 0%, #000000 100%)` }}
                data-testid={`artwork-${artwork.id}`}
              >
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <Download className="text-white text-lg" />
                </div>
              </div>
            ))}
            {recentArtworks.length < 4 && (
              <div className="aspect-square border-2 border-dashed border-border rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                <div className="w-6 h-6 border-2 border-muted-foreground border-t-transparent rounded-full" />
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}
