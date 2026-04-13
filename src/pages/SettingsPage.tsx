import { toast } from 'sonner';
import { Trash2, Database } from 'lucide-react';

const SettingsPage = () => {
  const clearAll = () => {
    localStorage.removeItem('customers');
    localStorage.removeItem('leads');
    localStorage.removeItem('deals');
    toast.success('All data cleared. Refresh to re-seed demo data.');
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold text-foreground">Settings</h1>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Account</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Email</span>
            <span className="text-foreground">admin@crm.com</span>
          </div>
          <div className="flex justify-between py-2 border-b border-border">
            <span className="text-muted-foreground">Role</span>
            <span className="text-foreground">Administrator</span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-muted-foreground">Storage</span>
            <span className="text-foreground">LocalStorage</span>
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Data Management</h2>
        <p className="text-sm text-muted-foreground">All data is stored locally in your browser. Clearing data will remove all customers, leads, and deals.</p>
        <button onClick={clearAll} className="flex items-center gap-2 px-4 py-2 text-sm bg-destructive text-destructive-foreground rounded-lg hover:opacity-90 transition-opacity">
          <Trash2 className="w-4 h-4" /> Clear All Data
        </button>
      </div>
    </div>
  );
};

export default SettingsPage;
