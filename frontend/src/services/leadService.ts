import { Lead, LeadsResponse, QueryParams } from '../types/lead';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class ApiError extends Error {
  status: number;
  messages: string[];

  constructor(status: number, message: string, messages?: string[]) {
    super(message);
    this.status = status;
    this.messages = messages || [message];
    Object.setPrototypeOf(this, ApiError.prototype);
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    let errorMessage = 'Something went wrong';
    let messages: string[] = [];

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
      if (Array.isArray(errorData.message)) {
        messages = errorData.message;
        errorMessage = messages[0];
      } else if (typeof errorData.message === 'string') {
        messages = [errorData.message];
      }
    } catch {
      // JSON parsing failed, keep default message
    }

    throw new ApiError(response.status, errorMessage, messages);
  }

  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

export const leadService = {
  async getLeads(params: QueryParams = {}): Promise<LeadsResponse> {
    const url = new URL(`${API_BASE_URL}/leads`);
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        url.searchParams.append(key, value.toString());
      }
    });

    const response = await fetch(url.toString(), {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      next: { revalidate: 0 }, // Disable server cache for real-time lead updates
    });

    return handleResponse<LeadsResponse>(response);
  },

  async getLeadById(id: string): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<Lead>(response);
  },

  async createLead(leadData: Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    return handleResponse<Lead>(response);
  },

  async updateLead(id: string, leadData: Partial<Omit<Lead, 'id' | 'createdAt' | 'updatedAt'>>): Promise<Lead> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(leadData),
    });

    return handleResponse<Lead>(response);
  },

  async deleteLead(id: string): Promise<{ success: boolean; message: string }> {
    const response = await fetch(`${API_BASE_URL}/leads/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return handleResponse<{ success: boolean; message: string }>(response);
  },
};
export { ApiError };
