import React from 'react';
import { PROSPECTS, Business } from '../constants';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Users, Target, CheckCircle2, AlertCircle } from 'lucide-react';

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

export default function Dashboard({ prospects }: { prospects: Business[] }) {
  const total = prospects.length;
  const contacted = prospects.filter(p => p.statut !== 'À contacter').length;
  const highPriority = prospects.filter(p => p.priorite === 'Très haute').length;
  const responded = prospects.filter(p => p.repondu === 'OUI').length;

  const sectorData = Object.entries(
    prospects.reduce((acc, curr) => {
      acc[curr.secteur] = (acc[curr.secteur] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }))
   .sort((a, b) => b.value - a.value)
   .slice(0, 5);

  const statusData = Object.entries(
    prospects.reduce((acc, curr) => {
      acc[curr.statut] = (acc[curr.statut] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  ).map(([name, value]) => ({ name, value }));

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Total Prospects" 
          value={total} 
          icon={<Users className="w-5 h-5 text-blue-500" />} 
          description="Total businesses identified"
        />
        <StatCard 
          title="Contactés" 
          value={contacted} 
          icon={<Target className="w-5 h-5 text-emerald-500" />} 
          description={`${Math.round((contacted/total)*100)}% du total`}
        />
        <StatCard 
          title="Priorité Très Haute" 
          value={highPriority} 
          icon={<AlertCircle className="w-5 h-5 text-red-500" />} 
          description="Action immédiate requise"
        />
        <StatCard 
          title="Réponses" 
          value={responded} 
          icon={<CheckCircle2 className="w-5 h-5 text-purple-500" />} 
          description="Taux de conversion actuel"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Top Secteurs</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sectorData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={150} 
                  fontSize={12}
                  tick={{ fill: '#6b7280' }}
                />
                <Tooltip 
                  cursor={{ fill: '#f9fafb' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5">
          <h3 className="text-sm font-medium text-gray-500 mb-4 uppercase tracking-wider">Répartition Statuts</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend verticalAlign="bottom" height={36}/>
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon, description }: { title: string, value: number, icon: React.ReactNode, description: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-black/5 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-gray-500 uppercase tracking-wider">{title}</span>
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 mb-1">{value}</div>
      <p className="text-xs text-gray-400">{description}</p>
    </div>
  );
}
