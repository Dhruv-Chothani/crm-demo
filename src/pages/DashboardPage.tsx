import { getData } from '@/lib/storage';
import type { Customer, Lead, Deal } from '@/lib/types';
import { Users, UserPlus, Briefcase, DollarSign, TrendingUp, ArrowUpRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area, CartesianGrid } from 'recharts';

const DashboardPage = () => {
  const customers = getData<Customer>('customers');
  const leads = getData<Lead>('leads');
  const deals = getData<Deal>('deals');
  const revenue = deals.filter(d => d.stage === 'won').reduce((s, d) => s + d.value, 0);

  const stats = [
    { label: 'Customers', value: customers.length, icon: Users, color: 'bg-primary/10 text-primary' },
    { label: 'Leads', value: leads.length, icon: UserPlus, color: 'bg-accent/10 text-accent' },
    { label: 'Deals', value: deals.length, icon: Briefcase, color: 'bg-info/10 text-info' },
    { label: 'Revenue', value: `$${revenue.toLocaleString()}`, icon: DollarSign, color: 'bg-success/10 text-success' },
  ];

  const monthlyLeads = [
    { month: 'Jan', leads: 12 }, { month: 'Feb', leads: 19 }, { month: 'Mar', leads: 15 },
    { month: 'Apr', leads: 22 }, { month: 'May', leads: 18 }, { month: 'Jun', leads: leads.length + 10 },
  ];

  const revenueData = [
    { month: 'Jan', revenue: 8000 }, { month: 'Feb', revenue: 12000 }, { month: 'Mar', revenue: 15000 },
    { month: 'Apr', revenue: 22000 }, { month: 'May', revenue: 28000 }, { month: 'Jun', revenue: revenue || 20000 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <div key={s.label} className="bg-card border border-border rounded-xl p-5 animate-slide-up">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">{s.label}</p>
                <p className="text-2xl font-bold text-foreground mt-1">{s.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${s.color}`}>
                <s.icon className="w-5 h-5" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Monthly Leads</h2>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={monthlyLeads}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }} />
              <Bar dataKey="leads" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-card border border-border rounded-xl p-5">
          <h2 className="text-base font-semibold text-foreground mb-4">Revenue Overview</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <YAxis tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: 8 }}
                formatter={(v: number) => [`$${v.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="hsl(var(--accent))" fill="hsl(var(--accent) / 0.15)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
