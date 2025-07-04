import { apiRequest } from "./queryClient";
import type { Category, Business, BusinessRegistration, InsertBusinessRegistration, News } from "@shared/schema";

export const api = {
  // Categories
  getCategories: async (): Promise<Category[]> => {
    const response = await apiRequest("GET", "/api/categories");
    return response.json();
  },

  getCategoryBySlug: async (slug: string): Promise<Category> => {
    const response = await apiRequest("GET", `/api/categories/${slug}`);
    return response.json();
  },

  // Businesses
  getBusinesses: async (): Promise<Business[]> => {
    const response = await apiRequest("GET", "/api/businesses");
    return response.json();
  },

  getBusinessesByCategory: async (categoryId: number): Promise<Business[]> => {
    const response = await apiRequest("GET", `/api/businesses/category/${categoryId}`);
    return response.json();
  },

  getFeaturedBusinesses: async (): Promise<Business[]> => {
    const response = await apiRequest("GET", "/api/businesses/featured");
    return response.json();
  },

  searchBusinesses: async (query: string): Promise<Business[]> => {
    const response = await apiRequest("GET", `/api/businesses/search?q=${encodeURIComponent(query)}`);
    return response.json();
  },

  // Business Registration
  createBusinessRegistration: async (data: InsertBusinessRegistration): Promise<BusinessRegistration> => {
    const response = await apiRequest("POST", "/api/business-registrations", data);
    return response.json();
  },

  // News
  getNews: async (): Promise<News[]> => {
    const response = await apiRequest("GET", "/api/news");
    return response.json();
  },
};
