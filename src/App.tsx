import React, { useState, useMemo } from 'react';
import { PROSPECTS, Business, CITIES } from './constants';
import Dashboard from './components/Dashboard';
import ProspectList from './components/ProspectList';
import MapView from './components/MapView';
import ProspectDetail from './components/ProspectDetail';
import { LayoutDashboard, List, Map as MapIcon, Settings, Bell, User, MapPin, Phone, ChevronDown } from 'lucide-react';
import { cn } from './lib/utils';

type View = 'dashboard' | 'list' | 'map';

export default function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedProspect, setSelectedProspect] = useState<Business | null>(null);
  const [search, setSearch] = useState('');
  const [filterSector, setFilterSector] = useState('');
  const [selectedCity, setSelectedCity] = useState<string>('Noisy-le-Roi');
  const [isCityMenuOpen, setIsCityMenuOpen] = useState(false);

  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    setSelectedProspect(null);
    setIsCityMenuOpen(false);
  };

  const filteredProspects = useMemo(() => {
    return PROSPECTS.filter(p => {
      const matchesSearch = p.nomEntreprise.toLowerCase().includes(search.toLowerCase()) ||
                            p.secteur.toLowerCase().includes(search.toLowerCase());
      const matchesSector = filterSector === '' || p.secteur === filterSector;
      const matchesCity = p.ville.includes(selectedCity);
      return matchesSearch && matchesSector && matchesCity;
    });
  }, [search, filterSector, selectedCity]);

  const handleSelectProspect = (p: Business) => {
    setSelectedProspect(p);
  };

  const cityConfig = CITIES[selectedCity] || CITIES['Noisy-le-Roi'];

  return (
    <div className="flex h-screen bg-gray-50 text-gray-900 font-sans overflow-hidden flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-20 lg:w-64 bg-white border-r border-black/5 flex-col z-40">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
            <TargetIcon className="w-6 h-6 text-white" />
          </div>
          <h1 className="hidden lg:block font-black text-xl tracking-tighter text-gray-900">
            ARX<span className="text-blue-600">PRO</span>
          </h1>
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          <NavItem 
            icon={<LayoutDashboard />} 
            label="Dashboard" 
            active={currentView === 'dashboard'} 
            onClick={() => setCurrentView('dashboard')} 
          />
          <NavItem 
            icon={<List />} 
            label="Prospects" 
            active={currentView === 'list'} 
            onClick={() => setCurrentView('list')} 
          />
          <NavItem 
            icon={<MapIcon />} 
            label="Carte" 
            active={currentView === 'map'} 
            onClick={() => setCurrentView('map')} 
          />
        </nav>

        <div className="p-4 border-t border-black/5 space-y-2">
          <NavItem icon={<Settings />} label="Paramètres" />
          <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
            <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center border border-black/5">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div className="hidden lg:block">
              <p className="text-sm font-bold leading-none">Louis R.</p>
              <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-1">Admin</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-hidden pb-16 md:pb-0">
        {/* Top Header */}
        <header className="h-16 bg-white border-b border-black/5 flex items-center justify-between px-4 md:px-8 z-30">
          <div className="flex items-center gap-4">
            <div className="md:hidden w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/20">
              <TargetIcon className="w-5 h-5 text-white" />
            </div>
            <div className="relative">
              <button 
                onClick={() => setIsCityMenuOpen(!isCityMenuOpen)}
                className="flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-black/5 rounded-xl hover:bg-gray-100 transition-all active:scale-95"
              >
                <MapPin className="w-4 h-4 text-blue-600" />
                <span className="text-sm font-bold">{selectedCity}</span>
                <ChevronDown className={cn("w-4 h-4 text-gray-400 transition-transform", isCityMenuOpen && "rotate-180")} />
              </button>
              
              {isCityMenuOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsCityMenuOpen(false)}
                  />
                  <div className="absolute top-full left-0 mt-2 w-48 bg-white border border-black/5 rounded-2xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                    {Object.keys(CITIES).map(city => (
                      <button 
                        key={city}
                        onClick={() => handleCityChange(city)}
                        className={cn(
                          "w-full text-left px-4 py-3 text-sm font-medium hover:bg-gray-50 transition-colors",
                          selectedCity === city ? "text-blue-600 bg-blue-50/50" : "text-gray-600"
                        )}
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all relative">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden md:block h-8 w-px bg-black/5 mx-2"></div>
            <button className="hidden md:block bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-lg shadow-blue-500/20 hover:bg-blue-700 transition-all active:scale-95">
              Nouveau Prospect
            </button>
          </div>
        </header>

        {/* View Content */}
        <div className="flex-1 overflow-hidden relative">
          {currentView === 'dashboard' && <Dashboard prospects={filteredProspects} />}
          
          {currentView === 'list' && (
            <div className="flex h-full">
              <div className="w-full lg:w-1/3 h-full">
                <ProspectList 
                  prospects={filteredProspects} 
                  onSelect={handleSelectProspect}
                  search={search}
                  setSearch={setSearch}
                  filterSector={filterSector}
                  setFilterSector={setFilterSector}
                />
              </div>
              <div className="hidden lg:block flex-1 h-full bg-gray-100 relative">
                {selectedProspect ? (
                  <div className="p-8 h-full overflow-y-auto">
                    <div className="max-w-3xl mx-auto">
                      <ProspectPreview business={selectedProspect} />
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-400 flex-col gap-4">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm border border-black/5">
                      <TargetIcon className="w-8 h-8 opacity-20" />
                    </div>
                    <p className="text-sm font-medium">Sélectionnez un prospect pour voir les détails</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {currentView === 'map' && (
            <MapView 
              prospects={filteredProspects} 
              selectedId={selectedProspect?.id}
              onSelect={handleSelectProspect}
              center={cityConfig.center}
              zoom={cityConfig.zoom}
            />
          )}
        </div>

        {/* Detail Panel */}
        <ProspectDetail 
          business={selectedProspect} 
          onClose={() => setSelectedProspect(null)} 
        />
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-black/5 h-16 flex items-center justify-around px-4 z-40">
        <MobileNavItem 
          icon={<LayoutDashboard />} 
          active={currentView === 'dashboard'} 
          onClick={() => setCurrentView('dashboard')} 
        />
        <MobileNavItem 
          icon={<List />} 
          active={currentView === 'list'} 
          onClick={() => setCurrentView('list')} 
        />
        <MobileNavItem 
          icon={<MapIcon />} 
          active={currentView === 'map'} 
          onClick={() => setCurrentView('map')} 
        />
        <MobileNavItem 
          icon={<Settings />} 
          active={false} 
        />
      </nav>
    </div>
  );
}

function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-xl transition-all group",
        active 
          ? "bg-blue-50 text-blue-600 shadow-sm border border-blue-100/50" 
          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
      )}
    >
      <div className={cn(
        "p-1 rounded-lg transition-colors",
        active ? "text-blue-600" : "text-gray-400 group-hover:text-gray-600"
      )}>
        {React.cloneElement(icon as React.ReactElement, { className: 'w-5 h-5' })}
      </div>
      <span className="hidden lg:block font-bold text-sm tracking-tight">{label}</span>
    </button>
  );
}

function MobileNavItem({ icon, active, onClick }: { icon: React.ReactNode, active?: boolean, onClick?: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center w-12 h-12 rounded-2xl transition-all",
        active ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20" : "text-gray-400"
      )}
    >
      {React.cloneElement(icon as React.ReactElement, { className: 'w-6 h-6' })}
    </button>
  );
}

function TargetIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <circle cx="12" cy="12" r="6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ProspectPreview({ business }: { business: Business }) {
  return (
    <div className="bg-white rounded-3xl shadow-sm border border-black/5 overflow-hidden">
      <div className="p-8 border-b border-black/5 bg-gray-50/30">
        <div className="flex justify-between items-start mb-4">
          <span className="px-3 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded-full uppercase tracking-wider">
            {business.secteur}
          </span>
          <span className={cn(
            "px-3 py-1 text-xs font-bold rounded-full uppercase tracking-wider",
            business.priorite === 'Très haute' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
          )}>
            Priorité {business.priorite}
          </span>
        </div>
        <h3 className="text-3xl font-black text-gray-900 tracking-tight mb-2">{business.nomEntreprise}</h3>
        <p className="text-gray-500 flex items-center">
          <MapPin className="w-4 h-4 mr-2" /> {business.adresse}, {business.ville}
        </p>
      </div>
      <div className="p-8 grid grid-cols-2 gap-8">
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Plan d'action</h4>
            <div className="bg-blue-50 p-4 rounded-2xl border border-blue-100">
              <p className="text-blue-900 font-bold text-sm leading-relaxed">{business.prochaiAction}</p>
            </div>
          </div>
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Accroche recommandée</h4>
            <p className="text-gray-600 italic text-sm leading-relaxed">"{business.messageAccroche}"</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3">Audit SEO Express</h4>
            <div className="space-y-2">
              {business.notesSEO.split('|').slice(0, 3).map((note, i) => (
                <div key={i} className="flex items-center text-xs text-gray-700 bg-gray-50 p-2 rounded-lg border border-black/5">
                  <span className="mr-2">{note.trim().split(' ')[0]}</span>
                  <span className="truncate">{note.trim().split(' ').slice(1).join(' ')}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button className="flex-1 bg-gray-900 text-white font-bold py-3 rounded-xl text-sm hover:bg-black transition-all">
              Détails complets
            </button>
            <button className="p-3 bg-gray-100 rounded-xl hover:bg-gray-200 transition-all">
              <Phone className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
