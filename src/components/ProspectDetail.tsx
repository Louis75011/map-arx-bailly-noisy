import React from 'react';
import { Business } from '../constants';
import { 
  X, Phone, Mail, Globe, MapPin, Calendar, 
  MessageSquare, Lightbulb, Search, Target,
  ExternalLink, Copy, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface ProspectDetailProps {
  business: Business | null;
  onClose: () => void;
}

export default function ProspectDetail({ business, onClose }: ProspectDetailProps) {
  if (!business) return null;

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Could add a toast here
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed inset-y-0 right-0 w-full md:w-[500px] bg-white shadow-2xl z-50 flex flex-col border-l border-black/5"
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 flex justify-between items-start bg-gray-50/50">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded uppercase tracking-wider">
                {business.secteur}
              </span>
              <span className={cn(
                "px-2 py-0.5 text-[10px] font-bold rounded uppercase tracking-wider",
                business.priorite === 'Très haute' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
              )}>
                {business.priorite}
              </span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 leading-tight">{business.nomEntreprise}</h2>
            <p className="text-gray-500 text-sm flex items-center mt-1">
              <MapPin className="w-3.5 h-3.5 mr-1" /> {business.adresse}, {business.ville}
            </p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Contact Info */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Informations de contact</h3>
            <div className="grid grid-cols-1 gap-3">
              <ContactItem icon={<Phone />} label="Téléphone" value={business.telephone} onCopy={() => copyToClipboard(business.telephone)} />
              <ContactItem icon={<Mail />} label="Email" value={business.email} onCopy={() => copyToClipboard(business.email)} />
              <ContactItem icon={<Globe />} label="Site Web" value={business.website} isLink />
              <ContactItem icon={<Target />} label="Contact Clé" value={business.contactCle} />
            </div>
          </section>

          {/* Action Plan */}
          <section className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
            <h3 className="text-blue-800 font-bold text-sm flex items-center mb-3">
              <Target className="w-4 h-4 mr-2" /> Prochaine Action
            </h3>
            <p className="text-blue-900 text-sm leading-relaxed font-medium">
              {business.prochaiAction}
            </p>
            <div className="mt-4 flex items-center text-xs text-blue-600 font-semibold">
              <Calendar className="w-3.5 h-3.5 mr-1.5" /> Échéance : {business.projetEcheance}
            </div>
          </section>

          {/* Hook Message */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Message d'accroche</h3>
            <div className="bg-gray-50 rounded-2xl p-5 border border-black/5 relative group">
              <MessageSquare className="absolute -top-2 -left-2 w-6 h-6 text-blue-500/20" />
              <p className="text-gray-700 text-sm italic leading-relaxed">
                "{business.messageAccroche}"
              </p>
              <button 
                onClick={() => copyToClipboard(business.messageAccroche)}
                className="absolute top-3 right-3 p-1.5 bg-white shadow-sm border border-black/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Copy className="w-3.5 h-3.5 text-gray-400" />
              </button>
            </div>
          </section>

          {/* SEO Audit */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Audit SEO & Notes</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 flex items-center">
                  <Search className="w-3.5 h-3.5 mr-1.5" /> Analyse SEO
                </div>
                <div className="text-sm text-gray-700 bg-gray-50 p-4 rounded-xl border border-black/5">
                  {business.notesSEO.split('|').map((note, i) => (
                    <div key={i} className="flex items-start mb-1 last:mb-0">
                      <span className="mr-2 mt-0.5">{note.trim().split(' ')[0]}</span>
                      <span>{note.trim().split(' ').slice(1).join(' ')}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <div className="text-xs font-semibold text-gray-500 flex items-center">
                  <Lightbulb className="w-3.5 h-3.5 mr-1.5" /> Observations terrain
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {business.notes}
                </p>
              </div>
            </div>
          </section>

          {/* Checklist */}
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-4">Suivi du projet</h3>
            <div className="grid grid-cols-2 gap-3">
              <CheckItem label="Audit réalisé" checked={business.auditRealise} />
              <CheckItem label="Maquette réalisée" checked={business.maquetteRealisee} />
              <CheckItem label="Devis envoyé" checked={business.devisEnvoye} />
              <CheckItem label="Appel/RDV" checked={business.appelRdv} />
              <CheckItem label="Cartes de visite" checked={business.cartesVisite} />
              <CheckItem label="Site réalisé" checked={business.siteRealise} />
            </div>
          </section>
        </div>

        {/* Footer Actions */}
        <div className="p-6 border-t border-black/5 bg-gray-50/50 flex gap-3">
          <button className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">
            Marquer comme contacté
          </button>
          <button className="px-4 py-3 bg-white border border-black/10 rounded-xl hover:bg-gray-100 transition-colors">
            Éditer
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

function ContactItem({ icon, label, value, isLink, onCopy }: { icon: React.ReactNode, label: string, value: string, isLink?: boolean, onCopy?: () => void }) {
  if (!value) return null;
  return (
    <div className="flex items-center justify-between p-3 bg-white border border-black/5 rounded-xl group">
      <div className="flex items-center min-w-0">
        <div className="p-2 bg-gray-50 rounded-lg mr-3 text-gray-400 group-hover:text-blue-500 transition-colors">
          {React.cloneElement(icon as React.ReactElement, { className: 'w-4 h-4' })}
        </div>
        <div className="min-w-0">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none mb-1">{label}</div>
          {isLink ? (
            <a href={value.startsWith('http') ? value : `https://${value}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-blue-600 hover:underline flex items-center truncate">
              {value} <ExternalLink className="w-3 h-3 ml-1 flex-shrink-0" />
            </a>
          ) : (
            <div className="text-sm font-medium text-gray-900 truncate">{value}</div>
          )}
        </div>
      </div>
      {onCopy && (
        <button onClick={onCopy} className="p-1.5 hover:bg-gray-100 rounded-md opacity-0 group-hover:opacity-100 transition-opacity">
          <Copy className="w-3.5 h-3.5 text-gray-400" />
        </button>
      )}
    </div>
  );
}

function CheckItem({ label, checked }: { label: string, checked?: boolean }) {
  return (
    <div className={cn(
      "flex items-center p-2.5 rounded-xl border text-xs font-medium transition-colors",
      checked ? "bg-emerald-50 border-emerald-100 text-emerald-700" : "bg-gray-50 border-gray-100 text-gray-400"
    )}>
      <CheckCircle2 className={cn("w-4 h-4 mr-2", checked ? "text-emerald-500" : "text-gray-300")} />
      {label}
    </div>
  );
}
