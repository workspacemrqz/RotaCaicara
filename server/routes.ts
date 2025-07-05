import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import path from "path";
import { 
  insertBusinessRegistrationSchema,
  insertBusinessSchema,
  insertBannerSchema,
  insertSiteSettingSchema,
  insertTestimonialSchema,
  insertFaqSchema,
  insertPromotionSchema,
  insertNewsSchema,
  insertCategorySchema
} from "@shared/schema";
import { z } from "zod";

// Configure multer for file uploads
const upload = multer({
  storage: multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // File upload endpoint
  app.post("/api/upload", upload.single('file'), (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      // Return the URL path for the uploaded file
      const url = `/uploads/${req.file.filename}`;
      res.json({ url });
    } catch (error) {
      console.error('Upload error:', error);
      res.status(500).json({ error: 'Failed to upload file' });
    }
  });

  // Serve uploaded files statically
  app.use('/uploads', (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

  // Get all categories
  app.get("/api/categories", async (req, res) => {
    try {
      const categories = await storage.getCategories();
      console.log("Categories returned:", categories.map(c => ({ name: c.name, slug: c.slug })));
      res.json(categories);
    } catch (error) {
      console.error("Error fetching categories:", error);
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  });

  // Get category by slug
  app.get("/api/categories/:slug", async (req, res) => {
    try {
      const { slug } = req.params;
      const category = await storage.getCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get all businesses
  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getBusinesses();
      console.log(`Fetched ${businesses.length} businesses from database`);
      res.json(businesses);
    } catch (error) {
      console.error("Error fetching businesses:", error);
      res.status(500).json({ message: "Failed to fetch businesses", error: error instanceof Error ? error.message : "Unknown error" });
    }
  });

  // Get businesses by category
  app.get("/api/businesses/category/:categoryId", async (req, res) => {
    try {
      const categoryId = parseInt(req.params.categoryId);
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID" });
      }
      const businesses = await storage.getBusinessesByCategory(categoryId);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch businesses by category" });
    }
  });

  // Get businesses by category slug for category page
  app.get("/api/categories/:slug/businesses", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const businesses = await storage.getBusinessesByCategory(category.id);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category businesses" });
    }
  });

  // Get featured businesses
  app.get("/api/businesses/featured", async (req, res) => {
    try {
      const businesses = await storage.getFeaturedBusinesses();
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch featured businesses" });
    }
  });

  // Get single business by ID
  app.get("/api/businesses/:id", async (req, res) => {
    try {
      const businessId = parseInt(req.params.id);
      if (isNaN(businessId)) {
        return res.status(400).json({ message: "Invalid business ID" });
      }
      const business = await storage.getBusiness(businessId);
      if (!business) {
        return res.status(404).json({ message: "Business not found" });
      }
      res.json(business);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business" });
    }
  });

  // Search businesses
  app.get("/api/businesses/search", async (req, res) => {
    try {
      const { q } = req.query;
      if (!q || typeof q !== "string") {
        return res.status(400).json({ message: "Search query is required" });
      }
      const businesses = await storage.searchBusinesses(q);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to search businesses" });
    }
  });

  // Create business (Admin Panel)
  app.post("/api/businesses", async (req, res) => {
    try {
      // Create a flexible schema for business creation that allows empty imageUrl
      const flexibleBusinessSchema = insertBusinessSchema.extend({
        imageUrl: z.string().optional().or(z.literal(""))
      });
      const validatedData = flexibleBusinessSchema.parse(req.body);
      const business = await storage.createBusiness(validatedData);
      res.status(201).json(business);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create business" });
    }
  });

  // Create business registration
  app.post("/api/business-registrations", async (req, res) => {
    try {
      const validatedData = insertBusinessRegistrationSchema.parse(req.body);
      const registration = await storage.createBusinessRegistration(validatedData);
      res.status(201).json(registration);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: error.errors 
        });
      }
      res.status(500).json({ message: "Failed to create business registration" });
    }
  });

  // Admin Panel Routes
  app.get("/api/admin/business-registrations", async (req, res) => {
    try {
      const registrations = await storage.getBusinessRegistrations();
      res.json(registrations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch business registrations" });
    }
  });

  app.get("/api/admin/banners", async (req, res) => {
    try {
      const banners = await storage.getBanners();
      res.json(banners);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", async (req, res) => {
    try {
      const validatedData = insertBannerSchema.parse(req.body);
      const banner = await storage.createBanner(validatedData);
      await storage.logAdminAction("CREATE", "banners", banner.id, null, validatedData);
      res.status(201).json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const banner = await storage.updateBanner(id, req.body);
      await storage.logAdminAction("UPDATE", "banners", id, null, req.body);
      res.json(banner);
    } catch (error) {
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/admin/banners/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBanner(id);
      await storage.logAdminAction("DELETE", "banners", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });

  app.get("/api/admin/settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.put("/api/admin/settings", async (req, res) => {
    try {
      const validatedData = insertSiteSettingSchema.parse(req.body);
      const settings = await storage.updateSiteSettings(validatedData);
      await storage.logAdminAction("UPDATE", "site_settings", settings.id, null, validatedData);
      res.json(settings);
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(500).json({ message: "Failed to update settings" });
    }
  });

  // Update business (PUT for admin panel)
  app.put("/api/admin/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const business = await storage.updateBusiness(id, req.body);
      await storage.logAdminAction("UPDATE", "businesses", id, null, req.body);
      res.json(business);
    } catch (error) {
      console.error("Failed to update business (PUT):", error);
      res.status(500).json({ message: "Failed to update business" });
    }
  });

  // Update business with Zod validation and proper logging
  app.patch("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertBusinessSchema.parse(req.body);
      console.log(`Updating business ${id} with data:`, validatedData);
      const updated = await storage.updateBusiness(id, validatedData);
      console.log(`Business ${id} updated successfully`);
      res.status(200).json(updated);
    } catch (error) {
      console.error(`Failed to update business ${req.params.id}:`, error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update business" });
    }
  });

  // Delete business route for frontend use
  app.delete("/api/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBusiness(id);
      console.log(`Business ${id} deleted successfully`);
      res.status(200).json({ success: true, message: "Business deleted successfully" });
    } catch (error) {
      console.error("Failed to delete business:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete business" });
    }
  });

  app.delete("/api/admin/businesses/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBusiness(id);
      await storage.logAdminAction("DELETE", "businesses", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete business" });
    }
  });

  app.put("/api/admin/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      await storage.logAdminAction("UPDATE", "categories", id, null, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      await storage.logAdminAction("DELETE", "categories", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  app.get("/api/admin/testimonials", async (req, res) => {
    try {
      const testimonials = await storage.getTestimonials();
      res.json(testimonials);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch testimonials" });
    }
  });

  app.post("/api/admin/testimonials", async (req, res) => {
    try {
      const validatedData = insertTestimonialSchema.parse(req.body);
      const testimonial = await storage.createTestimonial(validatedData);
      await storage.logAdminAction("CREATE", "testimonials", testimonial.id, null, validatedData);
      res.status(201).json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const testimonial = await storage.updateTestimonial(id, req.body);
      await storage.logAdminAction("UPDATE", "testimonials", id, null, req.body);
      res.json(testimonial);
    } catch (error) {
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteTestimonial(id);
      await storage.logAdminAction("DELETE", "testimonials", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  app.get("/api/admin/faqs", async (req, res) => {
    try {
      const faqs = await storage.getFaqs();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/admin/faqs", async (req, res) => {
    try {
      const validatedData = insertFaqSchema.parse(req.body);
      const faq = await storage.createFaq(validatedData);
      await storage.logAdminAction("CREATE", "faqs", faq.id, null, validatedData);
      res.status(201).json(faq);
    } catch (error) {
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });

  app.put("/api/admin/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const faq = await storage.updateFaq(id, req.body);
      await storage.logAdminAction("UPDATE", "faqs", id, null, req.body);
      res.json(faq);
    } catch (error) {
      res.status(500).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/admin/faqs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteFaq(id);
      await storage.logAdminAction("DELETE", "faqs", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  app.get("/api/admin/promotions", async (req, res) => {
    try {
      const promotions = await storage.getPromotions();
      res.json(promotions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch promotions" });
    }
  });

  app.post("/api/admin/promotions", async (req, res) => {
    try {
      const validatedData = insertPromotionSchema.parse(req.body);
      const promotion = await storage.createPromotion(validatedData);
      await storage.logAdminAction("CREATE", "promotions", promotion.id, null, validatedData);
      res.status(201).json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to create promotion" });
    }
  });

  app.put("/api/admin/promotions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const promotion = await storage.updatePromotion(id, req.body);
      await storage.logAdminAction("UPDATE", "promotions", id, null, req.body);
      res.json(promotion);
    } catch (error) {
      res.status(500).json({ message: "Failed to update promotion" });
    }
  });

  app.delete("/api/admin/promotions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deletePromotion(id);
      await storage.logAdminAction("DELETE", "promotions", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete promotion" });
    }
  });



  app.get("/api/admin/logs", async (req, res) => {
    try {
      const logs = await storage.getAdminLogs();
      res.json(logs);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch admin logs" });
    }
  });

  app.get("/api/admin/analytics", async (req, res) => {
    try {
      const analytics = await storage.getAnalytics();
      res.json(analytics);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // Business submission routes for "Anuncie sua Empresa" form
  app.post("/api/submissions", async (req, res) => {
    try {
      const validatedData = insertBusinessRegistrationSchema.parse(req.body);
      const submission = await storage.createBusinessRegistration(validatedData);
      console.log("New business submission created:", submission.id);
      res.status(201).json(submission);
    } catch (error) {
      console.error("Failed to create submission:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to create submission" });
    }
  });

  // Category-specific business listings
  app.get("/api/categories/:slug/businesses", async (req, res) => {
    try {
      const category = await storage.getCategoryBySlug(req.params.slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      const businesses = await storage.getBusinessesByCategory(category.id);
      res.json(businesses);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch category businesses" });
    }
  });

  // Individual submission management endpoints
  app.get("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const submissions = await storage.getBusinessRegistrations();
      const submission = submissions.find(s => s.id === id);
      if (!submission) {
        return res.status(404).json({ error: "Submission not found" });
      }
      res.json(submission);
    } catch (error) {
      console.error("Failed to fetch submission:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch submission" });
    }
  });

  app.patch("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);

      // Get current submission
      const submissions = await storage.getBusinessRegistrations();
      const currentSubmission = submissions.find(s => s.id === id);
      if (!currentSubmission) {
        return res.status(404).json({ error: "Submission not found" });
      }

      // For partial updates, merge with existing data
      const updateData = { ...currentSubmission, ...req.body };

      // Validate only if we're doing a full update (all required fields present)
      let validatedData;
      if (Object.keys(req.body).length > 2 || (req.body.businessName && req.body.categoryId)) {
        validatedData = insertBusinessRegistrationSchema.parse(updateData);
      } else {
        validatedData = req.body;
      }

      console.log(`Updating submission ${id}:`, validatedData);

      // Update the submission in storage
      const updated = await storage.updateBusinessRegistration(id, validatedData);

      // If status is being changed to approved, create business and delete registration
      if (req.body.status === 'approved' || req.body.processed === true) {
        const submission = updated || currentSubmission;
        const businessData = {
          name: submission.businessName,
          description: submission.description,
          categoryId: submission.categoryId,
          phone: submission.phone,
          whatsapp: submission.whatsapp,
          address: submission.address,
          instagram: submission.instagram || "",
          facebook: submission.facebook || "",
          email: submission.contactEmail || "",
          imageUrl: submission.imageUrl || "",
          featured: false,
          active: true
        };
        await storage.createBusiness(businessData);
        console.log(`Business created from submission ${id}`);

        // Delete the registration after creating the business
        await storage.deleteBusinessRegistration(id);
        console.log(`Registration ${id} deleted after publishing`);

        return res.json({ success: true, message: "Registration published and moved to businesses", deleted: true });
      }

      res.json({ success: true, message: "Submission updated successfully", data: updated });
    } catch (error) {
      console.error("Failed to update submission:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update submission" });
    }
  });

  app.delete("/api/admin/submissions/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBusinessRegistration(id);
      await storage.logAdminAction("DELETE", "business_registrations", id);
      console.log(`Deleted submission ${id}`);
      res.json({ success: true });
    } catch (error) {
      console.error("Failed to delete submission:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to delete submission" });
    }
  });

  // Business registration routes
  app.delete("/api/admin/business-registrations/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteBusinessRegistration(id);
      await storage.logAdminAction("DELETE", "business_registrations", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete business registration" });
    }
  });

  // Category management routes
  app.post("/api/categories", async (req, res) => {
    try {
      const validatedData = insertCategorySchema.parse(req.body);
      const category = await storage.createCategory(validatedData);
      await storage.logAdminAction("CREATE", "categories", category.id, null, validatedData);
      res.status(201).json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.patch("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const category = await storage.updateCategory(id, req.body);
      await storage.logAdminAction("UPDATE", "categories", id, null, req.body);
      res.json(category);
    } catch (error) {
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/categories/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      await storage.deleteCategory(id);
      await storage.logAdminAction("DELETE", "categories", id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // Get site settings
  app.get("/api/site-settings", async (req, res) => {
    try {
      const settings = await storage.getSiteSettings();
      res.json(settings);
    } catch (error) {
      console.error("Failed to fetch site settings:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to fetch settings" });
    }
  });

  // Settings management with sections
  app.patch("/api/settings/general", async (req, res) => {
    try {
      const setting = await storage.updateSiteSettings(req.body);
      console.log("General settings updated:", req.body);
      res.json(setting);
    } catch (error) {
      console.error("Failed to update general settings:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });

  app.patch("/api/settings/home", async (req, res) => {
    try {
      const setting = await storage.updateSiteSettings(req.body);
      console.log("Home settings updated:", req.body);
      res.json(setting);
    } catch (error) {
      console.error("Failed to update home settings:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });

  app.patch("/api/settings/announce", async (req, res) => {
    try {
      const setting = await storage.updateSiteSettings(req.body);
      console.log("Announce settings updated:", req.body);
      res.json(setting);
    } catch (error) {
      console.error("Failed to update announce settings:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });

  // Legacy settings endpoint
  app.patch("/api/settings/:section", async (req, res) => {
    try {
      const { section } = req.params;
      const setting = await storage.updateSiteSettings(req.body);
      console.log(`Settings updated for section: ${section}`);
      res.json(setting);
    } catch (error) {
      console.error("Failed to update settings:", error);
      res.status(500).json({ error: error instanceof Error ? error.message : "Failed to update settings" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}