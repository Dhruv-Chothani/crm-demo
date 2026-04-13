import { useState } from 'react';
import { getData, addItem, updateData, deleteData, generateId, exportToJson } from '@/lib/storage';
import type { Lead, Customer } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, Download, ArrowRightCircle } from 'lucide-react';
import { CrudModal } from '@/components/CrudModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const LeadsPage = () => {
  const [leads, setLeads] = useState(() => getData<Lead>('leads'));
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modal, setModal] = useState<{ open: boolean; item?: Lead }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setLeads(getData<Lead>('leads'));

  const filtered = leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (data: Record<string, string>) => {
    if (!data.name?.trim()) { toast.error('Name is required'); return; }
    if (modal.item) {
      updateData<Lead>('leads', modal.item.id, data as any);
      toast.success('Lead updated');
    } else {
      addItem('leads', { ...data, id: generateId(), status: data.status || 'new', createdAt: new Date().toISOString() } as Lead);
      toast.success('Lead added');
    }
    setModal({ open: false });
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) { deleteData('leads', deleteId); toast.success('Lead deleted'); setDeleteId(null); refresh(); }
  };

  const convertToCustomer = (lead: Lead) => {
    addItem('customers', {
      id: generateId(), name: lead.name, email: '', phone: '', company: '', status: 'active' as const, createdAt: new Date().toISOString(),
    } as Customer);
    updateData<Lead>('leads', lead.id, { status: 'closed' as const });
    toast.success(`${lead.name} converted to customer`);
    refresh();
  };

  const fields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'source', label: 'Source' },
    { key: 'status', label: 'Status', type: 'select', options: ['new', 'contacted', 'closed'] },
    { key: 'assignedTo', label: 'Assigned To' },
  ];

  const statusColors: Record<string, string> = {
    new: 'bg-info/10 text-info',
    contacted: 'bg-warning/10 text-warning',
    closed: 'bg-success/10 text-success',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Leads</h1>
        <div className="flex gap-2">
          <button onClick={() => exportToJson('leads')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal({ open: true })} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Lead
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Source</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Assigned</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(l => (
                <tr key={l.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{l.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{l.source}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{l.assignedTo}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[l.status] || ''}`}>{l.status}</span>
                  </td>
                  <td className="px-4 py-3 text-right whitespace-nowrap">
                    {l.status !== 'closed' && (
                      <button onClick={() => convertToCustomer(l)} title="Convert to Customer" className="p-1.5 text-muted-foreground hover:text-success transition-colors">
                        <ArrowRightCircle className="w-4 h-4" />
                      </button>
                    )}
                    <button onClick={() => setModal({ open: true, item: l })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(l.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No leads found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CrudModal open={modal.open} onClose={() => setModal({ open: false })} onSave={handleSave}
        title={modal.item ? 'Edit Lead' : 'Add Lead'} fields={fields} initialData={modal.item as any} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Lead" message="Are you sure you want to delete this lead?" />
    </div>
  );
};

export default LeadsPage;
