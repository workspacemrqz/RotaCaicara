import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion } from "framer-motion";
import { Eye, Edit, CheckCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { insertBusinessRegistrationSchema } from "@shared/schema";
import type { BusinessRegistration, Category } from "@shared/schema";

export default function AdminSubmissions() {
  const { toast } = useToast();
  const [selectedSubmission, setSelectedSubmission] = useState<BusinessRegistration | null>(null);
  const [editingSubmission, setEditingSubmission] = useState<BusinessRegistration | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  // Fetch submissions and categories
  const { data: submissions = [], isLoading: submissionsLoading } = useQuery({
    queryKey: ["/api/admin/business-registrations"],
    queryFn: async () => {
      const response = await fetch("/api/admin/business-registrations");
      return response.json();
    }
  });

  const { data: categories = [] } = useQuery({
    queryKey: ["/api/categories"],
    queryFn: async () => {
      const response = await fetch("/api/categories");
      return response.json();
    }
  });

  // Form for editing submissions
  const submissionForm = useForm<z.infer<typeof insertBusinessRegistrationSchema>>({
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

  // Individual submission fetch mutation
  const fetchSubmission = useMutation({
    mutationFn: async (id: number) => {
      const response = await fetch(`/api/admin/submissions/${id}`);
      if (!response.ok) throw new Error("Failed to fetch submission");
      return response.json();
    },
    onSuccess: (data) => {
      setSelectedSubmission(data);
      setViewDialogOpen(true);
    },
    onError: () => {
      toast({
        title: "Erro ao carregar cadastro",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    }
  });

  // Edit submission mutation
  const updateSubmission = useMutation({
    mutationFn: async ({ id, data }: { id: number; data: any }) => {
      return apiRequest("PATCH", `/api/admin/submissions/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-registrations"] });
      setEditDialogOpen(false);
      setEditingSubmission(null);
      toast({ title: "Cadastro atualizado com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao atualizar cadastro",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  // Publish submission mutation (approve and create business)
  const publishSubmission = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("PATCH", `/api/admin/submissions/${id}`, { 
        status: 'approved', 
        processed: true 
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-registrations"] });
      queryClient.invalidateQueries({ queryKey: ["/api/businesses"] });
      toast({ title: "Empresa publicada com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao publicar empresa",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  // Delete submission mutation
  const deleteSubmission = useMutation({
    mutationFn: async (id: number) => {
      return apiRequest("DELETE", `/api/admin/submissions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/business-registrations"] });
      toast({ title: "Cadastro excluído com sucesso" });
    },
    onError: () => {
      toast({
        title: "Erro ao excluir cadastro",
        description: "Tente novamente em alguns instantes",
        variant: "destructive"
      });
    },
  });

  // Handle view submission
  const handleViewSubmission = (submission: BusinessRegistration) => {
    fetchSubmission.mutate(submission.id);
  };

  // Handle edit submission
  const handleEditSubmission = (submission: BusinessRegistration) => {
    setEditingSubmission(submission);
    submissionForm.reset({
      businessName: submission.businessName,
      categoryId: submission.categoryId,
      phone: submission.phone,
      whatsapp: submission.whatsapp,
      address: submission.address,
      description: submission.description,
      instagram: submission.instagram || "",
      facebook: submission.facebook || "",
      contactEmail: submission.contactEmail || "",
      imageUrl: submission.imageUrl || "",
      processed: submission.processed || false,
    });
    setEditDialogOpen(true);
  };

  // Handle submission form submit
  const handleSubmissionSubmit = async (data: z.infer<typeof insertBusinessRegistrationSchema>) => {
    if (!editingSubmission) return;
    
    try {
      await updateSubmission.mutateAsync({
        id: editingSubmission.id,
        data: {
          ...data,
          categoryId: Number(data.categoryId),
        }
      });
    } catch (error) {
      console.error("Error updating submission:", error);
    }
  };

  if (submissionsLoading) {
    return <div className="p-6">Carregando cadastros...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-[#006C84]">Gerenciar Cadastros</h2>
        <Badge variant="secondary">{submissions.length} cadastros</Badge>
      </div>

      <div className="grid gap-4 stagger-fade-in">
        {submissions.map((submission: BusinessRegistration, index: number) => {
          const category = categories.find((c: Category) => c.id === submission.categoryId);
          
          return (
            <motion.div
              key={submission.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">{submission.businessName}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant={submission.processed ? "default" : "secondary"}>
                        {submission.processed ? "Processado" : "Pendente"}
                      </Badge>
                      <Badge variant="outline">{category?.name}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Telefone</p>
                      <p className="font-medium">{submission.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">WhatsApp</p>
                      <p className="font-medium">{submission.whatsapp}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm text-muted-foreground">Endereço</p>
                      <p className="font-medium">{submission.address}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleViewSubmission(submission)}
                      disabled={fetchSubmission.isPending}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Ver
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEditSubmission(submission)}
                    >
                      <Edit className="h-4 w-4 mr-1" />
                      Editar
                    </Button>
                    
                    {!submission.processed && (
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => publishSubmission.mutate(submission.id)}
                        disabled={publishSubmission.isPending}
                        className="bg-[#006C84] hover:bg-[#005A6A]"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Publicar
                      </Button>
                    )}
                    
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => deleteSubmission.mutate(submission.id)}
                      disabled={deleteSubmission.isPending}
                    >
                      <Trash2 className="h-4 w-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* View Submission Dialog */}
      <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detalhes do Cadastro</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Nome da Empresa</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.businessName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">Categoria</label>
                  <p className="mt-1 p-2 bg-muted rounded">
                    {categories.find((c: Category) => c.id === selectedSubmission.categoryId)?.name}
                  </p>
                </div>
                <div>
                  <label className="text-sm font-medium">Telefone</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.phone}</p>
                </div>
                <div>
                  <label className="text-sm font-medium">WhatsApp</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.whatsapp}</p>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium">Endereço</label>
                <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.address}</p>
              </div>
              <div>
                <label className="text-sm font-medium">Descrição</label>
                <p className="mt-1 p-2 bg-muted rounded whitespace-pre-wrap">{selectedSubmission.description}</p>
              </div>
              {selectedSubmission.contactEmail && (
                <div>
                  <label className="text-sm font-medium">Email</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.contactEmail}</p>
                </div>
              )}
              {selectedSubmission.instagram && (
                <div>
                  <label className="text-sm font-medium">Instagram</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.instagram}</p>
                </div>
              )}
              {selectedSubmission.facebook && (
                <div>
                  <label className="text-sm font-medium">Facebook</label>
                  <p className="mt-1 p-2 bg-muted rounded">{selectedSubmission.facebook}</p>
                </div>
              )}
              {selectedSubmission.imageUrl && (
                <div>
                  <label className="text-sm font-medium">Imagem</label>
                  <img 
                    src={selectedSubmission.imageUrl} 
                    alt="Empresa" 
                    className="mt-1 max-w-full h-auto rounded border"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Submission Dialog */}
      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Cadastro</DialogTitle>
          </DialogHeader>
          <Form {...submissionForm}>
            <form onSubmit={submissionForm.handleSubmit(handleSubmissionSubmit)} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={submissionForm.control}
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
                  control={submissionForm.control}
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
                          {categories.map((category: Category) => (
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
                
                <FormField
                  control={submissionForm.control}
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
                  control={submissionForm.control}
                  name="whatsapp"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>WhatsApp</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={submissionForm.control}
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
                control={submissionForm.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descrição</FormLabel>
                    <FormControl>
                      <Textarea {...field} rows={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={submissionForm.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} type="email" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={submissionForm.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>URL da Imagem</FormLabel>
                      <FormControl>
                        <Input {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button type="button" variant="outline" onClick={() => setEditDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  disabled={updateSubmission.isPending}
                  className="bg-[#006C84] hover:bg-[#005A6A]"
                >
                  {updateSubmission.isPending ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}