import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Layers, MessageSquare, ShieldCheck, BookOpen, Coins, Settings as SettingsIcon, LogOut, Menu, X, Plus } from 'lucide-react';

interface AppShellProps {
  currentRoute: string;
  onNavigate: (route: string) => void;
  userProfile: UserProfile;
  onLogout: () => void;
  children: React.ReactNode;
}

export default function AppShell({ currentRoute, onNavigate, userProfile, onLogout, children }: AppShellProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigationItems = [
    { name: 'Overview', icon: Layers, route: 'overview' },
    { name: 'Projects', icon: Layers, route: 'projects' },
    { name: 'Brand Voice', icon: MessageSquare, route: 'brand-voice' },
    { name: 'AI Quality', icon: ShieldCheck, route: 'ai-quality' },
    { name: 'Case Study', icon: BookOpen, route: 'case-study' },
    { name: 'Billing', icon: Coins, route: 'billing' },
    { name: 'Settings', icon: SettingsIcon, route: 'settings' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex font-sans">
      
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-sidebar-bg border-r border-slate-800 shrink-0 sticky top-0 h-screen">
        {/* Brand Logo */}
        <div className="h-16 flex items-center gap-2.5 px-6 border-b border-slate-800">
          <div className="bg-orange-600 p-1.5 rounded-lg text-white">
            <Sparkles className="h-4.5 w-4.5" />
          </div>
          <span className="font-bold text-base tracking-tight bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
            ContentForge AI
          </span>
        </div>

        {/* New Project CTA */}
        <div className="px-4 py-4">
          <button 
            onClick={() => onNavigate('new-project')}
            className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl text-xs transition-colors shadow-lg shadow-orange-950/20"
          >
            <Plus className="h-4 w-4" /> New Project
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {navigationItems.map(item => {
            const isActive = currentRoute === item.route;
            const Icon = item.icon;
            return (
              <button
                key={item.name}
                onClick={() => onNavigate(item.route)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive 
                    ? 'bg-orange-600 text-white shadow-md shadow-orange-950/10' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`h-4.5 w-4.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                {item.name}
              </button>
            );
          })}
        </nav>

        {/* User Card at bottom */}
        <div className="p-4 border-t border-slate-800 bg-sidebar-bg/50 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{userProfile.displayName}</p>
            <p className="text-[10px] text-slate-500 truncate mt-0.5">{userProfile.email}</p>
          </div>
          <button 
            onClick={onLogout}
            className="text-slate-500 hover:text-red-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors shrink-0"
            title="Sign Out"
          >
            <LogOut className="h-4.5 w-4.5" />
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto">
        
        {/* Top bar */}
        <header className="h-16 bg-sidebar-bg/60 backdrop-blur-md border-b border-slate-800 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-40">
          
          {/* Mobile menu triggers */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>
            <div className="md:hidden flex items-center gap-2">
              <div className="bg-orange-600 p-1.5 rounded-lg text-white">
                <Sparkles className="h-4 w-4" />
              </div>
              <span className="font-bold text-sm bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                ContentForge AI
              </span>
            </div>
          </div>

          {/* User Credits Status Indicator */}
          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 bg-orange-500/10 border border-orange-500/20 px-3 py-1.5 rounded-lg text-orange-400">
              <Coins className="h-4 w-4" />
              <span>{userProfile.credits} Credits</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="flex-grow p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto pb-16">
          {children}
        </main>
      </div>

      {/* Mobile Menu Backdrop & Drawer */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
          ></div>

          {/* Sidebar Drawer */}
          <div className="relative flex flex-col w-64 max-w-xs bg-sidebar-bg border-r border-slate-800 h-full p-4 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-orange-500" />
                <span className="font-bold text-base bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
                  ContentForge AI
                </span>
              </div>
              <button 
                onClick={() => setMobileMenuOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <button 
              onClick={() => {
                onNavigate('new-project');
                setMobileMenuOpen(false);
              }}
              className="w-full inline-flex items-center justify-center gap-2 bg-orange-600 hover:bg-orange-500 text-white font-semibold py-3 rounded-xl text-xs transition-colors shadow-lg"
            >
              <Plus className="h-4 w-4" /> New Project
            </button>

            <nav className="flex-grow space-y-1">
              {navigationItems.map(item => {
                const isActive = currentRoute === item.route;
                const Icon = item.icon;
                return (
                  <button
                    key={item.name}
                    onClick={() => {
                      onNavigate(item.route);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive 
                        ? 'bg-orange-600 text-white shadow-md' 
                        : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                    {item.name}
                  </button>
                );
              })}
            </nav>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
              <div className="min-w-0">
                <p className="text-xs font-bold text-slate-200 truncate">{userProfile.displayName}</p>
                <p className="text-[9px] text-slate-500 truncate mt-0.5">{userProfile.email}</p>
              </div>
              <button 
                onClick={onLogout}
                className="text-slate-500 hover:text-red-400 p-1.5"
              >
                <LogOut className="h-4.5 w-4.5" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
