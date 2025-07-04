import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Settings, Home, Megaphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

// Settings schemas for each section
const generalSettingsSchema = z.object({
  site_name: z.string().min(1, "Nome do site é obrigatório"),
  logoUrl: z.string().url("URL deve ser válida").optional().or(z.literal("")),
  primaryColor: z.string().min(4, "Cor primária é obrigatória"),
  contactEmail: z.string().email("Email deve ser válido").optional().or(z.literal("")),
  contactPhone: z.string().optional(),
});

const homeSettingsSchema = z.object({
  featuredEnabled: z.boolean(),
  heroTitle: z.string().optional(),
  heroSubtitle: z.string().optional(),
  heroDescription: z.string().optional(),
});

const announceSettingsSchema = z.object({
  submitEnabled: z.boolean(),
  submitTitle: z.string().optional(),
  submitDescription: z.string().optional(),
  submitButtonText: z.string().optional(),
});

export default function AdminSettings() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("general");

  // Fetch current settings
  const { data: settings = [], isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings");
      return response.json();
    }
  });

  // Helper function to get setting value
  const getSetting = (key: string, defaultValue: any = "") => {
    const setting = settings.find((s: any) => s.key === key);
    if (typeof defaultValue === "boolean") {
      return setting?.value === "true";
    }
    return setting?.value || defaultValue;
  };

  // General settings form
  const generalForm = useForm<z.infer<typeof generalSettingsSchema>>({
    resolver: zodResolver(generalSettingsSchema),
    values: {
      site_name: getSetting("site_name", "Rota Caiçara"),
      logoUrl: getSetting("logoUrl"),
      primaryColor: getSetting("primaryColor", "#006C84"),
      contactEmail: getSetting("contactEmail"),
      contactPhone: getSetting("contactPhone"),
    },
  });

  // Home settings form
  const homeForm = useForm<z.infer<typeof homeSettingsSchema>>({
    resolver: zodResolver(homeSettingsSchema),
    values: {
      featuredEnabled: getSetting("featuredEnabled", true),
      heroTitle: getSetting("heroTitle", "Rota Caiçara"),
      heroSubtitle: getSetting("heroSubtitle", "Descubra o melhor de São Sebastião"),
      heroDescription: getSetting("heroDescription"),
    },
  });

  // Announce settings form
  const announceForm = useForm<z.infer<typeof announceSettingsSchema>>({
    resolver: zodResolver(announceSettingsSchema),
    values: {
      submitEnabled: getSetting("submitEnabled", true),
      submitTitle: getSetting("submitTitle", "Anuncie Sua Empresa"),
      submitDescription: getSetting("submitDescription", "Cadastre seu negócio e alcance mais clientes"),
      submitButtonText: getSetting("submitButtonText", "Cadastrar Empresa"),
    },
  });

  // Update settings mutations
  const updateGeneralSettings = useMutation({
    mutationFn: async (data: z.infer<typeof generalSettingsSchema>) => {
      return apiRequest("PATCH", "/api/settings/general", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Configurações gerais atualizadas com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  const updateHomeSettings = useMutation({
    mutationFn: async (data: z.infer<typeof homeSettingsSchema>) => {
      return apiRequest("PATCH", "/api/settings/home", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Configurações da home atualizadas com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  const updateAnnounceSettings = useMutation({
    mutationFn: async (data: z.infer<typeof announceSettingsSchema>) => {
      return apiRequest("PATCH", "/api/settings/announce", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      toast({ title: "Configurações de anúncios atualizadas com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao salvar configurações",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  // Form submission handlers
  const handleGeneralSubmit = async (data: z.infer<typeof generalSettingsSchema>) => {
    try {
      await updateGeneralSettings.mutateAsync(data);
      
      // Apply theme changes immediately
      if (data.primaryColor) {
        document.documentElement.style.setProperty('--color-primary', data.primaryColor);
      }
    } catch (error) {
      console.error("Error updating general settings:", error);
    }
  };

  const handleHomeSubmit = async (data: z.infer<typeof homeSettingsSchema>) => {
    try {
      await updateHomeSettings.mutateAsync(data);
    } catch (error) {
      console.error("Error updating home settings:", error);
    }
  };

  const handleAnnounceSubmit = async (data: z.infer<typeof announceSettingsSchema>) => {
    try {
      await updateAnnounceSettings.mutateAsync(data);
    } catch (error) {
      console.error("Error updating announce settings:", error);
    }
  };

  if (isLoading) {
    return <div className="p-6">Carregando configurações...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#006C84]">Configurações do Site</h2>
        <Button 
          onClick={() => window.location.reload()}
          variant="outline"
          className="border-[#006C84] text-[#006C84] hover:bg-[#006C84] hover:text-white"
        >
          Atualizar Informações
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Geral
          </TabsTrigger>
          <TabsTrigger value="home" className="flex items-center gap-2">
            <Home className="h-4 w-4" />
            Home
          </TabsTrigger>
          <TabsTrigger value="announce" className="flex items-center gap-2">
            <Megaphone className="h-4 w-4" />
            Anuncie Sua Empresa
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Configurações Gerais</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...generalForm}>
                  <form onSubmit={generalForm.handleSubmit(handleGeneralSubmit)} className="space-y-4">
                    <FormField
                      control={generalForm.control}
                      name="site_name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Site</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="logoUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>URL do Logo</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="https://exemplo.com/logo.png" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={generalForm.control}
                      name="primaryColor"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cor Primária</FormLabel>
                          <div className="flex items-center gap-2">
                            <FormControl>
                              <Input {...field} type="color" className="w-20 h-10" />
                            </FormControl>
                            <Input {...field} placeholder="#006C84" className="flex-1" />
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={generalForm.control}
                        name="contactEmail"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Email de Contato</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={generalForm.control}
                        name="contactPhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone de Contato</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateGeneralSettings.isPending}
                        className="bg-[#006C84] hover:bg-[#005A6A]"
                      >
                        {updateGeneralSettings.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="home" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Configurações da Página Inicial</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...homeForm}>
                  <form onSubmit={homeForm.handleSubmit(handleHomeSubmit)} className="space-y-4">
                    <FormField
                      control={homeForm.control}
                      name="featuredEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Empresas em Destaque</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Exibir seção de empresas em destaque na página inicial
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={homeForm.control}
                      name="heroTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título Principal</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={homeForm.control}
                      name="heroSubtitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subtítulo</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={homeForm.control}
                      name="heroDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateHomeSettings.isPending}
                        className="bg-[#006C84] hover:bg-[#005A6A]"
                      >
                        {updateHomeSettings.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="announce" className="space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Configurações de Anúncios</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...announceForm}>
                  <form onSubmit={announceForm.handleSubmit(handleAnnounceSubmit)} className="space-y-4">
                    <FormField
                      control={announceForm.control}
                      name="submitEnabled"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                          <div className="space-y-0.5">
                            <FormLabel className="text-base">Cadastro de Empresas</FormLabel>
                            <div className="text-sm text-muted-foreground">
                              Permitir que empresas se cadastrem no site
                            </div>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={announceForm.control}
                      name="submitTitle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Título da Seção</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={announceForm.control}
                      name="submitDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição</FormLabel>
                          <FormControl>
                            <Textarea {...field} rows={3} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={announceForm.control}
                      name="submitButtonText"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto do Botão</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end">
                      <Button 
                        type="submit" 
                        disabled={updateAnnounceSettings.isPending}
                        className="bg-[#006C84] hover:bg-[#005A6A]"
                      >
                        {updateAnnounceSettings.isPending ? "Salvando..." : "Salvar"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </div>
  );
}