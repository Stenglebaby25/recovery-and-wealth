import { Heart, TrendingUp, Layers } from "lucide-react";
import { useTheme } from "@/hooks/useTheme";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

export function ThemeSelector({ fullWidth = false }: { fullWidth?: boolean }) {
  const { theme, setTheme } = useTheme();

  const themes = [
    { 
      value: "unified" as const, 
      label: "Unified", 
      icon: Layers,
      description: "Balanced recovery & wealth"
    },
    { 
      value: "recovery" as const, 
      label: "Recovery Focus", 
      icon: Heart,
      description: "Calming, healing emphasis"
    },
    { 
      value: "wealth" as const, 
      label: "Wealth Focus", 
      icon: TrendingUp,
      description: "Professional, growth emphasis"
    },
  ];

  const currentTheme = themes.find((t) => t.value === theme);
  const CurrentIcon = currentTheme?.icon || Layers;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`gap-2 ${fullWidth ? 'w-full' : ''}`}
        >
          <CurrentIcon className="h-4 w-4" />
          <span className="hidden sm:inline">Theme</span>
          <span className="sm:hidden">{currentTheme?.label}</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        {themes.map(({ value, label, icon: Icon, description }) => (
          <DropdownMenuItem
            key={value}
            onClick={() => setTheme(value)}
            className="cursor-pointer flex items-start gap-3 p-3"
          >
            <Icon className="h-4 w-4 mt-0.5 flex-shrink-0" />
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <span className="font-medium">{label}</span>
                {theme === value && (
                  <span className="text-primary">✓</span>
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {description}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
