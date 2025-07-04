import { Card, CardContent } from "@/components/ui/card";
import type { Category } from "@shared/schema";
import { 
  UtensilsCrossed, 
  Home, 
  Building2, 
  Heart, 
  Car, 
  Sparkles, 
  Baby, 
  PawPrint, 
  GraduationCap, 
  Dumbbell, 
  PartyPopper, 
  Plane, 
  Theater, 
  Star,
  Wrench 
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
  onClick: () => void;
}

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  const hasBackgroundImage = category.backgroundImage;

  const getCategoryIcon = (categoryName: string) => {
    const name = categoryName.toLowerCase();
    if (name.includes('refeição') || name.includes('refeicao')) return UtensilsCrossed;
    if (name.includes('casa')) return Home;
    if (name.includes('empresa')) return Building2;
    if (name.includes('saúde') || name.includes('saude')) return Heart;
    if (name.includes('automóvel') || name.includes('automovel')) return Car;
    if (name.includes('beleza')) return Sparkles;
    if (name.includes('bebê') || name.includes('bebe')) return Baby;
    if (name.includes('pet')) return PawPrint;
    if (name.includes('educação') || name.includes('educacao')) return GraduationCap;
    if (name.includes('corpo')) return Dumbbell;
    if (name.includes('festa')) return PartyPopper;
    if (name.includes('viagem')) return Plane;
    if (name.includes('diversão') || name.includes('diversao')) return Theater;
    if (name.includes('assistência') || name.includes('assistencia') || name.includes('técnica') || name.includes('tecnica')) return Wrench;
    if (name.includes('novidades')) return Star;
    return Star; // Default icon
  };

  const IconComponent = getCategoryIcon(category.name);

  return (
    <Card 
      className="bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl hover:scale-[1.02] cursor-pointer w-full"
      onClick={onClick}
    >
      <CardContent className="p-6 flex flex-col items-center">
        <div aria-label={`Categoria ${category.name}`} className="mb-4">
          <IconComponent 
            className="w-16 h-16 text-[#006C84] transition-transform duration-300 hover:scale-110"
          />
        </div>
        
        <h4 className="text-gray-800 text-base font-medium text-center leading-tight uppercase">
          {category.name}
        </h4>
      </CardContent>
    </Card>
  );
}