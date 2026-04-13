/** LocalStorage CRUD utility */

export function getData<T>(key: string): T[] {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : [];
  } catch { return []; }
}

export function saveData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function addItem<T extends { id: string }>(key: string, item: T): void {
  const data = getData<T>(key);
  data.push(item);
  saveData(key, data);
}

export function updateData<T extends { id: string }>(key: string, id: string, updates: Partial<T>): void {
  const data = getData<T>(key);
  const idx = data.findIndex(d => d.id === id);
  if (idx !== -1) {
    data[idx] = { ...data[idx], ...updates };
    saveData(key, data);
  }
}

export function deleteData<T extends { id: string }>(key: string, id: string): void {
  const data = getData<T>(key);
  saveData(key, data.filter(d => d.id !== id));
}

export function generateId(): string {
  return crypto.randomUUID?.() ?? Math.random().toString(36).slice(2, 11);
}

export function exportToJson(key: string): void {
  const data = getData(key);
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${key}-export.json`;
  a.click();
  URL.revokeObjectURL(url);
}
