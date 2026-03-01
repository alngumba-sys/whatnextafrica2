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
      accent: 'bg-violet-500',
      bg: 'bg-violet-50',
      border: 'border-l-violet-500',
      text: 'text-violet-700',
      iconBg: 'bg-violet-500',
      ring: 'ring-violet-500/20',
      icon: Building2
    },
    secretariat: {
      accent: 'bg-amber-500',
      bg: 'bg-amber-50',
      border: 'border-l-amber-500',
      text: 'text-amber-700',
      iconBg: 'bg-amber-500',
      ring: 'ring-amber-500/20',
      icon: Users
    },
    top: {
      accent: 'bg-rose-500',
      bg: 'bg-rose-50',
      border: 'border-l-rose-500',
      text: 'text-rose-700',
      iconBg: 'bg-rose-500',
      ring: 'ring-rose-500/20',
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