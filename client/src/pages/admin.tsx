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

/** Substitua todo o componente SettingsConfiguration no seu admin.tsx por este: */
function SettingsConfiguration() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { settings, refreshSettings } = useSettings();

  // formulário usa o schema parcial para permitir campos opcionais
  const form = useForm<InsertSiteSetting>({
    resolver: zodResolver(insertSiteSettingSchema.partial()),
    defaultValues: {
      siteName: "",
      locality: "",
      headline1: "",
      headline3: "",
      tagline1: "",
      tagline2: "",
      tagline3: "",
      tagline4: "",
      phone: "",
      email: "",
      address: "",
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

  // Quando os dados chegarem, preenche o form
  useEffect(() => {
    if (!settings) return;
    form.reset({
      siteName: settings.siteName ?? "",
      locality: settings.locality ?? "",
      headline1: settings.headline1 ?? "",
      headline3: settings.headline3 ?? "",
      tagline1: settings.tagline1 ?? "",
      tagline2: settings.tagline2 ?? "",
      tagline3: settings.tagline3 ?? "",
      tagline4: settings.tagline4 ?? "",
      phone: settings.phone ?? "",
      email: settings.email ?? "",
      address: settings.address ?? "",
      instagramUrl: settings.instagramUrl ?? "",
      whatsappUrl: settings.whatsappUrl ?? "",
      facebookUrl: settings.facebookUrl ?? "",
      footerDescription: settings.footerDescription ?? "",
      advertiseHeadline: settings.advertiseHeadline ?? "",
      advertiseSubtitle1: settings.advertiseSubtitle1 ?? "",
      advertiseSubtitle2: settings.advertiseSubtitle2 ?? "",
      faq1Question: settings.faq1Question ?? "",
      faq1Answer: settings.faq1Answer ?? "",
      faq2Question: settings.faq2Question ?? "",
      faq2Answer: settings.faq2Answer ?? "",
      faq3Question: settings.faq3Question ?? "",
      faq3Answer: settings.faq3Answer ?? "",
      faq4Question: settings.faq4Question ?? "",
      faq4Answer: settings.faq4Answer ?? "",
    });
  }, [settings, form]);

  // mutation para salvar tudo
  const updateSettings = useMutation({
    mutationFn: (data: InsertSiteSetting) =>
      apiRequest("PUT", "/api/admin/settings", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      queryClient.invalidateQueries({ queryKey: ["settings"] });
      refreshSettings();
      toast({ title: "Configurações salvas com sucesso!" });
      scrollToTop();
    },
    onError: (err: any) => {
      toast({
        title: "Erro ao salvar configurações",
        description: err?.message ?? "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configurações do Site</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) => updateSettings.mutate(data))}
            className="space-y-8"
          >
            {/* Básico */}
            <div>
              <h3 className="text-lg font-semibold">Informações Básicas</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="siteName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome do Site</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Rota Caiçara" />
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
                      <FormLabel>Localização</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="São Sebastião" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="logoUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Logo do Site</FormLabel>
                      <FormControl>
                        <ImageUpload
                          value={field.value || ""}
                          onChange={field.onChange}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Home (Headline + Tagline) */}
            <div>
              <h3 className="text-lg font-semibold">Página Inicial</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="headline1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Principal</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="DESCUBRA AS MELHORES EMPRESAS DE SÃO SEBASTIÃO"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="headline3"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Conectando você aos melhores negócios da cidade"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

            {/* Contato */}
            <div>
              <h3 className="text-lg font-semibold">Informações de Contato</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="(12) 99999-0000" />
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
                        <Input
                          {...field}
                          type="email"
                          placeholder="contato@exemplo.com"
                        />
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
                        <Input
                          {...field}
                          placeholder="Rua, bairro, cidade - SP"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Social */}
            <div>
              <h3 className="text-lg font-semibold">Redes Sociais</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="instagramUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Instagram URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://instagram.com/..."
                        />
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
                      <FormLabel>WhatsApp URL</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="https://wa.me/..." />
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
                      <FormLabel>Facebook URL</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="https://facebook.com/..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Footer e Anúncios */}
            <div>
              <h3 className="text-lg font-semibold">
                Footer & Página de Anúncio
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <FormField
                  control={form.control}
                  name="footerDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Descrição do Footer</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          rows={3}
                          placeholder="Texto do rodapé"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advertiseHeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Título Anúncios</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="SUA MARCA EM DESTAQUE ENTRE AS MELHORES"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="advertiseSubtitle1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Subtítulo Anúncios 1</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Onde excelência encontra visibilidade!"
                        />
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
                      <FormLabel>Subtítulo Anúncios 2</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="Junte-se à nossa comunidade sustentável..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* FAQs */}
            <div>
              <h3 className="text-lg font-semibold">
                Perguntas Frequentes (FAQs)
              </h3>
              <div className="mt-4 space-y-4">
                {([
                  { n: 1, question: "faq1Question" as const, answer: "faq1Answer" as const },
                  { n: 2, question: "faq2Question" as const, answer: "faq2Answer" as const },
                  { n: 3, question: "faq3Question" as const, answer: "faq3Answer" as const },
                  { n: 4, question: "faq4Question" as const, answer: "faq4Answer" as const },
                ]).map((faq) => (
                  <div
                    key={faq.n}
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                  >
                    <FormField
                      control={form.control}
                      name={faq.question}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Pergunta {faq.n}</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder={`Pergunta ${faq.n}`} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={faq.answer}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Resposta {faq.n}</FormLabel>
                          <FormControl>
                            <Textarea
                              {...field}
                              rows={2}
                              placeholder={`Resposta ${faq.n}`}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Salvar */}
            <div className="flex justify-end pt-6 border-t">
              <Button
                type="submit"
                disabled={updateSettings.isPending}
                className="bg-[#006C84] hover:bg-[#005A6A] px-8"
              >
                {updateSettings.isPending
                  ? "Salvando..."
                  : "Salvar Configurações"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
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
  const { data: businesses = [], isLoading: businessesLoading, error: businessesError } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: businessRegistrations = [], isLoading: registrationsLoading, error: registrationsError } = useQuery<BusinessRegistration[]>({
    queryKey: ["/api/admin/business-registrations"],
  });

  const { data: analytics = [], isLoading: analyticsLoading, error: analyticsError } = useQuery<Analytics[]>({
    queryKey: ["/api/admin/analytics"],
  });

  // State management
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessSearchFilter, setBusinessSearchFilter] = useState("");
  const [currentStep, setCurrentStep] = useState(1);
  const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [iconSelectorOpen, setIconSelectorOpen] = useState(false);
  const [registrationDialogOpen, setRegistrationDialogOpen] = useState(false);
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
  const filteredBusinesses = businesses.filter(
    (business) =>
      business.name
        .toLowerCase()
        .includes(businessSearchFilter.toLowerCase()) ||
      business.description
        .toLowerCase()
        .includes(businessSearchFilter.toLowerCase()),
  );

  // Debug logging
  console.log("Admin Panel Debug:", {
    businesses: businesses,
    businessesLoading,
    businessesError,
    categories: categories,
    businessRegistrations: businessRegistrations
  });

  // Calculate analytics
  const totalBusinesses = businesses.length;
  const totalRegistrations = businessRegistrations.length;
  const totalCategories = categories.length;
  const pendingRegistrations = businessRegistrations.filter(
    (reg) => !reg.processed,
  ).length;

  // Show loading state
  if (businessesLoading || categoriesLoading || registrationsLoading || analyticsLoading) {
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
  if (businessesError || categoriesError || registrationsError || analyticsError) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-3 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold text-red-600 mb-4">Erro ao carregar dados</h2>
            <p className="text-gray-600 mb-4">
              {businessesError?.message || categoriesError?.message || registrationsError?.message || analyticsError?.message}
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
                  {businessRegistrations.map((registration) => (
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
                  {businessRegistrations.length === 0 && (
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
