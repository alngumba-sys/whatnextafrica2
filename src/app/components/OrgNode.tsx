import { Building2, Users, Crown, ChevronDown } from "lucide-react";
import { cn } from "@/app/components/ui/utils";

interface OrgNodeProps {
  title: string;
  abbreviation?: string;
  count?: number;
  track: 'county' | 'secretariat' | 'top';
  level: number;
  onClick?: () => void;
  note?: string;
  isClickable?: boolean;
  isDimmed?: boolean; // New prop for graying out
}

export function OrgNode({ title, abbreviation, count, track, level, onClick, note, isClickable = false, isDimmed = false }: OrgNodeProps) {
  const trackConfig = {
    county: {
      accent: 'bg-[#66023C]',
      bg: 'bg-[#F5F5DC]',
      border: 'border-l-[#66023C]',
      text: 'text-[#66023C]',
      iconBg: 'bg-[#66023C]',
      ring: 'ring-[#66023C]/20',
      icon: Building2
    },
    secretariat: {
      accent: 'bg-[#8B7355]',
      bg: 'bg-[#E8DCC8]',
      border: 'border-l-[#8B7355]',
      text: 'text-[#8B7355]',
      iconBg: 'bg-[#8B7355]',
      ring: 'ring-[#8B7355]/20',
      icon: Users
    },
    top: {
      accent: 'bg-[#8B0000]',
      bg: 'bg-[#FFF8DC]',
      border: 'border-l-[#8B0000]',
      text: 'text-[#8B0000]',
      iconBg: 'bg-[#8B0000]',
      ring: 'ring-[#8B0000]/20',
      icon: Crown
    }
  };

  const config = trackConfig[track];
  const Icon = config.icon;

  return (
    <div 
      className={cn(
        "group transition-all duration-200",
        isClickable && "cursor-pointer",
        isDimmed && "opacity-40 pointer-events-none"
      )}
      onClick={onClick}
    >
      <div className={cn(
        "bg-white rounded-lg border-l-4 border-y border-r border-gray-200 shadow-sm transition-all duration-200",
        config.border,
        "min-w-[220px] max-w-[260px] relative overflow-hidden",
        onClick && !isDimmed && "hover:shadow-xl hover:scale-105 cursor-pointer",
        isDimmed && "grayscale"
      )}>
        
        <div className="p-3">
          {/* Header */}
          <div className="flex items-start gap-2 mb-2">
            <div className={cn(
              "p-1.5 rounded-md shrink-0",
              config.iconBg
            )}>
              <Icon className="w-3.5 h-3.5 text-white" strokeWidth={2.5} />
            </div>
            
            <div className="flex-1 min-w-0">
              {abbreviation && (
                <div className={cn(
                  "inline-block px-2 py-0.5 rounded text-xs font-bold mb-1",
                  config.bg,
                  config.text
                )}>
                  {abbreviation}
                </div>
              )}
            </div>
          </div>
          
          {/* Title */}
          <h3 className="font-semibold text-sm text-gray-900 leading-tight">
            {title}
          </h3>
          
          {/* Note */}
          {note && (
            <p className="text-xs text-gray-500 mt-1.5 leading-relaxed">
              {note}
            </p>
          )}
          
          {/* Count */}
          {count !== undefined && (
            <div className="mt-2 pt-2 border-t border-gray-100">
              <span className="text-xs text-gray-600">
                {count} position{count !== 1 ? 's' : ''}
              </span>
            </div>
          )}
        </div>

        {/* Bottom accent line */}
        <div className={cn("h-1", config.accent)} />
      </div>
    </div>
  );
}