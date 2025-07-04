import { db } from "./db";
import { categories, businesses } from "@shared/schema";

export async function seedDatabase() {
  try {
    // Check if data already exists
    const existingCategories = await db.select().from(categories);
    if (existingCategories.length > 0) {
      console.log("Database already seeded");
      return;
    }

    // Seed categories - All 14 Rota Caiçara categories
    const categoryData = [
      { name: "PARA SUA REFEIÇÃO", slug: "para-sua-refeicao", icon: "🍽️", color: "#006C84", active: true },
      { name: "PARA SUA CASA", slug: "para-sua-casa", icon: "🏠", color: "#006C84", active: true },
      { name: "PARA SUA EMPRESA", slug: "para-sua-empresa", icon: "🏭", color: "#006C84", active: true },
      { name: "PARA SUA SAÚDE", slug: "para-sua-saude", icon: "💚", color: "#006C84", active: true },
      { name: "PARA SEU AUTOMÓVEL", slug: "para-seu-automovel", icon: "🚗", color: "#006C84", active: true },
      { name: "PARA SUA BELEZA", slug: "para-sua-beleza", icon: "💄", color: "#006C84", active: true },
      { name: "PARA SEU BEBÊ", slug: "para-seu-bebe", icon: "👶", color: "#006C84", active: true },
      { name: "PARA SEU PET", slug: "para-seu-pet", icon: "🐕", color: "#006C84", active: true },
      { name: "PARA SUA EDUCAÇÃO", slug: "para-sua-educacao", icon: "✏️", color: "#006C84", active: true },
      { name: "PARA SEU CORPO", slug: "para-seu-corpo", icon: "🏋️", color: "#006C84", active: true },
      { name: "PARA SUA FESTA", slug: "para-sua-festa", icon: "🎂", color: "#006C84", active: true },
      { name: "PARA SUA VIAGEM", slug: "para-sua-viagem", icon: "🏖️", color: "#006C84", active: true },
      { name: "ASSISTÊNCIA TÉCNICA", slug: "assistencia-tecnica", icon: "🔧", color: "#006C84", active: true },
      { name: "NOVIDADES NA CIDADE", slug: "novidades-na-cidade", icon: "⭐", color: "#006C84", active: true }
    ];

    const insertedCategories = await db.insert(categories).values(categoryData).returning();
    console.log(`Inserted ${insertedCategories.length} categories`);

    // Seed businesses
    const businessData = [
      {
        name: "Restaurante do Caiçara",
        description: "Especialidades em frutos do mar e pratos típicos da região. Ambiente familiar com vista para o mar.",
        phone: "(12) 99999-1234",
        whatsapp: "5512999991234",
        address: "Rua das Flores, 123 - Centro, São Sebastião",
        email: "contato@restaurantecaicara.com.br",
        website: null,
        instagram: "restaurantecaicara",
        facebook: "restaurantecaicarass",
        journalLink: "",
        categoryId: insertedCategories[0].id,
        imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400",
        featured: true,
        certified: true,
        active: true
      },
      {
        name: "Casa & Construção São Sebastião",
        description: "Material de construção, ferramentas e acabamentos para sua casa dos sonhos.",
        phone: "(12) 99999-5678",
        whatsapp: "5512999995678",
        address: "Av. Atlântica, 456 - Praia Grande, São Sebastião",
        email: "contato@casaconstrucao.com.br",
        website: null,
        instagram: "casaconstrucaoss",
        facebook: null,
        journalLink: "",
        categoryId: insertedCategories[1].id,
        imageUrl: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=400",
        featured: true,
        certified: true,
        active: true
      },
      {
        name: "Consultoria Empresarial Litoral",
        description: "Consultoria em gestão, marketing digital e desenvolvimento empresarial para negócios locais.",
        phone: "(12) 99999-9012",
        whatsapp: "5512999999012",
        address: "Rua do Comércio, 789 - Centro Histórico, São Sebastião",
        email: null,
        website: null,
        instagram: "consultorialitoral",
        facebook: "consultorialitoral",
        journalLink: "",
        categoryId: insertedCategories[2].id,
        imageUrl: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400",
        featured: false,
        certified: true,
        active: true
      },
      {
        name: "Clínica de Saúde Integrada",
        description: "Atendimento médico completo com especialistas em medicina preventiva e tratamentos naturais.",
        phone: "(12) 99999-3456",
        whatsapp: "5512999993456",
        address: "Estrada da Balsa, 321 - Bertioga, São Sebastião",
        email: "contato@clinicasaude.com.br",
        website: null,
        instagram: null,
        facebook: null,
        journalLink: "",
        categoryId: insertedCategories[3].id,
        imageUrl: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=400",
        featured: false,
        certified: false,
        active: true
      },
      {
        name: "Auto Peças e Serviços",
        description: "Peças automotivas, manutenção e serviços especializados para todos os tipos de veículos.",
        phone: "(12) 99999-7890",
        whatsapp: "5512999997890",
        address: "Rua da Natureza, 654 - Maresias, São Sebastião",
        email: "autopecas@litoral.com.br",
        website: null,
        instagram: "autopecaslitoral",
        facebook: null,
        journalLink: "",
        categoryId: insertedCategories[4].id,
        imageUrl: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?w=400",
        featured: true,
        certified: true,
        active: true
      },
      {
        name: "Estética e Beleza Maresias",
        description: "Tratamentos estéticos, massagens relaxantes e cuidados com a beleza em ambiente tranquilo.",
        phone: "(12) 99999-2468",
        whatsapp: "5512999992468",
        address: "Av. Beira Mar, 987 - Juquehy, São Sebastião",
        email: null,
        website: null,
        instagram: "esteticamaresias",
        facebook: null,
        journalLink: "",
        categoryId: insertedCategories[5].id,
        imageUrl: "https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400",
        featured: false,
        certified: true,
        active: true
      }
    ];

    const insertedBusinesses = await db.insert(businesses).values(businessData).returning();
    console.log(`Inserted ${insertedBusinesses.length} businesses`);
    
    console.log("Database seeded successfully");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
}