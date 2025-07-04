import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
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
import {
  insertBusinessRegistrationSchema,
  type InsertBusinessRegistration,
  type Category,
  type SiteSetting,
} from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CheckCircle } from "lucide-react";
import ImageUpload from "@/components/image-upload";
import { useSettings } from "@/context/SettingsContext";

export default function Advertise() {
  const { settings } = useSettings();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  const form = useForm<InsertBusinessRegistration>({
    resolver: zodResolver(insertBusinessRegistrationSchema),
    defaultValues: {
      businessName: "",
      categoryId: 0,
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

  const [successModalOpen, setSuccessModalOpen] = useState(false);

  const createRegistrationMutation = useMutation({
    mutationFn: async (data: InsertBusinessRegistration) => {
      const response = await apiRequest("POST", "/api/submissions", data);
      return response;
    },
    onSuccess: () => {
      setSuccessModalOpen(true);
      form.reset();
      toast({
        title: "Cadastro enviado com sucesso!",
        description:
          "Entraremos em contato em breve para finalizar seu anúncio.",
      });
      queryClient.invalidateQueries({
        queryKey: ["/api/business-registrations"],
      });
    },
    onError: () => {
      toast({
        title: "Erro ao enviar cadastro",
        description: "Tente novamente mais tarde.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertBusinessRegistration) => {
    createRegistrationMutation.mutate(data);
  };

  const faqs = [
    {
      question: settings?.faq1Question?.trim()
        ? settings.faq1Question
        : "Posso parcelar no cartão?",
      answer: settings?.faq1Answer?.trim()
        ? settings.faq1Answer
        : "Sim! Oferecemos parcelamento em até 10x de R$ 29,70 sem juros.",
    },
    {
      question: settings?.faq2Question?.trim()
        ? settings.faq2Question
        : "Quanto tempo leva para ativar o anúncio?",
      answer: settings?.faq2Answer?.trim()
        ? settings.faq2Answer
        : "Seu anúncio fica ativo em até 24 horas após a confirmação do pagamento.",
    },
    {
      question: settings?.faq3Question?.trim()
        ? settings.faq3Question
        : "Como retirar o certificado?",
      answer: settings?.faq3Answer?.trim()
        ? settings.faq3Answer
        : "O certificado digital é enviado por email e WhatsApp após a ativação.",
    },
    {
      question: settings?.faq4Question?.trim()
        ? settings.faq4Question
        : "Empresas de outras cidades podem anunciar?",
      answer: settings?.faq4Answer?.trim()
        ? settings.faq4Answer
        : "Este guia é específico para São José dos Campos. Consulte sobre franquias para outras cidades.",
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-petroleo to-petroleo-dark py-8 sm:py-12 lg:py-16 parallax-section fade-in w-full overflow-hidden">
        <div className="responsive-container text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 fade-in text-responsive px-2">
            {settings?.advertiseHeadline?.trim()
              ? settings.advertiseHeadline
              : "SUA MARCA EM DESTAQUE ENTRE AS MELHORES"}
          </h2>
          <p className="text-lg sm:text-xl text-white/90 mb-6 sm:mb-8 fade-in animate-stagger-1 text-responsive px-2">
            {settings?.advertiseSubtitle1?.trim()
              ? settings.advertiseSubtitle1
              : "Onde excelência encontra visibilidade!"}
          </p>
          <p className="text-base sm:text-lg text-white/80 max-w-3xl mx-auto fade-in animate-stagger-2 text-responsive px-2 leading-relaxed">
            {settings?.advertiseSubtitle2?.trim()
              ? settings.advertiseSubtitle2
              : "Junte-se à nossa comunidade sustentável e fortaleça sua reputação empresarial com divulgação multicanal eficiente e impactante."}
          </p>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="py-16 bg-offwhite">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-petroleo-dark text-center mb-12">
            PERGUNTAS FREQUENTES
          </h3>
          <Accordion type="single" collapsible className="space-y-4">
            {faqs.map((faq, idx) => (
              <AccordionItem
                key={idx}
                value={`item-${idx + 1}`}
                className="bg-white rounded-xl px-6 shadow-lg"
              >
                <AccordionTrigger className="font-bold text-petroleo-dark text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-gray-600 text-left">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>

      {/* Contact Form */}
      <div className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-petroleo-dark text-center mb-12">
            CADASTRE SUA EMPRESA
          </h3>
          <Card>
            <CardContent className="p-8">
              <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="businessName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome da Empresa *</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Digite o nome da sua empresa" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="categoryId"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Categoria *</FormLabel>
                            <Select
                              onValueChange={(value) => field.onChange(parseInt(value))}
                              value={field.value.toString()}
                            >
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                        name="whatsapp"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>WhatsApp</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="(12) 99999-0000" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="contactEmail"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email de Contato</FormLabel>
                          <FormControl>
                            <Input {...field} value={field.value || ""} type="email" placeholder="contato@empresa.com" />
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
                            <Input {...field} placeholder="Rua, número, bairro, cidade" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Descrição da Empresa</FormLabel>
                          <FormControl>
                            <Textarea 
                              {...field} 
                              rows={4}
                              placeholder="Descreva sua empresa, produtos e serviços..." 
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="instagram"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Instagram</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="@empresa" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="facebook"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Facebook</FormLabel>
                            <FormControl>
                              <Input {...field} value={field.value || ""} placeholder="facebook.com/empresa" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="imageUrl"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Logo da Empresa</FormLabel>
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

                    <Button
                      type="submit"
                      disabled={createRegistrationMutation.isPending}
                      className="w-full bg-[#006C84] hover:bg-[#005A6A] text-white py-3"
                    >
                      {createRegistrationMutation.isPending ? "Enviando..." : "Enviar Cadastro"}
                    </Button>
                  </form>
                </Form>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={successModalOpen} onOpenChange={setSuccessModalOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-green-600" />
              </motion.div>
              Cadastro Enviado!
            </DialogTitle>
          </DialogHeader>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="text-center space-y-4"
          >
            <p className="text-gray-600">
              Seu cadastro foi enviado com sucesso! Nossa equipe analisará as
              informações e entrará em contato em breve.
            </p>
            <Button
              onClick={() => setSuccessModalOpen(false)}
              className="bg-[#006C84] hover:bg-[#005A6A] w-full"
            >
              Fechar
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
