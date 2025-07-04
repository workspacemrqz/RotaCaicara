import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import ImageUpload from "@/components/image-upload";
import { 
  Settings, 
  Users, 
  FileText, 
  BarChart3, 
  Edit, 
  Trash2, 
  Plus,
  MessageSquare,
  HelpCircle,
  Tag,
  Upload,
  Palette,
  Search,
  ChevronLeft,
  ChevronRight,
  CheckCircle
} from "lucide-react";
import { 
  type Business, 
  type Category, 
  type BusinessRegistration,
  type Banner,
  type SiteSetting,
  type Testimonial,
  type Faq,
  insertBannerSchema,
  insertTestimonialSchema,
  insertFaqSchema,
  insertBusinessSchema,
  insertBusinessRegistrationSchema
} from "@shared/schema";
import { z } from "zod";

export default function Admin() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: businessRegistrations = [] } = useQuery<BusinessRegistration[]>({
    queryKey: ["/api/admin/business-registrations"],
  });

  const { data: banners = [] } = useQuery<Banner[]>({
    queryKey: ["/api/admin/banners"],
  });

  const { data: settings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/settings"],
  });

  const { data: testimonials = [] } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const { data: faqs = [] } = useQuery<Faq[]>({
    queryKey: ["/api/admin/faqs"],
  });

  // Business editing state and form
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  const [businessSearchFilter, setBusinessSearchFilter] = useState("");

  const [currentStep, setCurrentStep] = useState(1);
  
  // Settings management with manual confirmation
  const [pendingSettings, setPendingSettings] = useState<Record<string, string>>({});
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  
  const businessForm = useForm<z.infer<typeof insertBusinessSchema>>({
    resolver: zodResolver(insertBusinessSchema),
    defaultValues: {
      name: "",
      description: "",
      phone: "",
      whatsapp: "",
      address: "",
      categoryId: undefined,
      email: "",
      instagram: "",
      facebook: "",
      website: "",
      imageUrl: "",
      featured: false,
      certified: false,
      active: true,
    },
  });

  // Other dialog states
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false);
  const [testimonialDialogOpen, setTestimonialDialogOpen] = useState(false);
  const [faqDialogOpen, setFaqDialogOpen] = useState(false);

  // Registration form
  const registrationForm = useForm<z.infer<typeof insertBusinessRegistrationSchema>>({
    resolver: zodResolver(insertBusinessRegistrationSchema),
    defaultValues: {
      businessName: "",
      categoryId: undefined,
      phone: "",
      whatsapp: "",
      address: "",
      description: "",
      instagram: "",
      facebook: "",
      contactEmail: "",
      imageUrl: "",
      processed: false,
    },
  });

  // Form instances for other entities
  const bannerForm = useForm<z.infer<typeof insertBannerSchema>>({
    resolver: zodResolver(insertBannerSchema),
    defaultValues: {
      title: "",
      imageUrl: "",
      linkUrl: "",
      active: true,
      order: 0,
    },
  });

  const testimonialForm = useForm<z.infer<typeof insertTestimonialSchema>>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      name: "",
      content: "",
      rating: 5,
      active: true,
      order: 0,
    },
  });

  const faqForm = useForm<z.infer<typeof insertFaqSchema>>({
    resolver: zodResolver(insertFaqSchema),
    defaultValues: {
      question: "",
      answer: "",
      order: 0,
      active: true,
    },
  });

  // Mutations
  const deleteBusiness = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/businesses/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio deletado com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao deletar negócio", 
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  const updateBusiness = useMutation({
    mutationFn: async ({ id, payload }: { id: number; payload: any }) => {
      const updated = await apiRequest("PATCH", `/api/businesses/${id}`, payload);
      return updated;
    },
    onSuccess: (business: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio atualizado com sucesso" });
      setBusinessDialogOpen(false);
      setEditingBusiness(null);
      businessForm.reset();
    },
    onError: (err: any) => {
      toast({ 
        title: "Erro ao atualizar negócio", 
        description: err.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  const createBusiness = useMutation({
    mutationFn: async (data: any) => {
      const business = await apiRequest("POST", "/api/businesses", data);
      return business;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Negócio criado com sucesso" });
      setBusinessDialogOpen(false);
      setEditingBusiness(null);
      businessForm.reset();
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao criar negócio", 
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  const publishRegistration = useMutation({
    mutationFn: async (registration: any) => {
      // Use the simplified endpoint that creates business and deletes registration
      return apiRequest("PATCH", `/api/admin/submissions/${registration.id}`, { 
        processed: true 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses/featured"] });
      toast({ title: "Cadastro publicado como negócio com sucesso" });
    },
    onError: (error: any) => {
      toast({ 
        title: "Erro ao publicar cadastro", 
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  const updateRegistration = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PATCH", `/api/admin/submissions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-registrations"] });
      setEditRegistrationDialogOpen(false);
      setEditingRegistration(null);
      registrationForm.reset();
      toast({ title: "Cadastro atualizado com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar cadastro",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  const updateSiteSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) => {
      return apiRequest("PUT", `/api/admin/settings/${key}`, { value });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Configuração atualizada com sucesso" });
    },
    onError: (error: any) => {
      toast({
        title: "Erro ao atualizar configuração",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    },
  });

  // Settings helper functions with manual confirmation
  const getSettingValue = (key: string): string => {
    // First check pending changes, then saved settings, then empty string
    if (pendingSettings[key] !== undefined) {
      return pendingSettings[key];
    }
    return settings.find(s => s.key === key)?.value || "";
  };

  const handleSettingChange = (key: string, value: string) => {
    setPendingSettings(prev => ({
      ...prev,
      [key]: value
    }));
    setHasUnsavedChanges(true);
  };

  const handleApplySettings = async () => {
    try {
      // Apply all pending settings sequentially
      for (const [key, value] of Object.entries(pendingSettings)) {
        await updateSiteSetting.mutateAsync({ key, value });
      }
      
      // Clear pending changes
      setPendingSettings({});
      setHasUnsavedChanges(false);
      
      toast({ 
        title: "Configurações aplicadas com sucesso",
        description: `${Object.keys(pendingSettings).length} configurações foram atualizadas`
      });
    } catch (error: any) {
      toast({
        title: "Erro ao aplicar configurações",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive"
      });
    }
  };

  // Handlers
  const handleEditBusiness = (business: Business) => {
    setEditingBusiness(business);
    businessForm.reset({
      name: business.name,
      description: business.description,
      phone: business.phone,
      whatsapp: business.whatsapp || "",
      address: business.address,
      categoryId: business.categoryId,
      email: business.email || "",
      instagram: business.instagram || "",
      facebook: business.facebook || "",
      website: business.website || "",
      imageUrl: business.imageUrl || "",
      featured: business.featured || false,
      certified: business.certified || false,
      active: business.active ?? true,
    });
    setBusinessDialogOpen(true);
  };

  const handleBusinessSubmit = async (data: z.infer<typeof insertBusinessSchema>) => {
    // Only allow submission if we're on step 3 (final step)
    if (currentStep !== 3) {
      return;
    }

    const isValid = await businessForm.trigger();
    if (!isValid) {
      toast({
        title: "Erro de validação",
        description: "Por favor, corrija os campos obrigatórios",
        variant: "destructive"
      });
      return;
    }

    if (editingBusiness) {
      try {
        await updateBusiness.mutateAsync({ 
          id: editingBusiness.id, 
          payload: {
            ...data,
            categoryId: Number(data.categoryId),
            featured: Boolean(data.featured),
            active: Boolean(data.active),
            certified: Boolean(data.certified)
          }
        });
      } catch (error) {
        console.error("Error updating business:", error);
      }
    } else {
      try {
        await createBusiness.mutateAsync({
          ...data,
          categoryId: Number(data.categoryId),
          featured: Boolean(data.featured),
          active: Boolean(data.active),
          certified: Boolean(data.certified)
        });
      } catch (error) {
        console.error("Error creating business:", error);
      }
    }
  };

  // Registration management handlers
  const [editingRegistration, setEditingRegistration] = useState<any>(null);
  const [editRegistrationDialogOpen, setEditRegistrationDialogOpen] = useState(false);



  const handleEditRegistration = (registration: any) => {
    setEditingRegistration(registration);
    registrationForm.reset({
      businessName: registration.businessName,
      categoryId: registration.categoryId,
      phone: registration.phone,
      whatsapp: registration.whatsapp || "",
      address: registration.address,
      description: registration.description,
      instagram: registration.instagram || "",
      facebook: registration.facebook || "",
      contactEmail: registration.contactEmail,
      imageUrl: registration.imageUrl || "",
      processed: registration.processed
    });
    setEditRegistrationDialogOpen(true);
  };

  const handlePublishRegistration = (registration: any) => {
    publishRegistration.mutate(registration);
  };

  const handleRegistrationSubmit = async (data: z.infer<typeof insertBusinessRegistrationSchema>) => {
    if (!editingRegistration) return;
    
    await updateRegistration.mutateAsync({
      id: editingRegistration.id,
      data: {
        ...data,
        categoryId: Number(data.categoryId)
      }
    });
  };





  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie seu diretório de negócios locais
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
            <TabsTrigger value="dashboard">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="businesses">
              <Users className="w-4 h-4 mr-2" />
              Negócios
            </TabsTrigger>
            <TabsTrigger value="submissions">
              <FileText className="w-4 h-4 mr-2" />
              Cadastros
            </TabsTrigger>
            <TabsTrigger value="site-settings">
              <Palette className="w-4 h-4 mr-2" />
              Config. Site
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Total de Negócios</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{businesses.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Cadastros Pendentes</CardTitle>
                  <FileText className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businessRegistrations.filter(reg => !reg.processed).length}
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Negócios em Destaque</CardTitle>
                  <CheckCircle className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {businesses.filter(b => b.featured).length}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses */}
          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <div className="flex flex-row items-center justify-between mb-4">
                  <CardTitle>Gerenciar Negócios</CardTitle>
                  <div className="relative">
                    <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Buscar por nome ou descrição..."
                      value={businessSearchFilter}
                      onChange={(e) => setBusinessSearchFilter(e.target.value)}
                      className="pl-8 w-64"
                    />
                  </div>
                </div>
                <Dialog open={businessDialogOpen} onOpenChange={(open) => {
                  setBusinessDialogOpen(open);
                  if (!open) {
                    setEditingBusiness(null);
                    setCurrentStep(1);
                    businessForm.reset({
                      name: "",
                      description: "",
                      categoryId: 0,
                      phone: "",
                      whatsapp: "",
                      address: "",
                      email: "",
                      website: "",
                      instagram: "",
                      facebook: "",
                      imageUrl: "",
                      featured: false,
                      active: true
                    });
                  }
                }}>
                  <DialogTrigger asChild>
                    <Button 
                      size="sm" 
                      className="bg-[#006C84] hover:bg-[#005A6A]"
                      onClick={() => {
                        setEditingBusiness(null);
                        setCurrentStep(1);
                        businessForm.reset({
                          name: "",
                          description: "",
                          categoryId: 0,
                          phone: "",
                          whatsapp: "",
                          address: "",
                          email: "",
                          website: "",
                          instagram: "",
                          facebook: "",
                          imageUrl: "",
                          featured: false,
                          active: true
                        });
                      }}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Adicionar Novo Negócio
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle>
                        {editingBusiness ? "Editar Negócio" : "Adicionar Novo Negócio"}
                      </DialogTitle>
                      <div className="flex items-center space-x-2 mt-4">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= 1 ? 'bg-[#006C84] text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          1
                        </div>
                        <div className={`h-1 w-12 ${currentStep > 1 ? 'bg-[#006C84]' : 'bg-gray-200'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= 2 ? 'bg-[#006C84] text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          2
                        </div>
                        <div className={`h-1 w-12 ${currentStep > 2 ? 'bg-[#006C84]' : 'bg-gray-200'}`} />
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                          currentStep >= 3 ? 'bg-[#006C84] text-white' : 'bg-gray-200 text-gray-600'
                        }`}>
                          3
                        </div>
                      </div>
                      <div className="text-sm text-gray-600 mt-2">
                        {currentStep === 1 && "Passo 1: Informações Básicas"}
                        {currentStep === 2 && "Passo 2: Contato e Localização"}
                        {currentStep === 3 && "Passo 3: Imagem (obrigatória)"}
                      </div>
                    </DialogHeader>
                    <Form {...businessForm}>
                      <form onSubmit={businessForm.handleSubmit(handleBusinessSubmit)} className="space-y-6">
                        
                        {/* Step 1: Basic Information */}
                        {currentStep === 1 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={businessForm.control}
                                name="name"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Nome do Negócio *</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
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
                                    <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Selecione uma categoria" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {categories.map((category) => (
                                          <SelectItem key={category.id} value={category.id.toString()}>
                                            {category.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={businessForm.control}
                              name="description"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Descrição *</FormLabel>
                                  <FormControl>
                                    <Textarea {...field} rows={3} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        )}
                        
                        {/* Step 2: Contact and Location */}
                        {currentStep === 2 && (
                          <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={businessForm.control}
                                name="phone"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Telefone</FormLabel>
                                    <FormControl>
                                      <Input {...field} />
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
                                      <Input {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                            
                            <FormField
                              control={businessForm.control}
                              name="address"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Endereço</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={businessForm.control}
                                name="email"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Email</FormLabel>
                                    <FormControl>
                                      <Input {...field} type="email" value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={businessForm.control}
                                name="website"
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Website</FormLabel>
                                    <FormControl>
                                      <Input {...field} value={field.value || ""} />
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
                                      <Input {...field} placeholder="@usuario" value={field.value || ""} />
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
                                      <Input {...field} value={field.value || ""} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                        
                        {/* Step 3: Image and Final Settings */}
                        {currentStep === 3 && (
                          <div className="space-y-4">
                            <FormField
                              control={businessForm.control}
                              name="imageUrl"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Imagem do Negócio *</FormLabel>
                                  <FormControl>
                                    <ImageUpload
                                      value={field.value || ""}
                                      onChange={field.onChange}
                                      label="Imagem do Negócio"
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            
                            <div className="grid grid-cols-2 gap-4">
                              <FormField
                                control={businessForm.control}
                                name="featured"
                                render={({ field }) => (
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>Destaque</FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch 
                                        checked={field.value || false}
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
                                  <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                    <div className="space-y-0.5">
                                      <FormLabel>Ativo</FormLabel>
                                    </div>
                                    <FormControl>
                                      <Switch 
                                        checked={field.value || false}
                                        onCheckedChange={field.onChange}
                                      />
                                    </FormControl>
                                  </FormItem>
                                )}
                              />
                            </div>
                          </div>
                        )}
                        
                        <div className="flex justify-between gap-2 pt-4 border-t">
                          <div className="flex gap-2">
                            {currentStep > 1 && (
                              <Button 
                                type="button" 
                                variant="outline" 
                                onClick={() => setCurrentStep(currentStep - 1)}
                                className="flex items-center gap-2"
                              >
                                <ChevronLeft className="w-4 h-4" />
                                Anterior
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex gap-2">
                            <Button type="button" variant="outline" onClick={() => setBusinessDialogOpen(false)}>
                              Cancelar
                            </Button>
                            
                            {currentStep < 3 ? (
                              <Button 
                                type="button" 
                                onClick={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                  setCurrentStep(currentStep + 1);
                                }}
                                className="bg-[#006C84] hover:bg-[#005A6A] flex items-center gap-2"
                              >
                                Próximo
                                <ChevronRight className="w-4 h-4" />
                              </Button>
                            ) : (
                              <Button 
                                type="submit"
                                className="bg-[#006C84] hover:bg-[#005A6A]"
                              >
                                {editingBusiness ? "Atualizar" : "Adicionar"} Negócio
                              </Button>
                            )}
                          </div>
                        </div>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businesses
                    .filter(business => 
                      businessSearchFilter === "" || 
                      business.name.toLowerCase().includes(businessSearchFilter.toLowerCase()) ||
                      business.description?.toLowerCase().includes(businessSearchFilter.toLowerCase())
                    )
                    .sort((a, b) => b.id - a.id)
                    .map((business, index) => (
                    <div 
                      key={business.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{business.name}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{business.description}</p>
                        <div className="flex gap-2 mt-2">
                          {business.featured && (
                            <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                              Destaque
                            </Badge>
                          )}
                          <Badge 
                            variant={business.active ? "default" : "destructive"}
                            className={business.active ? "bg-green-100 text-green-800" : ""}
                          >
                            {business.active ? "Ativo" : "Inativo"}
                          </Badge>
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
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir "{business.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction onClick={() => deleteBusiness.mutate(business.id)}>
                                Excluir
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Submissions */}
          <TabsContent value="submissions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadastros de Negócios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessRegistrations.map((registration, index) => (
                    <div 
                      key={registration.id} 
                      className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg animate-fade-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{registration.businessName}</h3>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{registration.description}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          Contato: {registration.contactEmail} | {registration.phone}
                        </p>
                        <div className="flex gap-2 mt-2">
                          <Badge 
                            variant={registration.processed ? "default" : "secondary"}
                            className={registration.processed ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}
                          >
                            {registration.processed ? "Processado" : "Pendente"}
                          </Badge>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEditRegistration(registration)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          size="sm"
                          className="bg-[#006C84] hover:bg-[#005A6A]"
                          onClick={() => handlePublishRegistration(registration)}
                          disabled={registration.processed}
                        >
                          PUBLICAR
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Site Settings */}
          <TabsContent value="site-settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações Dinâmicas do Site</CardTitle>
                <p className="text-sm text-gray-600">
                  Customize todos os textos e links do site sem editar código
                </p>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Logo and Header Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Cabeçalho e Logo
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="site_name">Texto do Logotipo</Label>
                      <Input
                        id="site_name"
                        type="text"
                        value={getSettingValue('site_name')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('site_name', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="site_logo_url">URL da Logo do Site</Label>
                      <Input
                        id="siteLogoUpload"
                        type="url"
                        value={getSettingValue('site_logo_url')}
                        className="mt-1"
                        placeholder="https://exemplo.com/logo.jpg"
                        onChange={(e) => handleSettingChange('site_logo_url', e.target.value)}
                      />
                      {getSettingValue('site_logo_url') && (
                        <img 
                          id="siteLogoPreview" 
                          src={getSettingValue('site_logo_url')} 
                          alt="Preview do logo" 
                          className="mt-2 h-24 w-24 object-cover rounded-full border shadow-md" 
                        />
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Configurações do Rodapé
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="footer_contact_phone">Telefone</Label>
                      <Input
                        id="footer_contact_phone"
                        type="tel"
                        value={getSettingValue('footer_contact_phone')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('footer_contact_phone', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="footer_contact_email">Email</Label>
                      <Input
                        id="footer_contact_email"
                        type="email"
                        value={getSettingValue('footer_contact_email')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('footer_contact_email', e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="footer_tagline">Frase do Rodapé</Label>
                    <Textarea
                      id="footer_tagline"
                      value={getSettingValue('footer_tagline')}
                      className="mt-1"
                      rows={3}
                      onChange={(e) => handleSettingChange('footer_tagline', e.target.value)}
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="footer_whatsapp_link">Link WhatsApp</Label>
                      <Input
                        id="footer_whatsapp_link"
                        type="url"
                        value={getSettingValue('footer_whatsapp_link')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('footer_whatsapp_link', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="footer_instagram_link">Link Instagram</Label>
                      <Input
                        id="footer_instagram_link"
                        type="url"
                        value={getSettingValue('footer_instagram_link')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('footer_instagram_link', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="footer_facebook_link">Link Facebook</Label>
                      <Input
                        id="footer_facebook_link"
                        type="url"
                        value={getSettingValue('footer_facebook_link')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('footer_facebook_link', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Home Page Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Página Principal (Home)
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="hero_title">Título Principal</Label>
                      <Input
                        id="hero_title"
                        type="text"
                        value={getSettingValue('hero_title')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('hero_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="hero_subtitle">Subtítulo Principal</Label>
                      <Input
                        id="hero_subtitle"
                        type="text"
                        value={getSettingValue('hero_subtitle')}
                        className="mt-1"
                        onChange={(e) => handleSettingChange('hero_subtitle', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* Advertise Page Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Página Anunciar
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="advertise_title">Título da Página</Label>
                      <Input
                        id="advertise_title"
                        type="text"
                        defaultValue="SUA MARCA EM DESTAQUE ENTRE AS MELHORES"
                        className="mt-1"
                        onChange={(e) => handleSettingChange('advertise_title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="advertise_subtitle">Subtítulo da Página</Label>
                      <Input
                        id="advertise_subtitle"
                        type="text"
                        defaultValue="Onde excelência encontra visibilidade!"
                        className="mt-1"
                        onChange={(e) => handleSettingChange('advertise_subtitle', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="advertise_description">Descrição da Página</Label>
                      <Textarea
                        id="advertise_description"
                        defaultValue="Junte-se à nossa comunidade sustentável e fortaleça sua reputação empresarial com divulgação multicanal eficiente e impactante."
                        className="mt-1"
                        rows={3}
                        onChange={(e) => handleSettingChange('advertise_description', e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                {/* FAQ Settings */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">
                    Perguntas Frequentes (FAQ)
                  </h3>
                  <div className="space-y-6">
                    {/* FAQ 1 */}
                    <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-700">FAQ 1</h4>
                      <div>
                        <Label htmlFor="faq1_question">Pergunta</Label>
                        <Input
                          id="faq1_question"
                          type="text"
                          defaultValue="Posso parcelar no cartão?"
                          className="mt-1"
                          onChange={(e) => handleSettingChange('faq1_question', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq1_answer">Resposta</Label>
                        <Textarea
                          id="faq1_answer"
                          defaultValue="Sim! Oferecemos parcelamento em até 10x de R$ 29,70 sem juros."
                          className="mt-1"
                          rows={2}
                          onChange={(e) => handleSettingChange('faq1_answer', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* FAQ 2 */}
                    <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-700">FAQ 2</h4>
                      <div>
                        <Label htmlFor="faq2_question">Pergunta</Label>
                        <Input
                          id="faq2_question"
                          type="text"
                          defaultValue="Quanto tempo leva para ativar o anúncio?"
                          className="mt-1"
                          onChange={(e) => handleSettingChange('faq2_question', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq2_answer">Resposta</Label>
                        <Textarea
                          id="faq2_answer"
                          defaultValue="Seu anúncio fica ativo em até 24 horas após a confirmação do pagamento."
                          className="mt-1"
                          rows={2}
                          onChange={(e) => handleSettingChange('faq2_answer', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* FAQ 3 */}
                    <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-700">FAQ 3</h4>
                      <div>
                        <Label htmlFor="faq3_question">Pergunta</Label>
                        <Input
                          id="faq3_question"
                          type="text"
                          defaultValue="Como retirar o certificado?"
                          className="mt-1"
                          onChange={(e) => handleSettingChange('faq3_question', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq3_answer">Resposta</Label>
                        <Textarea
                          id="faq3_answer"
                          defaultValue="O certificado digital é enviado por email e WhatsApp após a ativação."
                          className="mt-1"
                          rows={2}
                          onChange={(e) => handleSettingChange('faq3_answer', e.target.value)}
                        />
                      </div>
                    </div>

                    {/* FAQ 4 */}
                    <div className="grid grid-cols-1 gap-4 p-4 border rounded-lg">
                      <h4 className="font-medium text-gray-700">FAQ 4</h4>
                      <div>
                        <Label htmlFor="faq4_question">Pergunta</Label>
                        <Input
                          id="faq4_question"
                          type="text"
                          defaultValue="Empresas de outras cidades podem anunciar?"
                          className="mt-1"
                          onChange={(e) => handleSettingChange('faq4_question', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label htmlFor="faq4_answer">Resposta</Label>
                        <Textarea
                          id="faq4_answer"
                          defaultValue="Este guia é específico para São José dos Campos. Consulte sobre franquias para outras cidades."
                          className="mt-1"
                          rows={2}
                          onChange={(e) => handleSettingChange('faq4_answer', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Apply Settings Button */}
                <div className="flex justify-end pt-6 border-t">
                  <Button 
                    onClick={handleApplySettings}
                    disabled={Object.keys(pendingSettings).length === 0 || updateSiteSetting.isPending}
                    className="bg-[#006C84] hover:bg-[#005A6A] text-white px-6 py-2"
                  >
                    {updateSiteSetting.isPending ? 'Aplicando...' : `Aplicar Alterações ${Object.keys(pendingSettings).length > 0 ? `(${Object.keys(pendingSettings).length})` : ''}`}
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>


        </Tabs>
      </div>

      {/* Edit Registration Dialog */}
      <Dialog open={editRegistrationDialogOpen} onOpenChange={setEditRegistrationDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cadastro</DialogTitle>
          </DialogHeader>
          <Form {...registrationForm}>
            <form onSubmit={registrationForm.handleSubmit(handleRegistrationSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={registrationForm.control}
                  name="businessName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nome da Empresa</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>Categoria</FormLabel>
                      <Select onValueChange={(value) => field.onChange(Number(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma categoria" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category.id} value={category.id.toString()}>
                              {category.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={registrationForm.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Telefone</FormLabel>
                      <FormControl>
                        <Input {...field} />
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
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
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
                    <FormLabel>Endereço</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={3} />
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
                      <Input {...field} type="email" />
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
                        <Input {...field} value={field.value || ""} />
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
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={registrationForm.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Imagem da Empresa</FormLabel>
                    <FormControl>
                      <ImageUpload
                        value={field.value || ""}
                        onChange={field.onChange}
                        label="Imagem da Empresa"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditRegistrationDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateRegistration.isPending}
                  className="bg-[#006C84] hover:bg-[#005A6A]"
                >
                  {updateRegistration.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}