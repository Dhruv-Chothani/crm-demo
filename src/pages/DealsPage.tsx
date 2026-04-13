import { useState } from 'react';
import { getData, addItem, updateData, deleteData, generateId, exportToJson } from '@/lib/storage';
import type { Deal } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Download, Pencil, Trash2, DollarSign } from 'lucide-react';
import { CrudModal } from '@/components/CrudModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const stages = ['discovery', 'proposal', 'negotiation', 'won', 'lost'] as const;
const stageColors: Record<string, string> = {
  discovery: 'bg-info/10 text-info border-info/20',
  proposal: 'bg-accent/10 text-accent border-accent/20',
  negotiation: 'bg-warning/10 text-warning border-warning/20',
  won: 'bg-success/10 text-success border-success/20',
  lost: 'bg-destructive/10 text-destructive border-destructive/20',
};

const DealsPage = () => {
  const [deals, setDeals] = useState(() => getData<Deal>('deals'));
  const [modal, setModal] = useState<{ open: boolean; item?: Deal }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [view, setView] = useState<'pipeline' | 'table'>('pipeline');

  const refresh = () => setDeals(getData<Deal>('deals'));

  const handleSave = (data: Record<string, string>) => {
    if (!data.title?.trim()) { toast.error('Title is required'); return; }
    if (modal.item) {
      updateData<Deal>('deals', modal.item.id, { ...data, value: Number(data.value) || 0 } as any);
      toast.success('Deal updated');
    } else {
      addItem('deals', { ...data, id: generateId(), value: Number(data.value) || 0, stage: data.stage || 'discovery', createdAt: new Date().toISOString() } as Deal);
      toast.success('Deal added');
    }
    setModal({ open: false });
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) { deleteData('deals', deleteId); toast.success('Deal deleted'); setDeleteId(null); refresh(); }
  };

  const fields = [
    { key: 'title', label: 'Title', required: true },
    { key: 'customer', label: 'Customer' },
    { key: 'value', label: 'Value ($)', type: 'number' },
    { key: 'stage', label: 'Stage', type: 'select', options: [...stages] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Deals</h1>
        <div className="flex gap-2">
          <div className="flex border border-border rounded-lg overflow-hidden">
            <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'pipeline' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>Pipeline</button>
            <button onClick={() => setView('table')} className={`px-3 py-1.5 text-xs font-medium transition-colors ${view === 'table' ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-muted'}`}>Table</button>
          </div>
          <button onClick={() => exportToJson('deals')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal({ open: true })} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Deal
          </button>
        </div>
      </div>

      {view === 'pipeline' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {stages.map(stage => {
            const stageDeals = deals.filter(d => d.stage === stage);
            const total = stageDeals.reduce((s, d) => s + d.value, 0);
            return (
              <div key={stage} className="space-y-2">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-foreground capitalize">{stage}</h3>
                  <span className="text-xs text-muted-foreground">${total.toLocaleString()}</span>
                </div>
                <div className="space-y-2 min-h-[100px]">
                  {stageDeals.map(d => (
                    <div key={d.id} className={`p-3 rounded-lg border ${stageColors[d.stage]} animate-slide-up`}>
                      <p className="font-medium text-sm">{d.title}</p>
                      <p className="text-xs opacity-75 mt-0.5">{d.customer}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-semibold">${d.value.toLocaleString()}</span>
                        <div className="flex gap-1">
                          <button onClick={() => setModal({ open: true, item: d })} className="p-1 hover:opacity-70"><Pencil className="w-3 h-3" /></button>
                          <button onClick={() => setDeleteId(d.id)} className="p-1 hover:opacity-70"><Trash2 className="w-3 h-3" /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-card border border-border rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Title</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Customer</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Value</th>
                  <th className="text-left px-4 py-3 font-medium text-muted-foreground">Stage</th>
                  <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {deals.map(d => (
                  <tr key={d.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-medium text-foreground">{d.title}</td>
                    <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{d.customer}</td>
                    <td className="px-4 py-3 text-foreground">${d.value.toLocaleString()}</td>
                    <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs font-medium ${stageColors[d.stage]}`}>{d.stage}</span></td>
                    <td className="px-4 py-3 text-right">
                      <button onClick={() => setModal({ open: true, item: d })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors"><Pencil className="w-4 h-4" /></button>
                      <button onClick={() => setDeleteId(d.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <CrudModal open={modal.open} onClose={() => setModal({ open: false })} onSave={handleSave}
        title={modal.item ? 'Edit Deal' : 'Add Deal'} fields={fields} initialData={modal.item as any} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Deal" message="Are you sure you want to delete this deal?" />
    </div>
  );
};

export default DealsPage;
