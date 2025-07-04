import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";
import { Search, X } from "lucide-react";
import * as LucideIcons from "lucide-react";

// Common icon names that are frequently used
const commonIcons = [
  "Store", "Utensils", "Car", "Home", "Heart", "Star", "Phone", "Mail",
  "MapPin", "Clock", "Users", "Settings", "Camera", "Music", "Book",
  "Briefcase", "Coffee", "ShoppingBag", "Palette", "Wrench", "Scissors",
  "Truck", "Building", "Leaf", "Shield", "Award", "Target", "Zap",
  "Globe", "Smartphone", "Laptop", "Headphones", "Gift", "Flower"
];

interface IconSelectorProps {
  value?: string;
  onChange: (iconName: string) => void;
  label?: string;
}

export default function IconSelector({ value, onChange, label }: IconSelectorProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");

  const filteredIcons = commonIcons.filter(iconName =>
    iconName.toLowerCase().includes(search.toLowerCase())
  );

  const handleIconSelect = (iconName: string) => {
    onChange(iconName);
    setOpen(false);
  };

  const clearSelection = () => {
    onChange("");
  };

  const renderIcon = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    if (!IconComponent) return null;
    return <IconComponent className="w-5 h-5" />;
  };

  return (
    <div className="space-y-2">
      {label && <label className="text-sm font-medium">{label}</label>}
      
      <div className="flex items-center gap-2">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className="justify-start h-10 px-3"
              onClick={() => setOpen(true)}
            >
              {value ? (
                <div className="flex items-center gap-2">
                  {renderIcon(value)}
                  <span>{value}</span>
                </div>
              ) : (
                <span className="text-muted-foreground">Selecionar ícone...</span>
              )}
            </Button>
          </PopoverTrigger>
          
          <PopoverContent className="w-80 p-0" align="start">
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar ícones..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            
            <div className="p-3 max-h-60 overflow-y-auto">
              <div className="grid grid-cols-4 gap-2">
                {filteredIcons.map((iconName) => (
                  <Button
                    key={iconName}
                    variant={value === iconName ? "default" : "ghost"}
                    size="sm"
                    className="flex flex-col items-center gap-1 h-auto p-2"
                    onClick={() => handleIconSelect(iconName)}
                  >
                    {renderIcon(iconName)}
                    <span className="text-xs truncate w-full">{iconName}</span>
                  </Button>
                ))}
              </div>
              
              {filteredIcons.length === 0 && (
                <div className="text-center text-muted-foreground py-4">
                  Nenhum ícone encontrado
                </div>
              )}
            </div>
          </PopoverContent>
        </Popover>
        
        {value && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearSelection}
            className="h-10 px-2"
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
      
      {value && (
        <Badge variant="secondary" className="flex items-center gap-1 w-fit">
          {renderIcon(value)}
          {value}
        </Badge>
      )}
    </div>
  );
}