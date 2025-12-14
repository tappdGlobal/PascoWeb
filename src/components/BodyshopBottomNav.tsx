import { Home, List, BarChart3, PhoneCall, Settings, UserCog } from "lucide-react";
import { cn } from "./ui/utils";
import { useBodyshopData } from "./BodyshopDataContext";

interface BodyshopBottomNavProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Home", icon: Home },
  { id: "jobs", label: "Jobs", icon: List },
  { id: "manager", label: "Manager", icon: UserCog },
  { id: "followups", label: "Follow-ups", icon: PhoneCall },
  { id: "settings", label: "Settings", icon: Settings },
];

export function BodyshopBottomNav({ activeTab, onTabChange }: BodyshopBottomNavProps) {
  const { jobs } = useBodyshopData();
  const pendingCount = jobs.filter(j => String(j.status || '').toLowerCase() !== 'completed').length;
  const followupCount = jobs.filter(j => Boolean((j as any).callbackDate || (j as any).followUpDate)).length;
  return (
    <nav className="fixed bottom-0 left-0 right-0 glass-card border-t border-blue-100 safe-bottom z-50">
      <div className="flex items-center justify-around px-0.5 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                "flex flex-col items-center justify-center gap-1 px-1 py-1.5 rounded-xl transition-all duration-300 min-w-[50px] relative",
                isActive
                  ? "text-blue-600"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              <div className={cn(
                "w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-300",
                isActive 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg scale-110" 
                  : "hover:bg-blue-50"
              )}>
                <div className="relative">
                  <Icon className={cn("w-5 h-5", isActive && "text-white")} />
                  {item.id === 'jobs' && pendingCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">{pendingCount}</span>
                  )}
                  {item.id === 'followups' && followupCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-[10px] px-1 rounded-full">{followupCount}</span>
                  )}
                </div>
              </div>
              <span className={cn(
                "text-[10px] leading-tight transition-all",
                isActive && "text-blue-600 font-semibold"
              )}>
                {item.label}
              </span>
              {isActive && (
                <div className="absolute -bottom-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full shadow-md" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}