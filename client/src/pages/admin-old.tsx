import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
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
  Shield, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  MessageSquare,
  HelpCircle,
  Tag,
  Calendar,
  Activity,
  RefreshCw
} from "lucide-react";
import { 
  type Business, 
  type Category, 
  type BusinessRegistration,
  type Banner,
  type SiteSetting,
  type Testimonial,
  type Faq,
  type Promotion,
  type AdminLog,
  type Analytics,
  type News,
  insertBannerSchema,
  insertTestimonialSchema,
  insertFaqSchema,
  insertPromotionSchema,
  insertNewsSchema,
  insertCategorySchema,
  insertBusinessSchema
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

  const { data: promotions = [] } = useQuery<Promotion[]>({
    queryKey: ["/api/admin/promotions"],
  });

  const { data: logs = [] } = useQuery<AdminLog[]>({
    queryKey: ["/api/admin/logs"],
  });

  const { data: analytics = [] } = useQuery<Analytics[]>({
    queryKey: ["/api/admin/analytics"],
  });

  // Mutations
  const deleteBusiness = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/businesses/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Negócio deletado com sucesso" });
    },
  });

  const deleteCategory = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/categories/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/categories"] });
      toast({ title: "Categoria deletada com sucesso" });
    },
  });

  const updateBusiness = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<Business> }) =>
      apiRequest("PATCH", `/api/businesses/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Negócio atualizado com sucesso" });
      setBusinessDialogOpen(false);
      setEditingBusiness(null);
      businessForm.reset();
    },
  });

  const createBanner = useMutation({
    mutationFn: async (data: z.infer<typeof insertBannerSchema>) =>
      await apiRequest("/api/admin/banners", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner criado com sucesso" });
    },
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/banners/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner deletado com sucesso" });
    },
  });

  const updateSetting = useMutation({
    mutationFn: async ({ key, value }: { key: string; value: string }) =>
      await apiRequest(`/api/admin/settings/${key}`, { 
        method: "PUT", 
        body: JSON.stringify({ value }),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings"] });
      toast({ title: "Configuração atualizada" });
    },
  });

  const createTestimonial = useMutation({
    mutationFn: async (data: z.infer<typeof insertTestimonialSchema>) =>
      await apiRequest("/api/admin/testimonials", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Depoimento criado com sucesso" });
    },
  });

  const deleteTestimonial = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/testimonials/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Depoimento deletado com sucesso" });
    },
  });

  const createFaq = useMutation({
    mutationFn: async (data: z.infer<typeof insertFaqSchema>) =>
      await apiRequest("/api/admin/faqs", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
      toast({ title: "FAQ criado com sucesso" });
    },
  });

  const deleteFaq = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/faqs/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faqs"] });
      toast({ title: "FAQ deletado com sucesso" });
    },
  });

  const createPromotion = useMutation({
    mutationFn: async (data: z.infer<typeof insertPromotionSchema>) =>
      await apiRequest("/api/admin/promotions", { 
        method: "POST", 
        body: JSON.stringify(data),
        headers: { "Content-Type": "application/json" }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      toast({ title: "Promoção criada com sucesso" });
    },
  });

  const deletePromotion = useMutation({
    mutationFn: async (id: number) => 
      await apiRequest(`/api/admin/promotions/${id}`, { method: "DELETE" }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/promotions"] });
      toast({ title: "Promoção deletada com sucesso" });
    },
  });

  // Forms
  const bannerForm = useForm<z.infer<typeof insertBannerSchema>>({
    resolver: zodResolver(insertBannerSchema),
    defaultValues: {
      title: "",
      subtitle: "",
      imageUrl: "",
      ctaText: "",
      ctaLink: "",
      active: true,
      order: 0,
    },
  });

  const testimonialForm = useForm<z.infer<typeof insertTestimonialSchema>>({
    resolver: zodResolver(insertTestimonialSchema),
    defaultValues: {
      name: "",
      company: "",
      content: "",
      imageUrl: "",
      rating: 5,
      active: true,
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

  const promotionForm = useForm<z.infer<typeof insertPromotionSchema>>({
    resolver: zodResolver(insertPromotionSchema),
    defaultValues: {
      title: "",
      description: "",
      businessId: undefined,
      discountPercent: 0,
      validUntil: undefined,
      active: true,
    },
  });

  // Business editing state and form
  const [businessDialogOpen, setBusinessDialogOpen] = useState(false);
  const [editingBusiness, setEditingBusiness] = useState<Business | null>(null);
  
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
      featured: false,
      certified: false,
      active: true,
    },
  });

  // Business handlers
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
      featured: business.featured || false,
      certified: business.certified || false,
      active: business.active ?? true,
    });
    setBusinessDialogOpen(true);
  };

  const handleBusinessSubmit = (data: z.infer<typeof insertBusinessSchema>) => {
    if (editingBusiness) {
      updateBusiness.mutate({ 
        id: editingBusiness.id, 
        data
      });
    }
  };







  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-blue-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Painel Administrativo
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            Gerencie todos os aspectos da plataforma Rota Caiçara
          </p>
        </div>

        <Tabs defaultValue="dashboard" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:w-auto">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Negócios
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Cadastros
            </TabsTrigger>
            <TabsTrigger value="content" className="flex items-center gap-2">
              <MessageSquare className="w-4 h-4" />
              Conteúdo
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  <CardTitle className="text-sm font-medium">Categorias</CardTitle>
                  <Tag className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{categories.length}</div>
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
            </div>

            <div className="grid grid-cols-1 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Cadastros Recentes</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {businessRegistrations.slice(0, 5).map((registration) => (
                      <div key={registration.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{registration.businessName}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{registration.contactEmail}</p>
                        </div>
                        <Badge variant={registration.processed ? "default" : "secondary"}>
                          {registration.processed ? "Processado" : "Pendente"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Businesses */}
          <TabsContent value="businesses" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Negócios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businesses.map((business) => (
                    <div key={business.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <h3 className="font-medium">{business.name}</h3>
                          <div className="flex gap-2">
                            {business.featured && <Badge>Destaque</Badge>}
                            {business.certified && <Badge variant="secondary">Certificado</Badge>}
                            <Badge variant={business.active ? "default" : "destructive"}>
                              {business.active ? "Ativo" : "Inativo"}
                            </Badge>
                          </div>
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {business.description}
                        </p>
                        <p className="text-sm text-gray-500 mt-1">
                          {business.phone} • {business.address}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditBusiness(business)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button variant="destructive" size="sm">
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                              <AlertDialogDescription>
                                Tem certeza que deseja excluir o negócio "{business.name}"? Esta ação não pode ser desfeita.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancelar</AlertDialogCancel>
                              <AlertDialogAction
                                onClick={() => deleteBusiness.mutate(business.id)}
                                className="bg-red-600 hover:bg-red-700"
                              >
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



          {/* Business Registrations */}
          <TabsContent value="registrations" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadastros de Negócios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {businessRegistrations.map((registration) => (
                    <div key={registration.id} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-medium">{registration.businessName}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Categoria: {categories.find(c => c.id === registration.categoryId)?.name}
                          </p>
                        </div>
                        <Badge variant={registration.processed ? "default" : "secondary"}>
                          {registration.processed ? "Processado" : "Pendente"}
                        </Badge>
                      </div>
                      <p className="text-sm mb-2">{registration.description}</p>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p><strong>Telefone:</strong> {registration.phone}</p>
                          <p><strong>WhatsApp:</strong> {registration.whatsapp}</p>
                        </div>
                        <div>
                          <p><strong>Email:</strong> {registration.contactEmail}</p>
                          <p><strong>Endereço:</strong> {registration.address}</p>
                        </div>
                      </div>
                      {(registration.instagram || registration.facebook) && (
                        <div className="mt-2 text-sm">
                          {registration.instagram && (
                            <p><strong>Instagram:</strong> @{registration.instagram}</p>
                          )}
                          {registration.facebook && (
                            <p><strong>Facebook:</strong> {registration.facebook}</p>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Banners */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Banners</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Banner
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Banner</DialogTitle>
                      </DialogHeader>
                      <Form {...bannerForm}>
                        <form 
                          onSubmit={bannerForm.handleSubmit((data) => {
                            createBanner.mutate(data);
                            bannerForm.reset();
                          })}
                          className="space-y-4"
                        >
                          <FormField
                            control={bannerForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Título</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={bannerForm.control}
                            name="subtitle"
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
                            control={bannerForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <ImageUpload
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    label="Imagem do Banner"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={bannerForm.control}
                              name="ctaText"
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
                            <FormField
                              control={bannerForm.control}
                              name="ctaLink"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Link do Botão</FormLabel>
                                  <FormControl>
                                    <Input {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={bannerForm.control}
                              name="order"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Ordem</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      {...field}
                                      value={field.value || 0}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={bannerForm.control}
                              name="active"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Ativo</FormLabel>
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
                          </div>
                          <Button type="submit" className="w-full">
                            Criar Banner
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {banners.map((banner) => (
                      <div key={banner.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{banner.title}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{banner.subtitle}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={banner.active ? "default" : "secondary"}>
                            {banner.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteBanner.mutate(banner.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Testimonials */}
              <Card>
                <CardHeader className="flex flex-row items-center justify-between">
                  <CardTitle>Depoimentos</CardTitle>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Novo Depoimento
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Criar Depoimento</DialogTitle>
                      </DialogHeader>
                      <Form {...testimonialForm}>
                        <form 
                          onSubmit={testimonialForm.handleSubmit((data) => {
                            createTestimonial.mutate(data);
                            testimonialForm.reset();
                          })}
                          className="space-y-4"
                        >
                          <FormField
                            control={testimonialForm.control}
                            name="name"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nome</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={testimonialForm.control}
                            name="company"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Empresa</FormLabel>
                                <FormControl>
                                  <Input {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={testimonialForm.control}
                            name="content"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Conteúdo</FormLabel>
                                <FormControl>
                                  <Textarea {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={testimonialForm.control}
                            name="imageUrl"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <ImageUpload
                                    value={field.value || ""}
                                    onChange={field.onChange}
                                    label="Foto do Cliente"
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={testimonialForm.control}
                              name="rating"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Avaliação (1-5)</FormLabel>
                                  <FormControl>
                                    <Input 
                                      type="number" 
                                      min="1" 
                                      max="5"
                                      {...field}
                                      value={field.value || 5}
                                      onChange={(e) => field.onChange(parseInt(e.target.value) || 5)}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                            <FormField
                              control={testimonialForm.control}
                              name="active"
                              render={({ field }) => (
                                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                  <div className="space-y-0.5">
                                    <FormLabel>Ativo</FormLabel>
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
                          </div>
                          <Button type="submit" className="w-full">
                            Criar Depoimento
                          </Button>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <p className="font-medium">{testimonial.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{testimonial.company}</p>
                          <p className="text-sm">{"⭐".repeat(testimonial.rating || 5)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={testimonial.active ? "default" : "secondary"}>
                            {testimonial.active ? "Ativo" : "Inativo"}
                          </Badge>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => deleteTestimonial.mutate(testimonial.id)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* FAQs */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Perguntas Frequentes</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova FAQ
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar FAQ</DialogTitle>
                    </DialogHeader>
                    <Form {...faqForm}>
                      <form 
                        onSubmit={faqForm.handleSubmit((data) => {
                          createFaq.mutate(data);
                          faqForm.reset();
                        })}
                        className="space-y-4"
                      >
                        <FormField
                          control={faqForm.control}
                          name="question"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Pergunta</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={faqForm.control}
                          name="answer"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Resposta</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={faqForm.control}
                            name="order"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Ordem</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    {...field}
                                    value={field.value || 0}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={faqForm.control}
                            name="active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Ativo</FormLabel>
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
                        </div>
                        <Button type="submit" className="w-full">
                          Criar FAQ
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={faq.active ? "default" : "secondary"}>
                          {faq.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteFaq.mutate(faq.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>


            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle>Promoções</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Nova Promoção
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Criar Promoção</DialogTitle>
                    </DialogHeader>
                    <Form {...promotionForm}>
                      <form 
                        onSubmit={promotionForm.handleSubmit((data) => {
                          createPromotion.mutate(data);
                          promotionForm.reset();
                        })}
                        className="space-y-4"
                      >
                        <FormField
                          control={promotionForm.control}
                          name="title"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Título</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={promotionForm.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Descrição</FormLabel>
                              <FormControl>
                                <Textarea {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={promotionForm.control}
                            name="discountPercent"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Desconto (%)</FormLabel>
                                <FormControl>
                                  <Input 
                                    type="number" 
                                    min="0" 
                                    max="100"
                                    {...field}
                                    value={field.value || 0}
                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={promotionForm.control}
                            name="active"
                            render={({ field }) => (
                              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3 shadow-sm">
                                <div className="space-y-0.5">
                                  <FormLabel>Ativo</FormLabel>
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
                        </div>
                        <Button type="submit" className="w-full">
                          Criar Promoção
                        </Button>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {promotions.map((promotion) => (
                    <div key={promotion.id} className="flex items-start justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{promotion.title}</p>
                          {promotion.discountPercent && (
                            <Badge variant="secondary">{promotion.discountPercent}% OFF</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">{promotion.description}</p>
                        {promotion.validUntil && (
                          <p className="text-xs text-gray-500 mt-1">
                            Válido até: {new Date(promotion.validUntil).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <Badge variant={promotion.active ? "default" : "secondary"}>
                          {promotion.active ? "Ativo" : "Inativo"}
                        </Badge>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deletePromotion.mutate(promotion.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="site-name">Nome do Site</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="site-name"
                          defaultValue={settings.find(s => s.key === "site_name")?.value || "Rota Caiçara"}
                          onBlur={(e) => updateSetting.mutate({ key: "site_name", value: e.target.value })}
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="site-description">Descrição do Site</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="site-description"
                          defaultValue={settings.find(s => s.key === "site_description")?.value || "Guia de negócios sustentáveis"}
                          onBlur={(e) => updateSetting.mutate({ key: "site_description", value: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-email">Email de Contato</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="contact-email"
                        type="email"
                        defaultValue={settings.find(s => s.key === "contact_email")?.value || "contato@rotacaicara.com.br"}
                        onBlur={(e) => updateSetting.mutate({ key: "contact_email", value: e.target.value })}
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="contact-phone">Telefone de Contato</Label>
                    <div className="flex gap-2">
                      <Input 
                        id="contact-phone"
                        defaultValue={settings.find(s => s.key === "contact_phone")?.value || "(12) 99999-9999"}
                        onBlur={(e) => updateSetting.mutate({ key: "contact_phone", value: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Logs */}
          <TabsContent value="logs" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Logs de Atividade</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {logs.map((log) => (
                    <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{log.action}</Badge>
                          <span className="text-sm">{log.tableName}</span>
                          {log.recordId && <span className="text-sm text-gray-500">#{log.recordId}</span>}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(log.createdAt!).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}