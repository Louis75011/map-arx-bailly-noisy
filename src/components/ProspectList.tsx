import React from 'react';
import { Business } from '../constants';
import { cn } from '../lib/utils';
import { Search, Filter, Phone, Mail, Globe, MapPin, ChevronRight } from 'lucide-react';

interface ProspectListProps {
  prospects: Business[];
  onSelect: (business: Business) => void;
  search: string;
  setSearch: (s: string) => void;
  filterSector: string;
  setFilterSector: (s: string) => void;
}

export default function ProspectList({ 
  prospects, 
  onSelect, 
  search, 
  setSearch, 
  filterSector, 
  setFilterSector 
}: ProspectListProps) {
  const sectors = Array.from(new Set(prospects.map(p => p.secteur)));

  return (
    <div className="flex flex-col h-full bg-white border-r border-black/5">
      <div className="p-4 border-bottom border-black/5 space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Rechercher une entreprise..."
            className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-black/5 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button 
            onClick={() => setFilterSector('')}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
              filterSector === '' ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            )}
          >
            Tous
          </button>
          {sectors.map(sector => (
            <button 
              key={sector}
              onClick={() => setFilterSector(sector)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors",
                filterSector === sector ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              )}
            >
              {sector}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {prospects.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Aucun prospect trouvé
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {prospects.map(prospect => (
              <button
                key={prospect.id}
                onClick={() => onSelect(prospect)}
                className="w-full p-4 text-left hover:bg-gray-50 transition-colors group relative"
              >
                <div className="flex justify-between items-start mb-1">
                  <h4 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {prospect.nomEntreprise}
                  </h4>
                  <PriorityBadge priority={prospect.priorite} />
                </div>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="bg-gray-100 px-2 py-0.5 rounded mr-2">{prospect.secteur}</span>
                  <span className="flex items-center"><MapPin className="w-3 h-3 mr-1" /> {prospect.ville}</span>
                </div>
                <div className="flex gap-3 text-gray-400">
                  {prospect.telephone && <Phone className="w-3.5 h-3.5" />}
                  {prospect.email && <Mail className="w-3.5 h-3.5" />}
                  {prospect.website && <Globe className="w-3.5 h-3.5" />}
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <StatusBadge status={prospect.statut} />
                  <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-400 transition-all group-hover:translate-x-1" />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors = {
    'Très haute': 'bg-red-100 text-red-700 border-red-200',
    'Haute': 'bg-orange-100 text-orange-700 border-orange-200',
    'Moyenne': 'bg-blue-100 text-blue-700 border-blue-200',
    'Basse': 'bg-gray-100 text-gray-700 border-gray-200',
  };
  return (
    <span className={cn(
      "text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border",
      colors[priority as keyof typeof colors] || colors['Moyenne']
    )}>
      {priority}
    </span>
  );
}

function StatusBadge({ status }: { status: string }) {
  const colors = {
    'À contacter': 'bg-gray-100 text-gray-600',
    'En cours': 'bg-blue-100 text-blue-600',
    'Relancé': 'bg-purple-100 text-purple-600',
    'Froid': 'bg-slate-100 text-slate-600',
    'Refusé': 'bg-red-100 text-red-600',
    'Sans réponse': 'bg-orange-100 text-orange-600',
  };
  return (
    <span className={cn(
      "text-[10px] font-medium px-2 py-0.5 rounded-md",
      colors[status as keyof typeof colors] || colors['À contacter']
    )}>
      {status}
    </span>
  );
}
