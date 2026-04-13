export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

export interface Lead {
  id: string;
  name: string;
  source: string;
  status: 'new' | 'contacted' | 'closed';
  assignedTo: string;
  createdAt: string;
}

export interface Deal {
  id: string;
  title: string;
  customer: string;
  value: number;
  stage: 'discovery' | 'proposal' | 'negotiation' | 'won' | 'lost';
  createdAt: string;
}
