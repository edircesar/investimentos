import React, { ReactNode } from 'react';
import { cn } from '@/utils/cn';
import { 
  Calculator, 
  TrendingUp, 
  Landmark, 
  Target, 
  BarChart, 
  History,
  Menu,
  X
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Layout({ children, activeTab, onTabChange }: LayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'COMPOUND', label: 'Juros Compostos', icon: Calculator },
    { id: 'CDI', label: 'Simulador CDI', icon: TrendingUp },
    { id: 'CDB', label: 'Simulador CDB', icon: Landmark },
    { id: 'GOAL', label: 'Metas Financeiras', icon: Target },
    { id: 'COMPARE', label: 'Comparador', icon: BarChart },
    { id: 'HISTORY', label: 'Histórico', icon: History },
  ];

  const handleNavClick = (id: string) => {
    onTabChange(id);
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row font-sans text-gray-900">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-4 bg-purple-900 text-white shadow-md z-20 relative">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <TrendingUp className="text-purple-300" />
          <span>InvestirAgora</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={cn(
        "fixed md:sticky top-0 left-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col transition-transform duration-300 z-10",
        isMobileMenuOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="hidden md:flex items-center gap-2 p-6 border-b border-gray-100 font-bold text-2xl text-purple-900 tracking-tight">
          <TrendingUp className="text-purple-600" />
          <span>InvestirAgora</span>
        </div>
        
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1 px-3">
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  onClick={() => handleNavClick(item.id)}
                  className={cn(
                    "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-colors text-left font-medium",
                    activeTab === item.id 
                      ? "bg-purple-50 text-purple-700" 
                      : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                  )}
                >
                  <item.icon className={cn("w-5 h-5", activeTab === item.id ? "text-purple-600" : "text-gray-400")} />
                  {item.label}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-x-hidden min-h-screen bg-gray-50 px-4 py-8 md:p-8">
        <div className="max-w-5xl mx-auto">
          {children}
        </div>
      </main>
      
      {/* Mobile Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-0 md:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}
    </div>
  );
}
