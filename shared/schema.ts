import {
  pgTable,
  text,
  serial,
  integer,
  boolean,
  timestamp,
  json,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon").notNull(),
  color: text("color").default("#006C84"),
  backgroundImage: text("background_image"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  phone: text("phone"),
  whatsapp: text("whatsapp"),
  address: text("address"),
  email: text("email"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  journalLink: text("journal_link"),
  categoryId: integer("category_id").notNull(),
  imageUrl: text("image_url"),
  featured: boolean("featured").default(false),
  certified: boolean("certified").default(false),
  active: boolean("active").default(true),
});

export const businessRegistrations = pgTable("business_registrations", {
  id: serial("id").primaryKey(),
  businessName: text("business_name").notNull(),
  categoryId: integer("category_id").notNull(),
  phone: text("phone").notNull(),
  whatsapp: text("whatsapp").notNull(),
  address: text("address").notNull(),
  description: text("description").notNull(),
  instagram: text("instagram"),
  facebook: text("facebook"),
  contactEmail: text("contact_email"),
  imageUrl: text("image_url"),
  processed: boolean("processed").default(false),
});

export const insertCategorySchema = createInsertSchema(categories)
  .omit({
    id: true,
  })
  .extend({
    color: z.string().optional(),
    icon: z.string().optional(),
    backgroundImage: z.string().optional(),
    active: z.boolean().optional(),
  });

export const insertBusinessSchema = createInsertSchema(businesses)
  .omit({
    id: true,
  })
  .extend({
    email: z.string().email("Email inválido").optional().or(z.literal("")),
    phone: z.string().optional(),
    whatsapp: z.string().optional(),
    address: z.string().optional(),
    imageUrl: z.string().optional(),
    journalLink: z.string().url("Link inválido").or(z.literal("")),
  });

export const insertBusinessRegistrationSchema = createInsertSchema(
  businessRegistrations,
).omit({
  id: true,
});

// Admin Panel Tables
export const banners = pgTable("banners", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  site_name: text("site_name").notNull().default("Rota Caiçara"),
  locality: text("locality").notNull().default("São Sebastião"),
  headline1: text("headline1").notNull().default("DESCUBRA AS MELHORES EMPRESAS"),
  headline2: text("headline2").notNull().default("DE SÃO SEBASTIÃO"),
  headline3: text("headline3").notNull().default("CONECTANDO VOCÊ AOS MELHORES"),
  headline4: text("headline4").notNull().default("NEGÓCIOS DA CIDADE"),
  tagline1: text("tagline1").notNull().default("Conectando você aos melhores negócios da cidade"),
  tagline2: text("tagline2").notNull().default("Descubra, conecte-se, prospere"),
  tagline3: text("tagline3").notNull().default("Sua empresa na palma da mão"),
  tagline4: text("tagline4").notNull().default("O futuro do comércio local"),
  phone: text("phone").notNull().default("(12) 99999-0000"),
  email: text("email").notNull().default("contato@rotacaicara.com.br"),
  address: text("address").notNull().default("São Sebastião, SP"),
  instagram_url: text("instagram_url").notNull().default("https://instagram.com/rotacaicara"),
  whatsapp_url: text("whatsapp_url").notNull().default("https://wa.me/5512999999999"),
  facebook_url: text("facebook_url").notNull().default("https://facebook.com/rotacaicara"),
  whatsapp: text("whatsapp"),
  website: text("website"),
  instagram: text("instagram"),
  facebook: text("facebook"),
  faq1_question: text("faq1_question").notNull().default("Como funciona o cadastro?"),
  faq1_answer: text("faq1_answer").notNull().default("É simples e gratuito. Basta preencher o formulário com os dados do seu negócio."),
  faq2_question: text("faq2_question").notNull().default("Quanto custa para anunciar?"),
  faq2_answer: text("faq2_answer").notNull().default("O cadastro básico é gratuito. Temos planos premium com recursos adicionais."),
  faq3_question: text("faq3_question").notNull().default("Como edito meu anúncio?"),
  faq3_answer: text("faq3_answer").notNull().default("Entre em contato conosco através do WhatsApp ou email para alterações."),
  faq4_question: text("faq4_question").notNull().default("Posso ter mais de um negócio cadastrado?"),
  faq4_answer: text("faq4_answer").notNull().default("Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário."),
  updated_at: timestamp("updated_at").defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: serial("id").primaryKey(),
  siteName: text("site_name").notNull().default("Rota Caiçara"),
  locality: text("locality").notNull().default("São Sebastião"),

  // Headlines for different sections
  headline1: text("headline1")
    .notNull()
    .default("DESCUBRA AS MELHORES EMPRESAS"),
  headline2: text("headline2").notNull().default("DE SÃO SEBASTIÃO"),
  headline3: text("headline3")
    .notNull()
    .default("CONECTANDO VOCÊ AOS MELHORES"),
  headline4: text("headline4").notNull().default("NEGÓCIOS DA CIDADE"),

  // Taglines for different sections
  tagline1: text("tagline1")
    .notNull()
    .default("Conectando você aos melhores negócios da cidade"),
  tagline2: text("tagline2")
    .notNull()
    .default("Descubra, conecte-se, prospere"),
  tagline3: text("tagline3").notNull().default("Sua empresa na palma da mão"),
  tagline4: text("tagline4").notNull().default("O futuro do comércio local"),

  // Contact information
  phone: text("phone").notNull().default("(12) 99999-0000"),
  email: text("email").notNull().default("contato@rotacaicara.com.br"),
  address: text("address").notNull().default("São Sebastião, SP"),

  // Logo URL
  logoUrl: text("logo_url")
    .notNull()
    .default("https://i.ibb.co/LhhDX2hz/Logo-1.jpg"),

  // Social media URLs
  instagramUrl: text("instagram_url")
    .notNull()
    .default("https://instagram.com/rotacaicara"),
  whatsappUrl: text("whatsapp_url")
    .notNull()
    .default("https://wa.me/5512999999999"),
  facebookUrl: text("facebook_url")
    .notNull()
    .default("https://facebook.com/rotacaicara"),

  // Footer and Advertise page settings
  footerDescription: text("footer_description").notNull().default("Conectando você às melhores empresas da cidade com sustentabilidade e qualidade."),
  advertiseHeadline: text("advertise_headline").notNull().default("SUA MARCA EM DESTAQUE ENTRE AS MELHORES"),
  advertiseSubtitle1: text("advertise_subtitle1").notNull().default("Onde excelência encontra visibilidade!"),
  advertiseSubtitle2: text("advertise_subtitle2").notNull().default("Junte-se à nossa comunidade sustentável e fortaleça sua reputação empresarial com divulgação multicanal eficiente e impactante."),

  // FAQs for admin
  faq1Question: text("faq1_question")
    .notNull()
    .default("Posso parcelar no cartão?"),
  faq1Answer: text("faq1_answer")
    .notNull()
    .default(
      "Sim, aceitamos parcelamento no cartão de crédito para facilitar seu investimento em marketing.",
    ),
  faq2Question: text("faq2_question")
    .notNull()
    .default("Quanto tempo leva para ativar o anúncio?"),
  faq2Answer: text("faq2_answer")
    .notNull()
    .default(
      "Após aprovação, seu anúncio fica ativo em até 24 horas úteis.",
    ),
  faq3Question: text("faq3_question")
    .notNull()
    .default("Como retirar o certificado?"),
  faq3Answer: text("faq3_answer")
    .notNull()
    .default(
      "O certificado digital será enviado por email após aprovação do seu cadastro.",
    ),
  faq4Question: text("faq4_question")
    .notNull()
    .default("Empresas de outras cidades podem anunciar?"),
  faq4Answer: text("faq4_answer")
    .notNull()
    .default(
      "Sim, desde que atendam nossa região ou ofereçam serviços para nossos usuários locais.",
    ),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const testimonials = pgTable("testimonials", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  company: text("company"),
  content: text("content").notNull(),
  imageUrl: text("image_url"),
  rating: integer("rating").default(5),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const faqs = pgTable("faqs", {
  id: serial("id").primaryKey(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  order: integer("order").default(0),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const adminLogs = pgTable("admin_logs", {
  id: serial("id").primaryKey(),
  action: text("action").notNull(),
  tableName: text("table_name"),
  recordId: integer("record_id"),
  oldValues: json("old_values"),
  newValues: json("new_values"),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const promotions = pgTable("promotions", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  businessId: integer("business_id"),
  discountPercent: integer("discount_percent"),
  validUntil: timestamp("valid_until"),
  active: boolean("active").default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

export const analytics = pgTable("analytics", {
  id: serial("id").primaryKey(),
  path: text("path").notNull(),
  userAgent: text("user_agent"),
  ipAddress: text("ip_address"),
  referrer: text("referrer"),
  visitedAt: timestamp("visited_at").defaultNow(),
});

export const sessions = pgTable("sessions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull().unique(),
  data: json("data"),
  expiresAt: timestamp("expires_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const news = pgTable("news", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description"),
  url: text("url").notNull(),
  imageUrl: text("image_url"),
  sourceName: text("source_name").notNull(),
  publishedAt: timestamp("published_at"),
  active: boolean("active").default(true),
  order: integer("order").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas for admin tables
export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
});
export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  updatedAt: true,
});
export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
});
export const insertFaqSchema = createInsertSchema(faqs).omit({
  id: true,
  createdAt: true,
});
export const insertPromotionSchema = createInsertSchema(promotions).omit({
  id: true,
  createdAt: true,
});
export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  visitedAt: true,
});
export const insertNewsSchema = createInsertSchema(news).omit({
  id: true,
  createdAt: true,
});

export type Category = typeof categories.$inferSelect;
export type Business = typeof businesses.$inferSelect;
export type BusinessRegistration = typeof businessRegistrations.$inferSelect;
export type Banner = typeof banners.$inferSelect;
export type SiteSetting = typeof siteSettings.$inferSelect;
export type Setting = typeof settings.$inferSelect;
export type Session = typeof sessions.$inferSelect;
export type Testimonial = typeof testimonials.$inferSelect;
export type Faq = typeof faqs.$inferSelect;
export type AdminLog = typeof adminLogs.$inferSelect;
export type Promotion = typeof promotions.$inferSelect;
export type Analytics = typeof analytics.$inferSelect;
export type News = typeof news.$inferSelect;

export type InsertCategory = z.infer<typeof insertCategorySchema>;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type InsertBusinessRegistration = z.infer<
  typeof insertBusinessRegistrationSchema
>;
export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type InsertFaq = z.infer<typeof insertFaqSchema>;
export type InsertPromotion = z.infer<typeof insertPromotionSchema>;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type InsertNews = z.infer<typeof insertNewsSchema>;
