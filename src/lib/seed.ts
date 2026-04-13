/** Seed demo data on first run */
import { getData, saveData, generateId } from './storage';
import type { Customer, Lead, Deal } from './types';

export function seedIfEmpty() {
  if (getData('customers').length === 0) {
    const customers: Customer[] = [
      { id: generateId(), name: 'Acme Corp', email: 'contact@acme.com', phone: '+1-555-0101', company: 'Acme Corp', status: 'active', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Globex Inc', email: 'info@globex.com', phone: '+1-555-0102', company: 'Globex Inc', status: 'active', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Initech LLC', email: 'hello@initech.com', phone: '+1-555-0103', company: 'Initech LLC', status: 'inactive', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Umbrella Co', email: 'sales@umbrella.co', phone: '+1-555-0104', company: 'Umbrella Co', status: 'active', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Wayne Enterprises', email: 'bruce@wayne.com', phone: '+1-555-0105', company: 'Wayne Enterprises', status: 'active', createdAt: new Date().toISOString() },
    ];
    saveData('customers', customers);
  }

  if (getData('leads').length === 0) {
    const leads: Lead[] = [
      { id: generateId(), name: 'Sarah Chen', source: 'Website', status: 'new', assignedTo: 'John', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Mike Johnson', source: 'Referral', status: 'contacted', assignedTo: 'Jane', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Emily Davis', source: 'LinkedIn', status: 'new', assignedTo: 'John', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Robert Wilson', source: 'Cold Call', status: 'closed', assignedTo: 'Jane', createdAt: new Date().toISOString() },
      { id: generateId(), name: 'Lisa Park', source: 'Website', status: 'contacted', assignedTo: 'John', createdAt: new Date().toISOString() },
    ];
    saveData('leads', leads);
  }

  if (getData('deals').length === 0) {
    const deals: Deal[] = [
      { id: generateId(), title: 'Enterprise License', customer: 'Acme Corp', value: 45000, stage: 'negotiation', createdAt: new Date().toISOString() },
      { id: generateId(), title: 'SaaS Migration', customer: 'Globex Inc', value: 28000, stage: 'proposal', createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Support Contract', customer: 'Wayne Enterprises', value: 12000, stage: 'won', createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Cloud Setup', customer: 'Umbrella Co', value: 35000, stage: 'discovery', createdAt: new Date().toISOString() },
      { id: generateId(), title: 'Data Analytics', customer: 'Initech LLC', value: 18000, stage: 'proposal', createdAt: new Date().toISOString() },
    ];
    saveData('deals', deals);
  }
}
