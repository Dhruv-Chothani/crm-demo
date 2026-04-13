import { useState, useCallback } from 'react';
import { getData, addItem, updateData, deleteData, generateId, exportToJson } from '@/lib/storage';
import type { Customer } from '@/lib/types';
import { toast } from 'sonner';
import { Plus, Search, Pencil, Trash2, Download, X } from 'lucide-react';
import { CrudModal } from '@/components/CrudModal';
import { ConfirmDialog } from '@/components/ConfirmDialog';

const CustomersPage = () => {
  const [customers, setCustomers] = useState(() => getData<Customer>('customers'));
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [modal, setModal] = useState<{ open: boolean; item?: Customer }>({ open: false });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setCustomers(getData<Customer>('customers'));

  const filtered = customers.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || c.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const handleSave = (data: Record<string, string>) => {
    if (!data.name?.trim() || !data.email?.trim()) { toast.error('Name and email are required'); return; }
    if (modal.item) {
      updateData<Customer>('customers', modal.item.id, data as any);
      toast.success('Customer updated');
    } else {
      addItem('customers', { ...data, id: generateId(), status: data.status || 'active', createdAt: new Date().toISOString() } as Customer);
      toast.success('Customer added');
    }
    setModal({ open: false });
    refresh();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteData('customers', deleteId);
      toast.success('Customer deleted');
      setDeleteId(null);
      refresh();
    }
  };

  const fields = [
    { key: 'name', label: 'Name', required: true },
    { key: 'email', label: 'Email', type: 'email', required: true },
    { key: 'phone', label: 'Phone' },
    { key: 'company', label: 'Company' },
    { key: 'status', label: 'Status', type: 'select', options: ['active', 'inactive'] },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-foreground">Customers</h1>
        <div className="flex gap-2">
          <button onClick={() => exportToJson('customers')} className="flex items-center gap-1.5 px-3 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors">
            <Download className="w-4 h-4" /> Export
          </button>
          <button onClick={() => setModal({ open: true })} className="flex items-center gap-1.5 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">
            <Plus className="w-4 h-4" /> Add Customer
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search customers..."
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
        </div>
        <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Name</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden sm:table-cell">Email</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground hidden md:table-cell">Company</th>
                <th className="text-left px-4 py-3 font-medium text-muted-foreground">Status</th>
                <th className="text-right px-4 py-3 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(c => (
                <tr key={c.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium text-foreground">{c.name}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden sm:table-cell">{c.email}</td>
                  <td className="px-4 py-3 text-muted-foreground hidden md:table-cell">{c.company}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${c.status === 'active' ? 'bg-success/10 text-success' : 'bg-muted text-muted-foreground'}`}>
                      {c.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => setModal({ open: true, item: c })} className="p-1.5 text-muted-foreground hover:text-primary transition-colors">
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button onClick={() => setDeleteId(c.id)} className="p-1.5 text-muted-foreground hover:text-destructive transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">No customers found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CrudModal open={modal.open} onClose={() => setModal({ open: false })} onSave={handleSave}
        title={modal.item ? 'Edit Customer' : 'Add Customer'} fields={fields} initialData={modal.item as any} />
      <ConfirmDialog open={!!deleteId} onClose={() => setDeleteId(null)} onConfirm={handleDelete}
        title="Delete Customer" message="Are you sure you want to delete this customer?" />
    </div>
  );
};

export default CustomersPage;
