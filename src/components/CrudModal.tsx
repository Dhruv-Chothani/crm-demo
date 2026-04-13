import { useState, useEffect } from 'react';
import { X } from 'lucide-react';

interface Field {
  key: string;
  label: string;
  type?: string;
  required?: boolean;
  options?: string[];
}

interface CrudModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (data: Record<string, string>) => void;
  title: string;
  fields: Field[];
  initialData?: Record<string, any>;
}

export function CrudModal({ open, onClose, onSave, title, fields, initialData }: CrudModalProps) {
  const [form, setForm] = useState<Record<string, string>>({});

  useEffect(() => {
    if (open) {
      const init: Record<string, string> = {};
      fields.forEach(f => { init[f.key] = initialData?.[f.key]?.toString() || ''; });
      setForm(init);
    }
  }, [open, initialData]);

  if (!open) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-card border border-border rounded-xl w-full max-w-md shadow-xl animate-scale-in">
        <div className="flex items-center justify-between p-5 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          {fields.map(f => (
            <div key={f.key}>
              <label className="block text-sm font-medium text-foreground mb-1">{f.label}{f.required && ' *'}</label>
              {f.type === 'select' && f.options ? (
                <select value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring">
                  {f.options.map(o => <option key={o} value={o}>{o}</option>)}
                </select>
              ) : (
                <input type={f.type || 'text'} value={form[f.key] || ''} onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  required={f.required}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground" />
              )}
            </div>
          ))}
          <div className="flex justify-end gap-2 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm border border-border rounded-lg text-foreground hover:bg-muted transition-colors">Cancel</button>
            <button type="submit" className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-opacity">Save</button>
          </div>
        </form>
      </div>
    </div>
  );
}
