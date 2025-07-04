import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

// 40 commerce SVG icons as requested
const commerceIcons = [
  { name: "store", svg: "🏪" },
  { name: "restaurant", svg: "🍽️" },
  { name: "coffee", svg: "☕" },
  { name: "shopping-bag", svg: "🛍️" },
  { name: "car", svg: "🚗" },
  { name: "home", svg: "🏠" },
  { name: "tools", svg: "🔧" },
  { name: "medical", svg: "⚕️" },
  { name: "education", svg: "📚" },
  { name: "beauty", svg: "💄" },
  { name: "fitness", svg: "💪" },
  { name: "music", svg: "🎵" },
  { name: "camera", svg: "📷" },
  { name: "gift", svg: "🎁" },
  { name: "flower", svg: "🌸" },
  { name: "pet", svg: "🐕" },
  { name: "tech", svg: "💻" },
  { name: "phone", svg: "📱" },
  { name: "clothing", svg: "👔" },
  { name: "shoes", svg: "👟" },
  { name: "jewelry", svg: "💎" },
  { name: "watch", svg: "⌚" },
  { name: "glasses", svg: "👓" },
  { name: "bag", svg: "👜" },
  { name: "pizza", svg: "🍕" },
  { name: "burger", svg: "🍔" },
  { name: "cake", svg: "🎂" },
  { name: "ice-cream", svg: "🍦" },
  { name: "beer", svg: "🍺" },
  { name: "wine", svg: "🍷" },
  { name: "spa", svg: "🧖‍♀️" },
  { name: "hotel", svg: "🏨" },
  { name: "travel", svg: "✈️" },
  { name: "gas", svg: "⛽" },
  { name: "bank", svg: "🏦" },
  { name: "pharmacy", svg: "💊" },
  { name: "dentist", svg: "🦷" },
  { name: "lawyer", svg: "⚖️" },
  { name: "real-estate", svg: "🏘️" },
  { name: "agriculture", svg: "🌾" }
];

interface IconSelectorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectIcon: (iconName: string) => void;
  selectedIcon?: string;
}

export function IconSelector({ open, onOpenChange, onSelectIcon, selectedIcon }: IconSelectorProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Selecionar Ícone</DialogTitle>
        </DialogHeader>
        
        <div className="grid grid-cols-8 gap-2 max-h-96 overflow-y-auto">
          {commerceIcons.map((icon) => (
            <Button
              key={icon.name}
              variant={selectedIcon === icon.name ? "default" : "outline"}
              className="aspect-square p-2 text-2xl hover:scale-105 transition-transform"
              onClick={() => {
                onSelectIcon(icon.name);
                onOpenChange(false);
              }}
            >
              {icon.svg}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface IconPreviewProps {
  iconName?: string;
  className?: string;
}

export function IconPreview({ iconName, className = "text-2xl" }: IconPreviewProps) {
  const icon = commerceIcons.find(i => i.name === iconName);
  return <span className={className}>{icon?.svg || "❓"}</span>;
}