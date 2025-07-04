import {
  categories,
  businesses,
  businessRegistrations,
  banners,
  siteSettings,
  testimonials,
  faqs,
  adminLogs,
  promotions,
  analytics,
  news,
  type Category,
  type Business,
  type BusinessRegistration,
  type Banner,
  type SiteSetting,
  type Testimonial,
  type Faq,
  type AdminLog,
  type Promotion,
  type Analytics,
  type News,
  type InsertCategory,
  type InsertBusiness,
  type InsertBusinessRegistration,
  type InsertBanner,
  type InsertSiteSetting,
  type InsertTestimonial,
  type InsertFaq,
  type InsertPromotion,
  type InsertAnalytics,
  type InsertNews,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, asc, sql, ilike, and } from "drizzle-orm";

export interface IStorage {
  // Categories
  getCategories(): Promise<Category[]>;
  getCategoryBySlug(slug: string): Promise<Category | undefined>;
  createCategory(category: InsertCategory): Promise<Category>;
  updateCategory(
    id: number,
    category: Partial<InsertCategory>,
  ): Promise<Category>;
  deleteCategory(id: number): Promise<void>;

  // Businesses
  getBusinesses(): Promise<Business[]>;
  getBusinessesByCategory(categoryId: number): Promise<Business[]>;
  getFeaturedBusinesses(): Promise<Business[]>;
  getBusiness(id: number): Promise<Business | undefined>;
  createBusiness(business: InsertBusiness): Promise<Business>;
  updateBusiness(
    id: number,
    business: Partial<InsertBusiness>,
  ): Promise<Business>;
  deleteBusiness(id: number): Promise<void>;
  searchBusinesses(query: string): Promise<Business[]>;

  // Business Registrations
  createBusinessRegistration(
    registration: InsertBusinessRegistration,
  ): Promise<BusinessRegistration>;
  getBusinessRegistrations(): Promise<BusinessRegistration[]>;
  updateBusinessRegistration(
    id: number,
    registration: Partial<InsertBusinessRegistration>,
  ): Promise<BusinessRegistration>;
  deleteBusinessRegistration(id: number): Promise<void>;

  // Admin Panel Methods
  getBanners(): Promise<Banner[]>;
  createBanner(banner: InsertBanner): Promise<Banner>;
  updateBanner(id: number, banner: Partial<InsertBanner>): Promise<Banner>;
  deleteBanner(id: number): Promise<void>;

  getSiteSettings(): Promise<SiteSetting>;
  updateSiteSettings(
    settings: Partial<InsertSiteSetting>,
  ): Promise<SiteSetting>;

  getTestimonials(): Promise<Testimonial[]>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  updateTestimonial(
    id: number,
    testimonial: Partial<InsertTestimonial>,
  ): Promise<Testimonial>;
  deleteTestimonial(id: number): Promise<void>;

  getFaqs(): Promise<Faq[]>;
  createFaq(faq: InsertFaq): Promise<Faq>;
  updateFaq(id: number, faq: Partial<InsertFaq>): Promise<Faq>;
  deleteFaq(id: number): Promise<void>;

  getPromotions(): Promise<Promotion[]>;
  createPromotion(promotion: InsertPromotion): Promise<Promotion>;
  updatePromotion(
    id: number,
    promotion: Partial<InsertPromotion>,
  ): Promise<Promotion>;
  deletePromotion(id: number): Promise<void>;

  getNews(): Promise<News[]>;
  createNews(news: InsertNews): Promise<News>;
  updateNews(id: number, news: Partial<InsertNews>): Promise<News>;
  deleteNews(id: number): Promise<void>;

  logAdminAction(
    action: string,
    tableName?: string,
    recordId?: number,
    oldValues?: any,
    newValues?: any,
  ): Promise<void>;
  getAdminLogs(): Promise<AdminLog[]>;

  trackAnalytics(data: InsertAnalytics): Promise<void>;
  getAnalytics(): Promise<Analytics[]>;
}

// Use MemStorage for compatibility with $10 deployment
// Legacy MemStorage class - replaced by DatabaseStorage
class MemStorage implements IStorage {
  private categories: Map<number, Category>;
  private businesses: Map<number, Business>;
  private businessRegistrations: Map<number, BusinessRegistration>;
  private banners: Map<number, Banner>;
  private settings: Map<string, SiteSetting>;
  private testimonials: Map<number, Testimonial>;
  private faqs: Map<number, Faq>;
  private promotions: Map<number, Promotion>;
  private logs: Map<number, AdminLog>;
  private analytics: Map<number, Analytics>;
  private newsItems: Map<number, News>;

  private currentCategoryId: number;
  private currentBusinessId: number;
  private currentRegistrationId: number;
  private currentBannerId: number;
  private currentSettingId: number;
  private currentTestimonialId: number;
  private currentFaqId: number;
  private currentPromotionId: number;
  private currentLogId: number;
  private currentAnalyticsId: number;
  private currentNewsId: number;

  constructor() {
    this.categories = new Map();
    this.businesses = new Map();
    this.businessRegistrations = new Map();
    this.banners = new Map();
    this.settings = new Map();
    this.testimonials = new Map();
    this.faqs = new Map();
    this.promotions = new Map();
    this.logs = new Map();
    this.analytics = new Map();
    this.newsItems = new Map();

    this.currentCategoryId = 1;
    this.currentBusinessId = 1;
    this.currentRegistrationId = 1;
    this.currentBannerId = 1;
    this.currentSettingId = 1;
    this.currentTestimonialId = 1;
    this.currentFaqId = 1;
    this.currentPromotionId = 1;
    this.currentLogId = 1;
    this.currentAnalyticsId = 1;
    this.currentNewsId = 1;

    this.seedData();
  }

  private seedData() {
    // Seed categories
    const categoryData = [
      {
        name: "PARA SUA REFEIÇÃO",
        slug: "para-sua-refeicao",
        icon: "🍽️",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA CASA",
        slug: "para-sua-casa",
        icon: "🏠",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA EMPRESA",
        slug: "para-sua-empresa",
        icon: "🏭",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA SAÚDE",
        slug: "para-sua-saude",
        icon: "💚",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU AUTOMÓVEL",
        slug: "para-seu-automovel",
        icon: "🚗",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA BELEZA",
        slug: "para-sua-beleza",
        icon: "💄",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU BEBÊ",
        slug: "para-seu-bebe",
        icon: "👶",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU PET",
        slug: "para-seu-pet",
        icon: "🐕",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA EDUCAÇÃO",
        slug: "para-sua-educacao",
        icon: "✏️",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU CORPO",
        slug: "para-seu-corpo",
        icon: "🏋️",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA FESTA",
        slug: "para-sua-festa",
        icon: "🎂",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA VIAGEM",
        slug: "para-sua-viagem",
        icon: "🏖️",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA DIVERSÃO",
        slug: "para-sua-diversao",
        icon: "🎭",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
      {
        name: "NOVIDADES NA CIDADE",
        slug: "novidades-na-cidade",
        icon: "⭐",
        color: "#006C84",
        backgroundImage: null,
        active: true,
      },
    ];

    categoryData.forEach((cat) => {
      const category: Category = { ...cat, id: this.currentCategoryId++ };
      this.categories.set(category.id, category);
    });

    // Seed businesses
    const businessData = [
      {
        name: "Horta Orgânica São Sebastião",
        description:
          "Produzimos verduras e legumes 100% orgânicos, sem agrotóxicos. Entrega em domicílio na região.",
        phone: "(12) 99999-1234",
        whatsapp: "5512999991234",
        address: "Rua das Flores, 123 - Centro, São Sebastião",
        email: "contato@hortaorganica.com.br",
        website: null,
        instagram: "hortaorganicass",
        facebook: "hortaorganicasaosebastiao",
        journalLink: "",
        categoryId: 1,
        imageUrl:
          "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
        featured: true,
        certified: true,
        active: true,
      },
      {
        name: "Energia Solar Litoral",
        description:
          "Instalação e manutenção de sistemas de energia solar residencial e comercial.",
        phone: "(12) 99999-5678",
        whatsapp: "5512999995678",
        address: "Av. Atlântica, 456 - Praia Grande, São Sebastião",
        email: "contato@energiasolar.com.br",
        website: null,
        instagram: "energiasolarlitoral",
        facebook: null,
        journalLink: "",
        categoryId: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400",
        featured: true,
        certified: true,
        active: true,
      },
      {
        name: "Eco Moda Caiçara",
        description:
          "Roupas sustentáveis feitas com materiais reciclados e técnicas artesanais tradicionais.",
        phone: "(12) 99999-9012",
        whatsapp: "5512999999012",
        address: "Rua do Comércio, 789 - Centro Histórico, São Sebastião",
        email: null,
        website: null,
        instagram: "ecomodacaicara",
        facebook: "ecomodacaicara",
        journalLink: "",
        categoryId: 3,
        imageUrl:
          "https://images.unsplash.com/photo-1445205170230-053b83016050?w=400",
        featured: false,
        certified: true,
        active: true,
      },
      {
        name: "Construções Ecológicas Bertioga",
        description:
          "Construção e reforma sustentável com materiais ecológicos e técnicas de baixo impacto.",
        phone: "(12) 99999-3456",
        whatsapp: "5512999993456",
        address: "Estrada da Balsa, 321 - Bertioga, São Sebastião",
        email: "contato@construcoeseco.com.br",
        website: null,
        instagram: null,
        facebook: null,
        journalLink: "",
        categoryId: 2,
        imageUrl:
          "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?w=400",
        featured: false,
        certified: false,
        active: true,
      },
    ];

    businessData.forEach((business) => {
      const newBusiness: Business = {
        ...business,
        id: this.currentBusinessId++,
      };
      this.businesses.set(newBusiness.id, newBusiness);
    });

    // Seed site settings
    const newSetting: SiteSetting = {
      id: this.currentSettingId++,
      siteName: "Rota Caiçara",
      locality: "São Sebastião",
      headline1: "DESCUBRA AS MELHORES EMPRESAS",
      headline2: "DE SÃO SEBASTIÃO",
      headline3: "CONECTANDO VOCÊ AOS MELHORES",
      headline4: "NEGÓCIOS DA CIDADE",
      tagline1: "Conectando você aos melhores negócios da cidade",
      tagline2: "Descubra, conecte-se, prospere",
      tagline3: "Sua empresa na palma da mão",
      tagline4: "O futuro do comércio local",
      phone: "(12) 99999-0000",
      email: "contato@rotacaicara.com.br",
      address: "São Sebastião, SP",
      instagramUrl: "https://instagram.com/rotacaicara",
      whatsappUrl: "https://wa.me/5512999999999",
      facebookUrl: "https://facebook.com/rotacaicara",
      whatsapp: null,
      website: null,
      instagram: null,
      facebook: null,
      faq1Question: "Como funciona o cadastro?",
      faq1Answer:
        "É simples e gratuito. Basta preencher o formulário com os dados do seu negócio.",
      faq2Question: "Quanto custa para anunciar?",
      faq2Answer:
        "O cadastro básico é gratuito. Temos planos premium com recursos adicionais.",
      faq3Question: "Como edito meu anúncio?",
      faq3Answer:
        "Entre em contato conosco através do WhatsApp ou email para alterações.",
      faq4Question: "Posso ter mais de um negócio cadastrado?",
      faq4Answer:
        "Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário.",
      updatedAt: new Date(),
    };
    this.settings.set("main", newSetting);

    // Seed news
    const newsData = [
      {
        title: "Nova feira orgânica no centro da cidade",
        description:
          "A partir deste fim de semana, produtores locais oferecerão produtos orgânicos na Praça Central",
        url: "https://exemplo.com/noticia1",
        imageUrl:
          "https://images.unsplash.com/photo-1542838132-92c53300491e?w=400",
        sourceName: "Portal São Sebastião",
        publishedAt: new Date(),
        active: true,
        order: 1,
      },
      {
        title: "Projeto de energia solar beneficia 50 famílias",
        description:
          "Iniciativa local instalou painéis solares em residências de baixa renda",
        url: "https://exemplo.com/noticia2",
        imageUrl:
          "https://images.unsplash.com/photo-1466611653911-95081537e5b7?w=400",
        sourceName: "Jornal Litoral",
        publishedAt: new Date(),
        active: true,
        order: 2,
      },
    ];

    newsData.forEach((newsItem) => {
      const news: News = {
        ...newsItem,
        id: this.currentNewsId++,
        createdAt: new Date(),
      };
      this.newsItems.set(news.id, news);
    });
  }

  async getCategories(): Promise<Category[]> {
    return Array.from(this.categories.values()).filter((c) => c.active);
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    return Array.from(this.categories.values()).find(
      (c) => c.slug === slug && c.active,
    );
  }

  async createCategory(insertCategory: InsertCategory): Promise<Category> {
    const id = this.currentCategoryId++;
    const category: Category = {
      id,
      name: insertCategory.name,
      slug: insertCategory.slug,
      icon: insertCategory.icon || "store",
      backgroundImage: insertCategory.backgroundImage || null,
      active: insertCategory.active !== false,
    };
    this.categories.set(id, category);
    return category;
  }

  async updateCategory(
    id: number,
    category: Partial<InsertCategory>,
  ): Promise<Category> {
    const existing = this.categories.get(id);
    if (!existing) throw new Error("Category not found");
    const updated = { ...existing, ...category };
    this.categories.set(id, updated);
    return updated;
  }

  async deleteCategory(id: number): Promise<void> {
    this.categories.delete(id);
  }

  async getBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter((b) => b.active);
  }

  async getBusinessesByCategory(categoryId: number): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      (b) => b.categoryId === categoryId && b.active,
    );
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    return Array.from(this.businesses.values()).filter(
      (b) => b.featured && b.active,
    );
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    return this.businesses.get(id);
  }

  async createBusiness(insertBusiness: InsertBusiness): Promise<Business> {
    const id = this.currentBusinessId++;
    const business: Business = {
      ...insertBusiness,
      id,
      website: insertBusiness.website || null,
      phone: insertBusiness.phone || null,
      whatsapp: insertBusiness.whatsapp || null,
      address: insertBusiness.address || null,
      email: insertBusiness.email || null,
      instagram: insertBusiness.instagram || null,
      facebook: insertBusiness.facebook || null,
      imageUrl: insertBusiness.imageUrl || null,
      featured: insertBusiness.featured || false,
      certified: insertBusiness.certified || false,
      active: insertBusiness.active !== false,
    };
    this.businesses.set(id, business);
    return business;
  }

  async updateBusiness(
    id: number,
    business: Partial<InsertBusiness>,
  ): Promise<Business> {
    const existing = this.businesses.get(id);
    if (!existing) throw new Error("Business not found");
    const updated = { ...existing, ...business };
    this.businesses.set(id, updated);
    return updated;
  }

  async deleteBusiness(id: number): Promise<void> {
    this.businesses.delete(id);
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    const lowerQuery = query.toLowerCase();
    return Array.from(this.businesses.values()).filter(
      (b) =>
        b.active &&
        (b.name.toLowerCase().includes(lowerQuery) ||
          b.description.toLowerCase().includes(lowerQuery)),
    );
  }

  async createBusinessRegistration(
    insertRegistration: InsertBusinessRegistration,
  ): Promise<BusinessRegistration> {
    const id = this.currentRegistrationId++;
    const registration: BusinessRegistration = {
      ...insertRegistration,
      id,
      instagram: insertRegistration.instagram || null,
      facebook: insertRegistration.facebook || null,
      contactEmail: insertRegistration.contactEmail || null,
      imageUrl: insertRegistration.imageUrl || null,
      processed: false,
    };
    this.businessRegistrations.set(id, registration);
    return registration;
  }

  async getBusinessRegistrations(): Promise<BusinessRegistration[]> {
    return Array.from(this.businessRegistrations.values());
  }

  async updateBusinessRegistration(
    id: number,
    registration: Partial<InsertBusinessRegistration>,
  ): Promise<BusinessRegistration> {
    const existing = this.businessRegistrations.get(id);
    if (!existing) throw new Error("Registration not found");
    const updated = { ...existing, ...registration };
    this.businessRegistrations.set(id, updated);
    return updated;
  }

  async deleteBusinessRegistration(id: number): Promise<void> {
    this.businessRegistrations.delete(id);
  }

  async getBanners(): Promise<Banner[]> {
    return Array.from(this.banners.values())
      .filter((b) => b.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const id = this.currentBannerId++;
    const newBanner: Banner = {
      ...banner,
      id,
      subtitle: banner.subtitle || null,
      imageUrl: banner.imageUrl || null,
      ctaText: banner.ctaText || null,
      ctaLink: banner.ctaLink || null,
      active: banner.active !== false,
      order: banner.order || 0,
      createdAt: new Date(),
    };
    this.banners.set(id, newBanner);
    return newBanner;
  }

  async updateBanner(
    id: number,
    banner: Partial<InsertBanner>,
  ): Promise<Banner> {
    const existing = this.banners.get(id);
    if (!existing) throw new Error("Banner not found");
    const updated = { ...existing, ...banner };
    this.banners.set(id, updated);
    return updated;
  }

  async deleteBanner(id: number): Promise<void> {
    this.banners.delete(id);
  }

  async getSiteSettings(): Promise<SiteSetting> {
    const setting = this.settings.get("main");
    if (!setting) {
      throw new Error("Site settings not found");
    }
    return setting;
  }

  async updateSiteSettings(
    settings: Partial<InsertSiteSetting>,
  ): Promise<SiteSetting> {
    const existing = this.settings.get("main");
    if (!existing) {
      throw new Error("Site settings not found");
    }
    const updated = {
      ...existing,
      ...settings,
      updatedAt: new Date(),
    };
    this.settings.set("main", updated);
    return updated;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return Array.from(this.testimonials.values()).filter((t) => t.active);
  }

  async createTestimonial(
    testimonial: InsertTestimonial,
  ): Promise<Testimonial> {
    const id = this.currentTestimonialId++;
    const newTestimonial: Testimonial = {
      ...testimonial,
      id,
      company: testimonial.company || null,
      imageUrl: testimonial.imageUrl || null,
      rating: testimonial.rating || 5,
      active: testimonial.active !== false,
      createdAt: new Date(),
    };
    this.testimonials.set(id, newTestimonial);
    return newTestimonial;
  }

  async updateTestimonial(
    id: number,
    testimonial: Partial<InsertTestimonial>,
  ): Promise<Testimonial> {
    const existing = this.testimonials.get(id);
    if (!existing) throw new Error("Testimonial not found");
    const updated = { ...existing, ...testimonial };
    this.testimonials.set(id, updated);
    return updated;
  }

  async deleteTestimonial(id: number): Promise<void> {
    this.testimonials.delete(id);
  }

  async getFaqs(): Promise<Faq[]> {
    return Array.from(this.faqs.values())
      .filter((f) => f.active)
      .sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const id = this.currentFaqId++;
    const newFaq: Faq = {
      ...faq,
      id,
      order: faq.order || 0,
      active: faq.active !== false,
      createdAt: new Date(),
    };
    this.faqs.set(id, newFaq);
    return newFaq;
  }

  async updateFaq(id: number, faq: Partial<InsertFaq>): Promise<Faq> {
    const existing = this.faqs.get(id);
    if (!existing) throw new Error("FAQ not found");
    const updated = { ...existing, ...faq };
    this.faqs.set(id, updated);
    return updated;
  }

  async deleteFaq(id: number): Promise<void> {
    this.faqs.delete(id);
  }

  async getPromotions(): Promise<Promotion[]> {
    return Array.from(this.promotions.values()).filter((p) => p.active);
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const id = this.currentPromotionId++;
    const newPromotion: Promotion = {
      ...promotion,
      id,
      description: promotion.description || null,
      businessId: promotion.businessId || null,
      discountPercent: promotion.discountPercent || null,
      validUntil: promotion.validUntil || null,
      active: promotion.active !== false,
      createdAt: new Date(),
    };
    this.promotions.set(id, newPromotion);
    return newPromotion;
  }

  async updatePromotion(
    id: number,
    promotion: Partial<InsertPromotion>,
  ): Promise<Promotion> {
    const existing = this.promotions.get(id);
    if (!existing) throw new Error("Promotion not found");
    const updated = { ...existing, ...promotion };
    this.promotions.set(id, updated);
    return updated;
  }

  async deletePromotion(id: number): Promise<void> {
    this.promotions.delete(id);
  }

  async logAdminAction(
    action: string,
    tableName?: string,
    recordId?: number,
    oldValues?: any,
    newValues?: any,
  ): Promise<void> {
    const id = this.currentLogId++;
    const log: AdminLog = {
      id,
      action,
      tableName: tableName || null,
      recordId: recordId || null,
      oldValues,
      newValues,
      userAgent: "admin-panel",
      ipAddress: "127.0.0.1",
      createdAt: new Date(),
    };
    this.logs.set(id, log);
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    return Array.from(this.logs.values())
      .sort(
        (a, b) =>
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime(),
      )
      .slice(0, 100);
  }

  async trackAnalytics(data: InsertAnalytics): Promise<void> {
    const id = this.currentAnalyticsId++;
    const analytics: Analytics = {
      ...data,
      id,
      userAgent: data.userAgent || null,
      ipAddress: data.ipAddress || null,
      referrer: data.referrer || null,
      visitedAt: new Date(),
    };
    this.analytics.set(id, analytics);
  }

  async getAnalytics(): Promise<Analytics[]> {
    return Array.from(this.analytics.values())
      .sort(
        (a, b) =>
          new Date(b.visitedAt!).getTime() - new Date(a.visitedAt!).getTime(),
      )
      .slice(0, 1000);
  }

  async getNews(): Promise<News[]> {
    return Array.from(this.newsItems.values())
      .filter((news) => news.active)
      .sort((a, b) => {
        if (a.order !== b.order) {
          return (b.order || 0) - (a.order || 0);
        }
        return (
          new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
        );
      });
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const id = this.currentNewsId++;
    const news: News = {
      ...newsItem,
      id,
      description: newsItem.description || null,
      imageUrl: newsItem.imageUrl || null,
      publishedAt: newsItem.publishedAt || null,
      createdAt: new Date(),
      active: newsItem.active !== false,
      order: newsItem.order || 0,
    };
    this.newsItems.set(id, news);
    return news;
  }

  async updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News> {
    const existing = this.newsItems.get(id);
    if (!existing) {
      throw new Error(`News item with id ${id} not found`);
    }
    const updated: News = { ...existing, ...newsItem };
    this.newsItems.set(id, updated);
    return updated;
  }

  async deleteNews(id: number): Promise<void> {
    if (!this.newsItems.has(id)) {
      throw new Error(`News item with id ${id} not found`);
    }
    this.newsItems.delete(id);
  }
}

// DatabaseStorage implementation using PostgreSQL
export class DatabaseStorage implements IStorage {
  // Categories
  async getCategories(): Promise<Category[]> {
    return await db
      .select()
      .from(categories)
      .where(eq(categories.active, true))
      .orderBy(asc(categories.name));
  }

  async getCategoryBySlug(slug: string): Promise<Category | undefined> {
    const result = await db
      .select()
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    return result[0];
  }

  async createCategory(category: InsertCategory): Promise<Category> {
    const categoryData = {
      name: category.name,
      slug: category.slug,
      icon: category.icon || "circle",
      color: category.color || "#006C84",
      backgroundImage: category.backgroundImage || null,
      active: category.active !== false,
    };
    const result = await db.insert(categories).values(categoryData).returning();
    return result[0];
  }

  async updateCategory(
    id: number,
    category: Partial<InsertCategory>,
  ): Promise<Category> {
    const result = await db
      .update(categories)
      .set(category)
      .where(eq(categories.id, id))
      .returning();
    if (!result[0]) throw new Error(`Category with id ${id} not found`);
    return result[0];
  }

  async deleteCategory(id: number): Promise<void> {
    await db.delete(categories).where(eq(categories.id, id));
  }

  // Businesses
  async getBusinesses(): Promise<Business[]> {
    return await db.select().from(businesses).orderBy(desc(businesses.id));
  }

  async getBusinessesByCategory(categoryId: number): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .where(
        and(eq(businesses.categoryId, categoryId), eq(businesses.active, true)),
      )
      .orderBy(desc(businesses.featured), desc(businesses.id));
  }

  async getFeaturedBusinesses(): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .where(and(eq(businesses.featured, true), eq(businesses.active, true)))
      .orderBy(desc(businesses.id))
      .limit(6);
  }

  async getBusiness(id: number): Promise<Business | undefined> {
    const result = await db
      .select()
      .from(businesses)
      .where(eq(businesses.id, id))
      .limit(1);
    return result[0];
  }

  async createBusiness(business: InsertBusiness): Promise<Business> {
    const result = await db.insert(businesses).values(business).returning();
    return result[0];
  }

  async updateBusiness(
    id: number,
    business: Partial<InsertBusiness>,
  ): Promise<Business> {
    const result = await db
      .update(businesses)
      .set(business)
      .where(eq(businesses.id, id))
      .returning();
    if (!result[0]) throw new Error(`Business with id ${id} not found`);
    return result[0];
  }

  async deleteBusiness(id: number): Promise<void> {
    await db.delete(businesses).where(eq(businesses.id, id));
  }

  async searchBusinesses(query: string): Promise<Business[]> {
    return await db
      .select()
      .from(businesses)
      .where(
        and(
          sql`(${businesses.name} ILIKE ${`%${query}%`} OR ${businesses.description} ILIKE ${`%${query}%`})`,
          eq(businesses.active, true),
        ),
      )
      .orderBy(desc(businesses.featured), desc(businesses.id));
  }

  // Business Registrations
  async createBusinessRegistration(
    registration: InsertBusinessRegistration,
  ): Promise<BusinessRegistration> {
    const result = await db
      .insert(businessRegistrations)
      .values(registration)
      .returning();
    return result[0];
  }

  async getBusinessRegistrations(): Promise<BusinessRegistration[]> {
    return await db
      .select()
      .from(businessRegistrations)
      .orderBy(desc(businessRegistrations.id));
  }

  async updateBusinessRegistration(
    id: number,
    registration: Partial<InsertBusinessRegistration>,
  ): Promise<BusinessRegistration> {
    const result = await db
      .update(businessRegistrations)
      .set(registration)
      .where(eq(businessRegistrations.id, id))
      .returning();
    if (!result[0]) throw new Error(`Registration with id ${id} not found`);
    return result[0];
  }

  async deleteBusinessRegistration(id: number): Promise<void> {
    await db
      .delete(businessRegistrations)
      .where(eq(businessRegistrations.id, id));
  }

  // Admin Panel Methods
  async getBanners(): Promise<Banner[]> {
    return await db
      .select()
      .from(banners)
      .where(eq(banners.active, true))
      .orderBy(desc(banners.order));
  }

  async createBanner(banner: InsertBanner): Promise<Banner> {
    const result = await db.insert(banners).values(banner).returning();
    return result[0];
  }

  async updateBanner(
    id: number,
    banner: Partial<InsertBanner>,
  ): Promise<Banner> {
    const result = await db
      .update(banners)
      .set(banner)
      .where(eq(banners.id, id))
      .returning();
    if (!result[0]) throw new Error(`Banner with id ${id} not found`);
    return result[0];
  }

  async deleteBanner(id: number): Promise<void> {
    await db.delete(banners).where(eq(banners.id, id));
  }

  async getSiteSettings(): Promise<SiteSetting> {
    const result = await db.select().from(siteSettings).limit(1);
    if (result[0]) {
      return result[0];
    }

    // Create default settings if none exist
    const defaultSettings = {
      siteName: "Rota Caiçara",
      locality: "São Sebastião",
      tagline1: "Descubra os melhores negócios da sua região",
      description: "Conectando você aos negócios locais",
      phone: "(12) 99999-0000",
      email: "contato@rotacaicara.com.br",
      address: "São Sebastião, SP",
      faq1Question: "Como funciona o cadastro?",
      faq1Answer:
        "É simples e gratuito. Basta preencher o formulário com os dados do seu negócio.",
      faq2Question: "Quanto custa para anunciar?",
      faq2Answer:
        "O cadastro básico é gratuito. Temos planos premium com recursos adicionais.",
      faq3Question: "Como edito meu anúncio?",
      faq3Answer:
        "Entre em contato conosco através do WhatsApp ou email para alterações.",
      faq4Question: "Posso ter mais de um negócio cadastrado?",
      faq4Answer:
        "Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário.",
    };

    const created = await db
      .insert(siteSettings)
      .values(defaultSettings)
      .returning();
    return created[0];
  }

  // Substitua o método inteiro abaixo:
  async updateSiteSettings(
    settingsUpdate: Partial<InsertSiteSetting>,
  ): Promise<SiteSetting> {
    // Busca a configuração existente
    const [existing] = await db.select().from(siteSettings).limit(1);

    if (existing) {
      // Atualiza todos os campos passados e seta updatedAt
      const [updated] = await db
        .update(siteSettings)
        .set({ ...settingsUpdate, updatedAt: new Date() })
        .where(eq(siteSettings.id, existing.id))
        .returning();
      return updated;
    } else {
      // Se não existir, insere um novo registro
      const [created] = await db
        .insert(siteSettings)
        .values(settingsUpdate)
        .returning();
      return created;
    }
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.active, true))
      .orderBy(desc(testimonials.createdAt));
  }

  async createTestimonial(
    testimonial: InsertTestimonial,
  ): Promise<Testimonial> {
    const result = await db
      .insert(testimonials)
      .values(testimonial)
      .returning();
    return result[0];
  }

  async updateTestimonial(
    id: number,
    testimonial: Partial<InsertTestimonial>,
  ): Promise<Testimonial> {
    const result = await db
      .update(testimonials)
      .set(testimonial)
      .where(eq(testimonials.id, id))
      .returning();
    if (!result[0]) throw new Error(`Testimonial with id ${id} not found`);
    return result[0];
  }

  async deleteTestimonial(id: number): Promise<void> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
  }

  async getFaqs(): Promise<Faq[]> {
    return await db
      .select()
      .from(faqs)
      .where(eq(faqs.active, true))
      .orderBy(asc(faqs.order));
  }

  async createFaq(faq: InsertFaq): Promise<Faq> {
    const result = await db.insert(faqs).values(faq).returning();
    return result[0];
  }

  async updateFaq(id: number, faq: Partial<InsertFaq>): Promise<Faq> {
    const result = await db
      .update(faqs)
      .set(faq)
      .where(eq(faqs.id, id))
      .returning();
    if (!result[0]) throw new Error(`FAQ with id ${id} not found`);
    return result[0];
  }

  async deleteFaq(id: number): Promise<void> {
    await db.delete(faqs).where(eq(faqs.id, id));
  }

  async getPromotions(): Promise<Promotion[]> {
    return await db
      .select()
      .from(promotions)
      .where(eq(promotions.active, true))
      .orderBy(desc(promotions.createdAt));
  }

  async createPromotion(promotion: InsertPromotion): Promise<Promotion> {
    const result = await db.insert(promotions).values(promotion).returning();
    return result[0];
  }

  async updatePromotion(
    id: number,
    promotion: Partial<InsertPromotion>,
  ): Promise<Promotion> {
    const result = await db
      .update(promotions)
      .set(promotion)
      .where(eq(promotions.id, id))
      .returning();
    if (!result[0]) throw new Error(`Promotion with id ${id} not found`);
    return result[0];
  }

  async deletePromotion(id: number): Promise<void> {
    await db.delete(promotions).where(eq(promotions.id, id));
  }

  async getNews(): Promise<News[]> {
    return await db
      .select()
      .from(news)
      .where(eq(news.active, true))
      .orderBy(desc(news.order), desc(news.createdAt));
  }

  async createNews(newsItem: InsertNews): Promise<News> {
    const result = await db.insert(news).values(newsItem).returning();
    return result[0];
  }

  async updateNews(id: number, newsItem: Partial<InsertNews>): Promise<News> {
    const result = await db
      .update(news)
      .set(newsItem)
      .where(eq(news.id, id))
      .returning();
    if (!result[0]) throw new Error(`News item with id ${id} not found`);
    return result[0];
  }

  async deleteNews(id: number): Promise<void> {
    await db.delete(news).where(eq(news.id, id));
  }

  async logAdminAction(
    action: string,
    tableName?: string,
    recordId?: number,
    oldValues?: any,
    newValues?: any,
  ): Promise<void> {
    await db.insert(adminLogs).values({
      action,
      tableName: tableName || null,
      recordId: recordId || null,
      oldValues: oldValues ? JSON.stringify(oldValues) : null,
      newValues: newValues ? JSON.stringify(newValues) : null,
    });
  }

  async getAdminLogs(): Promise<AdminLog[]> {
    return await db
      .select()
      .from(adminLogs)
      .orderBy(desc(adminLogs.createdAt))
      .limit(100);
  }

  async trackAnalytics(data: InsertAnalytics): Promise<void> {
    await db.insert(analytics).values(data);
  }

  async getAnalytics(): Promise<Analytics[]> {
    return await db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.visitedAt))
      .limit(1000);
  }
}

// Seed the database with initial data
async function seedDatabase() {
  try {
    // Check if categories already exist
    const existingCategories = await db.select().from(categories).limit(1);
    if (existingCategories.length > 0) {
      console.log("Database already seeded");
      return;
    }

    console.log("Seeding database...");

    // Insert categories
    const categoryData = [
      {
        name: "PARA SUA REFEIÇÃO",
        slug: "para-sua-refeicao",
        description:
          "Restaurantes, lanchonetes, padarias e estabelecimentos gastronômicos",
        icon: "utensils",
        color: "#FF6B6B",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA CASA",
        slug: "para-sua-casa",
        description: "Móveis, decoração, construção e itens para o lar",
        icon: "home",
        color: "#4ECDC4",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SUA SAÚDE",
        slug: "para-sua-saude",
        description: "Farmácias, clínicas, academias e serviços de bem-estar",
        icon: "heart",
        color: "#45B7D1",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU ESTILO",
        slug: "para-seu-estilo",
        description: "Moda, beleza, salões e acessórios",
        icon: "shirt",
        color: "#96CEB4",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEU TRANSPORTE",
        slug: "para-seu-transporte",
        description: "Oficinas, postos, concessionárias e serviços automotivos",
        icon: "car",
        color: "#FFEAA7",
        backgroundImage: null,
        active: true,
      },
      {
        name: "PARA SEUS SERVIÇOS",
        slug: "para-seus-servicos",
        description:
          "Serviços profissionais, consultoria e assistência técnica",
        icon: "briefcase",
        color: "#DDA0DD",
        backgroundImage: null,
        active: true,
      },
    ];

    const insertedCategories = await db
      .insert(categories)
      .values(categoryData)
      .returning();

    // Insert sample businesses
    const businessData = [
      {
        name: "Horta Orgânica São Sebastião",
        description:
          "Produzimos verduras e legumes 100% orgânicos, sem agrotóxicos. Entrega em domicílio na região.",
        phone: "(12) 99999-1234",
        whatsapp: "5512999991234",
        address: "Rua das Flores, 123 - Centro, São Sebastião",
        email: "contato@hortaorganica.com.br",
        website: "",
        instagram: "hortaorganicass",
        facebook: "hortaorganicasaosebastiao",
        categoryId: insertedCategories[0].id,
        imageUrl:
          "https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400",
        featured: true,
        certified: true,
        active: true,
      },
      {
        name: "Móveis Rusticos Litoral",
        description:
          "Móveis artesanais em madeira de demolição. Peças únicas para sua casa praia.",
        phone: "(12) 98888-5678",
        whatsapp: "5512988885678",
        address: "Av. Beira Mar, 456 - Praia Grande, São Sebastião",
        email: "contato@moveisrusticos.com.br",
        website: "www.moveisrusticoslitoral.com.br",
        instagram: "moveisrusticoslitoral",
        facebook: "",
        categoryId: insertedCategories[1].id,
        imageUrl:
          "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400",
        featured: true,
        certified: false,
        active: true,
      },
    ];

    await db.insert(businesses).values(businessData);

    // Insert default site settings
    const defaultSettings = {
      siteName: "Rota Caiçara",
      locality: "São Sebastião",
      tagline1: "Descubra os melhores negócios da sua região",
      description: "Conectando você aos negócios locais",
      phone: "(12) 99999-0000",
      email: "contato@rotacaicara.com.br",
      address: "São Sebastião, SP",
      faq1Question: "Como funciona o cadastro?",
      faq1Answer:
        "É simples e gratuito. Basta preencher o formulário com os dados do seu negócio.",
      faq2Question: "Quanto custa para anunciar?",
      faq2Answer:
        "O cadastro básico é gratuito. Temos planos premium com recursos adicionais.",
      faq3Question: "Como edito meu anúncio?",
      faq3Answer:
        "Entre em contato conosco através do WhatsApp ou email para alterações.",
      faq4Question: "Posso ter mais de um negócio cadastrado?",
      faq4Answer:
        "Sim, você pode cadastrar múltiplos negócios usando o mesmo formulário.",
    };

    await db.insert(siteSettings).values(defaultSettings);

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}

// Use DatabaseStorage instead of MemStorage
export const storage = new DatabaseStorage();

// Initialize database with seed data - make it optional to not break deployment
(async () => {
  try {
    await seedDatabase();
  } catch (error) {
    console.log("Database seeding skipped - database may not be available yet:", error.message);
  }
})();
