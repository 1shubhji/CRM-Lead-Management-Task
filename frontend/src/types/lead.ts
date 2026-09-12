export type LeadStatus = 'New' | 'Contacted' | 'Qualified' | 'Proposal Sent' | 'Won' | 'Lost';
export type Priority = 'High' | 'Medium' | 'Low';

export interface Lead {
  id: string;
  name: string;
  company: string | null;
  phone: string;
  email: string;
  city: string | null;
  source: string | null;
  assignedEmployee: string | null;
  status: LeadStatus;
  priority: Priority;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LeadsResponse {
  data: Lead[];
  meta: PaginationMeta;
}

export interface QueryParams {
  search?: string;
  status?: string;
  priority?: string;
  assignedEmployee?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
