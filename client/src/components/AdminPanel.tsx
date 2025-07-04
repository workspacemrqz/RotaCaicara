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
import { useSettings } from "@/context/SettingsContext";
import { insertSiteSettingSchema } from "@shared/schema";
import type {
  Business,
  Category,
  BusinessRegistration,
  Analytics,
  InsertSiteSetting,
} from "@shared/schema";
import {
  insertBusinessSchema,
  insertCategorySchema,
  insertBusinessRegistrationSchema,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { z } from "zod";
import {
  LogOut,
  Users,
  Building2,
  Settings,
  BarChart3,
  UserPlus,
  Search, 
  Plus, 
  Edit, 
  Trash2,
  ArrowLeft,
  ArrowRight
} from "lucide-react";

// Scroll to top helper
const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

interface AdminPanelProps {
  onLogout: () => void;
}

export default function AdminPanel({ onLogout }: AdminPanelProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Queries
  const { data: businesses = [] } = useQuery<Business[]>({
    queryKey: ["/api/businesses"],
  });

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const { data: businessRegistrations = [] } = useQuery<BusinessRegistration[]>(
    {
      queryKey: ["/api/admin/business-registrations"],
    },
  );

  const { data: analytics = [] } = useQuery<Analytics[]>({
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

  // Forms
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
      imageUrl: "",
      featured: false,
      certified: false,
      active: true,
    },
  });

  const categoryForm = useForm<z.infer<typeof insertCategorySchema>>({
    resolver: zodResolver(insertCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      icon: "store",
      active: true,
    },
  });

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

  // Mutations
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

  // Placeholder for actual UI - will return the actual admin panel UI
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Painel Administrativo
              </h1>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-gray-600 hover:text-gray-900"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sair
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="businesses" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="businesses" className="flex items-center gap-2">
              <Building2 className="w-4 h-4" />
              Negócios
            </TabsTrigger>
            <TabsTrigger value="registrations" className="flex items-center gap-2">
              <UserPlus className="w-4 h-4" />
              Cadastros
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              Configurações
            </TabsTrigger>
          </TabsList>

          <TabsContent value="businesses" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Gestão de Negócios</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Interface de gestão de negócios...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="registrations" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Cadastros Pendentes</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Lista de cadastros pendentes...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Analytics</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Dados de analytics...</p>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Configurações do Site</CardTitle>
              </CardHeader>
              <CardContent>
                <p>Configurações gerais...</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}