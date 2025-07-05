import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import AdminLogin from "@/components/admin-login";
// import IconSelector from "@/components/icon-selector";
import { useSettings } from "@/context/SettingsContext";
import {
  insertSiteSettingSchema,
  insertBusinessSchema,
  insertCategorySchema,
  insertBusinessRegistrationSchema,
  type SiteSetting,
  type InsertSiteSetting,
  type InsertBusinessRegistration,
  type BusinessRegistration,
  type Category,
  type Business,
  type Analytics,
} from "@shared/schema";
import { z } from "zod";
import {
  BarChart3,
  Users,
  FileText,
  Tag,
  Settings,
  Search,
  Plus,
  Edit,
  Trash2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

// Scroll to top helper
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

function SettingsConfiguration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings, isLoading, refreshSettings } = useSettings();

  // Fetch settings from database
  const { data: dbSettings, isLoading: dbLoading } = useQuery({
    queryKey: ["/api/admin/settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/settings");
      if (!response.ok) {
        throw new Error("Failed to fetch settings");
      }
      return response.json();
    },
  });

  // Usar os dados do banco ou fallback para settings do contexto
  const currentSettings = dbSettings || settings;

  // Form with database values
  const form = useForm<InsertSiteSetting>({
    resolver: zodResolver(insertSiteSettingSchema.partial()),
    defaultValues: {
      siteName: "",
      locality: "",
      headline1: "",
      headline2: "",
      headline3: "",
      headline4: "",
      tagline1: "",
      tagline2: "",
      tagline3: "",
      tagline4: "",
      phone: "",
      email: "",
      address: "",
      logoUrl: "",
      instagramUrl: "",
      whatsappUrl: "",
      facebookUrl: "",
      footerDescription: "",
      advertiseHeadline: "",
      advertiseSubtitle1: "",
      advertiseSubtitle2: "",
      faq1Question: "",
      faq1Answer: "",
      faq2Question: "",
      faq2Answer: "",
      faq3Question: "",
      faq3Answer: "",
      faq4Question: "",
      faq4Answer: "",
    },
  });

  // Update form when settings are loaded
  useEffect(() => {
    if (currentSettings) {
      form.reset({
        siteName: currentSettings.siteName || "",
        locality: currentSettings.locality || "",
        headline1: currentSettings.headline1 || "",
        headline2: currentSettings.headline2 || "",
        headline3: currentSettings.headline3 || "",
        headline4: currentSettings.headline4 || "",
        tagline1: currentSettings.tagline1 || "",
        tagline2: currentSettings.tagline2 || "",
        tagline3: currentSettings.tagline3 || "",
        tagline4: currentSettings.tagline4 || "",
        phone: currentSettings.phone || "",
        email: currentSettings.email || "",
        address: currentSettings.address || "",
        logoUrl: currentSettings.logoUrl || "",
        instagramUrl: currentSettings.instagramUrl || "",
        whatsappUrl: currentSettings.whatsappUrl || "",
        facebookUrl: currentSettings.facebookUrl || "",
        footerDescription: currentSettings.footerDescription || "",
        advertiseHeadline: currentSettings.advertiseHeadline || "",
        advertiseSubtitle1: currentSettings.advertiseSubtitle1 || "",
        advertiseSubtitle2: currentSettings.advertiseSubtitle2 || "",
        faq1Question: currentSettings.faq1Question || "",
        faq1Answer: currentSettings.faq1Answer || "",
        faq2Question: currentSettings.faq2Question || "",
        faq2Answer: currentSettings.faq2Answer || "",
        faq3Question: currentSettings.faq3Question || "",
        faq3Answer: currentSettings.faq3Answer || "",
        faq4Question: currentSettings.faq4Question || "",
        faq4Answer: currentSettings.faq4Answer || "",
      });
    }
  }, [currentSettings, form]);

  const updateSettingsMutation = useMutation({
    mutationFn: async (data: Partial<InsertSiteSetting>) => {
      const response = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update settings");
      }
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Sucesso",
        description: "Configurações atualizadas com sucesso!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      refreshSettings();
    },
    onError: (error) => {
      toast({
        title: "Erro",
        description: "Falha ao atualizar configurações",
        variant: "destructive",
      });
      console.error("Settings update error:", error);
    },
  });

  const onSubmit = (data: InsertSiteSetting) => {
    updateSettingsMutation.mutate(data);
  };

  if (isLoading || dbLoading) {
    return (
      <div className="p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#006C84] mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#006C84] mb-2">Configurações do Site</h2>
        <p className="text-gray-600">Gerencie as configurações gerais do site</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {/* Informações Básicas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Informações Básicas</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Site</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Rota Caiçara" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="locality"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Localidade</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: São Sebastião" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="logoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL da Logo</FormLabel>
                    <FormControl>
                      <Input placeholder="https://exemplo.com/logo.png" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* Títulos e Subtítulos */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Títulos da Página Inicial</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headline1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título 1</FormLabel>
                      <FormControl>
                        <Input placeholder="DESCUBRA AS MELHORES EMPRESAS" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headline2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título 2</FormLabel>
                      <FormControl>
                        <Input placeholder="DE SÃO SEBASTIÃO" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="headline3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título 3</FormLabel>
                      <FormControl>
                        <Input placeholder="CONECTANDO VOCÊ AOS MELHORES" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headline4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título 4</FormLabel>
                      <FormControl>
                        <Input placeholder="NEGÓCIOS DA CIDADE" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tagline1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Conectando você aos melhores negócios" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 2</FormLabel>
                      <FormControl>
                        <Input placeholder="Descubra, conecte-se, prospere" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="tagline3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 3</FormLabel>
                      <FormControl>
                        <Input placeholder="Sua empresa na palma da mão" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="tagline4"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 4</FormLabel>
                      <FormControl>
                        <Input placeholder="O futuro do comércio local" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Contato */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Informações de Contato</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input placeholder="(12) 99999-0000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" placeholder="contato@exemplo.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço</FormLabel>
                      <FormControl>
                        <Input placeholder="São Sebastião, SP" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Redes Sociais */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Redes Sociais</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram</FormLabel>
                      <FormControl>
                        <Input placeholder="https://instagram.com/seu_perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="whatsappUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input placeholder="https://wa.me/5512999999999" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="facebookUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Facebook</FormLabel>
                      <FormControl>
                        <Input placeholder="https://facebook.com/seu_perfil" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Página Anuncie */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Página "Anuncie"</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="advertiseHeadline"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título Principal</FormLabel>
                    <FormControl>
                      <Input placeholder="SUA MARCA EM DESTAQUE ENTRE AS MELHORES" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="advertiseSubtitle1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 1</FormLabel>
                      <FormControl>
                        <Input placeholder="Onde excelência encontra visibilidade!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advertiseSubtitle2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo 2</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Junte-se à nossa comunidade sustentável..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Rodapé</CardTitle>
            </CardHeader>
            <CardContent>
              <FormField
                control={form.control}
                name="footerDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição do Rodapé</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Conectando você às melhores empresas da cidade..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          {/* FAQs */}
          <Card>
            <CardHeader>
              <CardTitle className="text-[#006C84]">Perguntas Frequentes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {[1, 2, 3, 4].map((num) => (
                <div key={num} className="space-y-2">
                  <h4 className="font-medium text-gray-700">FAQ {num}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name={`faq${num}Question` as keyof InsertSiteSetting}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pergunta {num}</FormLabel>
                          <FormControl>
                            <Input placeholder={`Pergunta ${num}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`faq${num}Answer` as keyof InsertSiteSetting}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resposta {num}</FormLabel>
                          <FormControl>
                            <Textarea placeholder={`Resposta ${num}`} {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              type="submit"
              className="bg-[#006C84] hover:bg-[#005066]"
              disabled={updateSettingsMutation.isPending}
            >
              {updateSettingsMutation.isPending ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}

export default function Admin() {
  // Estado de autenticação
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem("adminLoggedIn") === "true";
  });

  // Se não estiver autenticado, mostrar tela de login
  if (!isAuthenticated) {
    return <AdminLogin onLogin={() => setIsAuthenticated(true)} />;
  }

  return <AuthenticatedAdmin onLogout={() => {
    localStorage.removeItem("adminLoggedIn");
    setIsAuthenticated(false);
  }} />;
}

function AuthenticatedAdmin({ onLogout }: { onLogout: () => void }) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const businessesQuery = useQuery({
    queryKey: ["/api/businesses"],
    queryFn: async () => {
      console.log("Fetching businesses...");
      const response = await fetch("/api/businesses");
      if (!response.ok) {
        throw new Error("Failed to fetch businesses");
      }
      const data = await response.json();
      console.log("API Response for /api/businesses:", data);
      return Array.isArray(data) ? data : [];
    },
  });

  const businessRegistrationsQuery = useQuery({
    queryKey: ["/api/admin/business-registrations"],
    queryFn: async () => {
      console.log("Fetching business registrations...");
      const response = await fetch("/api/admin/business-registrations");
      if (!response.ok) {
        throw new Error("Failed to fetch business registrations");
      }
      const data = await response.json();
      console.log("API Response for /api/admin/business-registrations:", data);
      return Array.isArray(data) ? data : [];
    },
  });

  const categoriesQuery = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  const analyticsQuery = useQuery({
    queryKey: ["/api/admin/analytics"],
    queryFn: async () => {
      const response = await fetch("/api/admin/analytics");
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      const data = await response.json();
      console.log("API Response for /api/admin/analytics:", data);
      return Array.isArray(data) ? data : [];
    },
  });

  // Ensure we have safe data defaults - always arrays
  const businesses = Array.isArray(businessesQuery.data) ? businessesQuery.data : [];
  const businessRegistrations = Array.isArray(businessRegistrationsQuery.data) ? businessRegistrationsQuery.data : [];
  const categories = Array.isArray(categoriesQuery.data) ? categoriesQuery.data : [];
  const analytics = Array.isArray(analyticsQuery.data) ? analyticsQuery.data : [];

  console.log("Admin Panel Debug:", {
    businesses,
    businessesLoading: businessesQuery.isLoading,
    businessesError: businessesQuery.error,
    categories,
    businessRegistrations
  });

  // State management
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessSearchFilter, setBusinessSearchFilter] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] =
    useState(false);
  const [viewRegistrationDialogOpen, setViewRegistrationDialogOpen] =
    useState(false);
  const [editingRegistration, setEditingRegistration] =
    useState<BusinessRegistration | null>(null);
  const [viewingRegistration, setViewingRegistration] =
    useState<BusinessRegistration | null>(null);

  // Business form with validation
  const businessForm = useForm<z.infer<typeof insertBusinessSchema>>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      whatsapp: "",
      address: "",
      categoryId: 0,
      email: "",
      instagram: "",
      facebook: "",
      website: "",
      journalLink: "",
      imageUrl: "",
      featured: false,
      certified: false,
      active: true,
    },
  });

  // Category form
  const categoryForm = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "store",
      active: true,
    },
  });

  // Registration form with validation
  const registrationForm = useForm<InsertBusinessRegistration>({
    resolver: zodResolver(insertBusinessRegistrationSchema),
    defaultValues: {
      businessName: "",
      categoryId: 1,
      phone: "",
      whatsapp: "",
      address: "",
      description: "",
      instagram: "",
      facebook: "",
      contactEmail: "",
      imageUrl: "",
    },
  });

  // Business mutations
  const createBusiness = useMutation({
    mutationFn: async (data: z.infer<typeof insertBusinessSchema>) => {
      return apiRequest("POST", "/api/businesses", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio criado com sucesso" });
      setBusinessDialogOpen(false);
      setEditingBusiness(null);
      setCurrentStep(1);
      businessForm.reset();
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar negócio",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: z.infer<typeof insertBusinessSchema>;
    }) => {
      return apiRequest("PATCH", `/api/businesses/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio atualizado com sucesso" });
      setBusinessDialogOpen(false);
      setEditingBusiness(null);
      setCurrentStep(1);
      businessForm.reset();
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar negócio",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const deleteBusiness = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/businesses/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio excluído com sucesso" });
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir negócio",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Registration mutations
  const deleteRegistration = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/business-registrations/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/business-registrations"],
      });
      toast({ title: "Cadastro excluído com sucesso" });
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir cadastro",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Registration edit mutation
  const updateRegistration = useMutation({
    mutationFn: async (data: InsertBusinessRegistration) => {
      return apiRequest(
        "PUT",
        `/api/admin/business-registrations/${editingRegistration!.id}`,
        data,
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/admin/business-registrations"],
      });
      toast({ title: "Cadastro atualizado com sucesso!" });
      setRegistrationDialogOpen(false);
      setEditingRegistration(null);
      registrationForm.reset();
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar cadastro",
        variant: "destructive",
      });
    },
  });

  // Registration handlers
  const handleEditRegistration = (registration: BusinessRegistration) => {
    setEditingRegistration(registration);
    registrationForm.reset({
      businessName: registration.businessName,
      categoryId: registration.categoryId,
      phone: registration.phone,
      whatsapp: registration.whatsapp,
      address: registration.address,
      description: registration.description,
      instagram: registration.instagram || "",
      facebook: registration.facebook || "",
      contactEmail: registration.contactEmail || "",
      imageUrl: registration.imageUrl || "",
    });
    setRegistrationDialogOpen(true);
    scrollToTop();
  };

  const handleRegistrationSubmit = (data: InsertBusinessRegistration) => {
    updateRegistration.mutate(data);
  };

  const handleViewRegistration = (registration: BusinessRegistration) => {
    setViewingRegistration(registration);
    setViewRegistrationDialogOpen(true);
  };

  // Publish registration as business
  const publishRegistration = useMutation({
    mutationFn: async (registration: BusinessRegistration) => {
      const businessData = {
        name: registration.businessName,
        description: registration.description,
        phone: registration.phone,
        whatsapp: registration.whatsapp,
        address: registration.address,
        categoryId: registration.categoryId,
        email: registration.contactEmail || "",
        instagram: registration.instagram || "",
        facebook: registration.facebook || "",
        website: "",
        journalLink: "",
        imageUrl: registration.imageUrl || "",
        featured: false,
        certified: false,
        active: true,
      };
      return apiRequest("POST", "/api/businesses", businessData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio publicado com sucesso!" });
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao publicar negócio",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Category mutations
  const createCategory = useMutation({
    mutationFn: async (data: z.infer<typeof insertCategorySchema>) => {
      return apiRequest("POST", "/api/categories", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria criada com sucesso" });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      categoryForm.reset();
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao criar categoria",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const updateCategory = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: z.infer<typeof insertCategorySchema>;
    }) => {
      return apiRequest("PATCH", `/api/categories/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria atualizada com sucesso" });
      setCategoryDialogOpen(false);
      setEditingCategory(null);
      categoryForm.reset();
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar categoria",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria excluída com sucesso" });
      scrollToTop();
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao excluir categoria",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    },
  });

  // Business form handlers
  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    businessForm.reset({
      name: business.name,
      description: business.description,
      phone: business.phone || "",
      whatsapp: business.whatsapp || "",
      address: business.address || "",
      categoryId: business.categoryId,
      email: business.email || "",
      instagram: business.instagram || "",
      facebook: business.facebook || "",
      website: business.website || "",
      journalLink: business.journalLink || "",
      imageUrl: business.imageUrl || "",
      featured: business.featured,
      certified: business.certified,
      active: business.active,
    });
    setCurrentStep(1);
    setBusinessDialogOpen(true);
    scrollToTop();
  };

  const handleNewBusiness = () => {
    setEditingBusiness(null);
    businessForm.reset();
    setCurrentStep(1);
    setBusinessDialogOpen(true);
    scrollToTop();
  };

  const handleBusinessSubmit = (data: z.infer<typeof insertBusinessSchema>) => {
    if (editingBusiness) {
      updateBusiness.mutate({ id: editingBusiness.id, data });
    } else {
      createBusiness.mutate(data);
    }
  };

  // Category form handlers
  const handleEditCategory = (category: Category) => {
    setEditingCategory(category);
    categoryForm.reset({
      name: category.name,
      slug: category.slug,
      icon: category.icon,
      active: category.active || false,
    });
    setCategoryDialogOpen(true);
    scrollToTop();
  };

  const handleNewCategory = () => {
    setEditingCategory(null);
    categoryForm.reset({
      name: "",
      slug: "",
      icon: "🏪",
      active: true,
    });
    setCategoryDialogOpen(true);
    scrollToTop();
  };

  const handleCategorySubmit = (data: z.infer<typeof insertCategorySchema>) => {
    if (editingCategory) {
      updateCategory.mutate({ id: editingCategory.id, data });
    } else {
      createCategory.mutate(data);
    }
  };

  // Dialog close handlers
  const handleBusinessCancel = () => {
    setBusinessDialogOpen(false);
    setEditingBusiness(null);
    setCurrentStep(1);
    businessForm.reset();
    scrollToTop();
  };

  const handleCategoryCancel = () => {
    setCategoryDialogOpen(false);
    setEditingCategory(null);
    categoryForm.reset();
    scrollToTop();
  };

  // Step navigation
  const nextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      scrollToTop();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  };

  // Filter businesses
  const filteredBusinesses = Array.isArray(businesses) ? businesses.filter(
    (business) =>
      business.name
        .toLowerCase()
        .includes(businessSearchFilter.toLowerCase()) ||
      business.description
        .toLowerCase()
        .includes(businessSearchFilter.toLowerCase()),
  ) : [];

  // Debug logging
  console.log("Admin Panel Debug:", {
    businesses: businesses,
    businessesLoading: businessesQuery.isLoading,
    businessesError: businessesQuery.error,
    categories: categories,
    businessRegistrations: businessRegistrations
  });

  // Calculate analytics
  const totalBusinesses = Array.isArray(businesses) ? businesses.length : 0;
  const totalRegistrations = Array.isArray(businessRegistrations) ? businessRegistrations.length : 0;
  const totalCategories = Array.isArray(categories) ? categories.length : 0;
  const pendingRegistrations = Array.isArray(businessRegistrations)
    ? businessRegistrations.filter((reg) => !reg.processed).length
    : 0;

  // Show loading state
  if (businessesQuery.isLoading || categoriesQuery.isLoading || businessRegistrationsQuery.isLoading || analyticsQuery.isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#006C84] mx-auto mb-4"></div>
            <p className="text-[#006C84]">Carregando dados do painel...</p>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (businessesQuery.error || categoriesQuery.error || businessRegistrationsQuery.error || analyticsQuery.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar dados</h2>
            <p className="text-gray-600 mb-4">
              {businessesQuery.error?.message || categoriesQuery.error?.message || businessRegistrationsQuery.error?.message || analyticsQuery.error?.message}
            </p>
            <Button onClick={() => window.location.reload()}>
              Recarregar Página
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-3 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 sm:mb-8 flex justify-between items-start">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
              Painel Administrativo
            </h1>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Gerencie seu diretório de negócios locais
            </p>
          </div>
          <Button
            onClick={onLogout}
            variant="outline"
            className="text-red-600 border-red-600 hover:bg-red-50"
          >
            Sair
          </Button>
        </div>

        <Tabs defaultValue="analytics" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto p-1">
            <TabsTrigger value="analytics" onClick={scrollToTop} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Analytics</span>
              <span className="sm:hidden">Stats</span>
            </TabsTrigger>
            <TabsTrigger value="businesses" onClick={scrollToTop} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Negócios</span>
              <span className="sm:hidden">Empresas</span>
            </TabsTrigger>
            <TabsTrigger value="registrations" onClick={scrollToTop} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <FileText className="w-4 h-4" />
              <span className="hidden sm:inline">Cadastros</span>
              <span className="sm:hidden">Pedidos</span>
            </TabsTrigger>
            <TabsTrigger value="settings" onClick={scrollToTop} className="flex flex-col sm:flex-row items-center gap-1 sm:gap-2 p-2 sm:p-3 text-xs sm:text-sm">
              <Settings className="w-4 h-4" />
              <span className="hidden sm:inline">Configurações</span>
              <span className="sm:hidden">Config</span>
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Negócios
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalBusinesses}</div>
                  <p className="text-xs text-muted-foreground">
                    Negócios publicados no site
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total de Cadastros
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalRegistrations}</div>
                  <p className="text-xs text-muted-foreground">
                    Cadastros recebidos via formulário
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Categorias
                  </CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{totalCategories}</div>
                  <p className="text-xs text-muted-foreground">
                    Categorias cadastradas
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Pendentes
                  </CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {pendingRegistrations}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Cadastros aguardando aprovação
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses Tab */}
          <TabsContent value="businesses" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Buscar negócios..."
                  value={businessSearchFilter}
                  onChange={(e) => setBusinessSearchFilter(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleNewBusiness}>
                <Plus className="w-4 h-4 mr-2" />
                Novo Negócio
              </Button>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>
                  Lista de Negócios ({filteredBusinesses.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {filteredBusinesses.map((business) => (
                    <div
                      key={business.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">{business.name}</h3>
                          {business.featured && (
                            <Badge variant="secondary">Destaque</Badge>
                          )}
                          {business.certified && (
                            <Badge variant="outline">Certificado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {business.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          Categoria:{" "}
                          {categories.find((c) => c.id === business.categoryId)
                            ?.name || "N/A"}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditBusiness(business)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{business.name}
                                "? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteBusiness.mutate(business.id)
                                }
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  {filteredBusinesses.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      {businessSearchFilter
                        ? "Nenhum negócio encontrado com esse termo."
                        : "Nenhum negócio cadastrado ainda."}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Registrations Tab */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>
                  Cadastros Recebidos ({businessRegistrations.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Array.isArray(businessRegistrations) && businessRegistrations.map((registration) => (
                    <div
                      key={registration.id}
                      className="flex items-center justify-between p-4 border rounded-lg"
                    >
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold">
                            {registration.businessName}
                          </h3>
                          {registration.processed && (
                            <Badge variant="secondary">Processado</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {registration.description}
                        </p>
                        <div className="text-xs text-gray-500">
                          <div>Telefone: {registration.phone}</div>
                          <div>WhatsApp: {registration.whatsapp}</div>
                          <div>Endereço: {registration.address}</div>
                          {registration.contactEmail && (
                            <div>Email: {registration.contactEmail}</div>
                          )}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewRegistration(registration)}
                        >
                          <Search className="w-4 h-4 mr-1" />
                          Ver Cadastro
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Confirmar exclusão
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o cadastro de "
                                {registration.businessName}"? Esta ação não pode
                                ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() =>
                                  deleteRegistration.mutate(registration.id)
                                }
                              >
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                  {(!Array.isArray(businessRegistrations) || businessRegistrations.length === 0) && (
                    <div className="text-center py-8 text-gray-500">
                      Nenhum cadastro recebido ainda.
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>



          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <SettingsConfiguration />
          </TabsContent>
        </Tabs>

        {/* Business Form Dialog */}
        <Dialog open={businessDialogOpen} onOpenChange={setBusinessDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingBusiness ? "Editar Negócio" : "Novo Negócio"} - Etapa{" "}
                {currentStep}/3
              </DialogTitle>
            </DialogHeader>

            <Form {...businessForm}>
              <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Informações Básicas
                    </h3>

                    <FormField
                      control={businessForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome do Negócio *</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Digite o nome do negócio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição *</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Descreva o negócio"
                              rows={4}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="categoryId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Categoria *</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(parseInt(value))
                            }
                            value={field.value?.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Selecione uma categoria" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem
                                  key={category.id}
                                  value={category.id.toString()}
                                >
                                  {category.icon} {category.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {/* Step 2: Contact Information */}
                {currentStep === 2 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Informações de Contato
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Telefone</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(00) 0000-0000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="5300200000000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={businessForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input
                              {...field}
                              type="email"
                              placeholder="contato@empresa.com"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={businessForm.control}
                      name="address"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Endereço</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              placeholder="Endereço completo"
                              rows={2}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="website"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Website</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="https://..."
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="journalLink"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Link do Jornal</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="https://jornal.com/noticia"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={businessForm.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="@usuario"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                value={field.value || ""}
                                placeholder="usuario"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step 3: Additional Settings */}
                {currentStep === 3 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">
                      Configurações Adicionais
                    </h3>

                    <FormField
                      control={businessForm.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Imagem do Negócio</FormLabel>
                          <FormControl>
                            <ImageUpload
                              value={field.value || ""}
                              onChange={(url) => field.onChange(url)}
                              label="Imagem do Negócio"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <FormField
                        control={businessForm.control}
                        name="featured"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Destaque
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Aparece na seção de destaques
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="certified"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">
                                Certificado
                              </FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Negócio verificado
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={businessForm.control}
                        name="active"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                              <FormLabel className="text-base">Ativo</FormLabel>
                              <div className="text-sm text-muted-foreground">
                                Visível no site
                              </div>
                            </div>
                            <FormControl>
                              <Switch
                                checked={!!field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}

                {/* Step Navigation */}
                <div className="flex justify-between pt-4">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleBusinessCancel}
                    >
                      Cancelar
                    </Button>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={prevStep}
                      >
                        <ArrowLeft className="w-4 h-4 mr-2" />
                        Voltar
                      </Button>
                    )}
                  </div>

                  <div>
                    {currentStep < 3 ? (
                      <Button type="button" onClick={nextStep}>
                        Próximo
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => {
                          const formData = businessForm.getValues();
                          handleBusinessSubmit(formData);
                        }}
                        disabled={
                          createBusiness.isPending || updateBusiness.isPending
                        }
                      >
                        {createBusiness.isPending || updateBusiness.isPending
                          ? "Salvando..."
                          : editingBusiness
                            ? "Confirmar Alterações"
                            : "Confirmar Publicação"}
                      </Button>
                    )}
                  </div>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Category Form Dialog */}
        <Dialog open={categoryDialogOpen} onOpenChange={setCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingCategory ? "Editar Categoria" : "Nova Categoria"}
              </DialogTitle>
            </DialogHeader>

            <Form {...categoryForm}>
              <form
                onSubmit={categoryForm.handleSubmit(handleCategorySubmit)}
                className="space-y-4"
              >
                <FormField
                  control={categoryForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Nome da categoria" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="slug"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Slug *</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="slug-da-categoria" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="icon"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ícone</FormLabel>
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                          {field.value ? field.value : "?"}
                        </div>
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIconSelectorOpen(true)}
                        >
                          Selecionar Ícone
                        </Button>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={categoryForm.control}
                  name="active"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Ativa</FormLabel>
                        <div className="text-sm text-muted-foreground">
                          Categoria visível no site
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

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCategoryCancel}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={
                      createCategory.isPending || updateCategory.isPending
                    }
                  >
                    {createCategory.isPending || updateCategory.isPending
                      ? "Salvando..."
                      : editingCategory
                        ? "Atualizar"
                        : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* Registration Edit Dialog */}
        <Dialog
          open={registrationDialogOpen}
          onOpenChange={setRegistrationDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Alterar Cadastro de Negócio</DialogTitle>
            </DialogHeader>

            <Form {...registrationForm}>
              <form
                onSubmit={registrationForm.handleSubmit(
                  handleRegistrationSubmit,
                )}
                className="space-y-4"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={registrationForm.control}
                    name="businessName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nome do Negócio *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nome do negócio" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoria *</FormLabel>
                        <Select
                          onValueChange={(value) =>
                            field.onChange(Number(value))
                          }
                          value={field.value?.toString()}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma categoria" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem
                                key={category.id}
                                value={category.id.toString()}
                              >
                                {category.icon} {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telefone *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="(12) 99999-9999" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="whatsapp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>WhatsApp *</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="5512999999999" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="contactEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de Contato</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            type="email"
                            placeholder="contato@exemplo.com"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>URL da Imagem</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="https://exemplo.com/imagem.jpg"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={registrationForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Endereço *</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Rua, número, bairro, cidade"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={registrationForm.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição *</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Descreva o negócio e seus serviços..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={registrationForm.control}
                    name="instagram"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Instagram</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="@usuario"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={registrationForm.control}
                    name="facebook"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Facebook</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            value={field.value || ""}
                            placeholder="facebook.com/pagina"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setRegistrationDialogOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={updateRegistration.isPending}>
                    {updateRegistration.isPending
                      ? "Atualizando..."
                      : "Confirmar Alterações"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>

        {/* View Registration Dialog */}
        <Dialog
          open={viewRegistrationDialogOpen}
          onOpenChange={setViewRegistrationDialogOpen}
        >
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Detalhes do Cadastro</DialogTitle>
            </DialogHeader>

            {viewingRegistration && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Nome do Negócio
                    </Label>
                    <p className="text-sm bg-gray-50 p-2 rounded border">
                      {viewingRegistration.businessName}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Categoria
                    </Label>
                    <p className="text-sm bg-gray-50 p-2 rounded border">
                      {categories.find(
                        (c) => c.id === viewingRegistration.categoryId,
                      )?.name || "N/A"}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      Telefone
                    </Label>
                    <p className="text-sm bg-gray-50 p-2 rounded border">
                      {viewingRegistration.phone}
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-gray-600">
                      WhatsApp
                    </Label>
                    <p className="text-sm bg-gray-50 p-2 rounded border">
                      {viewingRegistration.whatsapp}
                    </p>
                  </div>

                  {viewingRegistration.contactEmail && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Email de Contato
                      </Label>
                      <p className="text-sm bg-gray-50 p-2 rounded border">
                        {viewingRegistration.contactEmail}
                      </p>
                    </div>
                  )}

                  {viewingRegistration.imageUrl && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        URL da Imagem
                      </Label>
                      <p className="text-sm bg-gray-50 p-2 rounded border">
                        {viewingRegistration.imageUrl}
                      </p>
                    </div>
                  )}
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Endereço
                  </Label>
                  <p className="text-sm bg-gray-50 p-2 rounded border">
                    {viewingRegistration.address}
                  </p>
                </div>

                <div>
                  <Label className="text-sm font-medium text-gray-600">
                    Descrição
                  </Label>
                  <p className="text-sm bg-gray-50 p-3 rounded border">
                    {viewingRegistration.description}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {viewingRegistration.instagram && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Instagram
                      </Label>
                      <p className="text-sm bg-gray-50 p-2 rounded border">
                        {viewingRegistration.instagram}
                      </p>
                    </div>
                  )}

                  {viewingRegistration.facebook && (
                    <div>
                      <Label className="text-sm font-medium text-gray-600">
                        Facebook
                      </Label>
                      <p className="text-sm bg-gray-50 p-2 rounded border">
                        {viewingRegistration.facebook}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setViewRegistrationDialogOpen(false)}
                  >
                    Sair
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Icon Selector Modal - Simplified */}
        <Dialog open={iconSelectorOpen} onOpenChange={setIconSelectorOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Selecionar Ícone</DialogTitle>
            </DialogHeader>
            <div className="p-4">
              <p>Seleção de ícones em desenvolvimento</p>
              <Button onClick={() => setIconSelectorOpen(false)}>Fechar</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}