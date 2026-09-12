'use client';

import React, { useState, useEffect } from 'react';
import { ShieldAlert, Users, Sparkles, LogOut, CheckCircle, BarChart3, Database } from 'lucide-react';
import { Lead, PaginationMeta } from '../types/lead';
import { leadService } from '../services/leadService';
import LeadFilters from '../components/LeadFilters';
import LeadTable from '../components/LeadTable';
import LeadFormModal from '../components/LeadFormModal';
import Toast from '../components/Toast';

export default function Home() {
  // Query States
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [status, setStatus] = useState('');
  const [priority, setPriority] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [debouncedAssignedEmployee, setDebouncedAssignedEmployee] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);

  // Data States
  const [leads, setLeads] = useState<Lead[]>([]);
  const [meta, setMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [loading, setLoading] = useState(true);

  // UI States
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Debouncing Search Query
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset page on search
    }, 450);
    return () => clearTimeout(handler);
  }, [search]);

  // Debouncing Assigned Employee Filter
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedAssignedEmployee(assignedEmployee);
      setPage(1); // Reset page on filter
    }, 450);
    return () => clearTimeout(handler);
  }, [assignedEmployee]);

  // Reset page when dropdown filters change
  useEffect(() => {
    setPage(1);
  }, [status, priority]);

  // Fetch Leads on query change
  const fetchLeads = async () => {
    setLoading(true);
    try {
      const response = await leadService.getLeads({
        search: debouncedSearch,
        status: status || undefined,
        priority: priority || undefined,
        assignedEmployee: debouncedAssignedEmployee || undefined,
        sortBy,
        sortOrder,
        page,
        limit,
      });
      setLeads(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      showToast(err.message || 'Failed to fetch leads from server', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [debouncedSearch, status, priority, debouncedAssignedEmployee, sortBy, sortOrder, page]);

  const showToast = (message: string, type: 'success' | 'error') => {
    setToast({ message, type });
  };

  const handleClearFilters = () => {
    setSearch('');
    setStatus('');
    setPriority('');
    setAssignedEmployee('');
    setPage(1);
    showToast('Filters cleared successfully', 'success');
  };

  const handleCreateOrUpdateLead = async (leadData: any) => {
    if (selectedLead) {
      // Edit mode
      await leadService.updateLead(selectedLead.id, leadData);
      showToast('Lead details updated successfully!', 'success');
    } else {
      // Create mode
      await leadService.createLead(leadData);
      showToast('New lead registered successfully!', 'success');
    }
    setIsFormOpen(false);
    setSelectedLead(null);
    fetchLeads();
  };

  const handleDeleteLead = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead? This action cannot be undone.')) {
      try {
        await leadService.deleteLead(id);
        showToast('Lead deleted successfully', 'success');
        fetchLeads();
      } catch (err: any) {
        showToast(err.message || 'Failed to delete lead', 'error');
      }
    }
  };

  const handleEditClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsFormOpen(true);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'));
  };

  // Compute analytics stats for header cards
  const activeLeadsCount = leads.length;
  const highPriorityCount = leads.filter(l => l.priority === 'High').length;
  const wonLeadsCount = leads.filter(l => l.status === 'Won').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-indigo-500/30 selection:text-indigo-200">
      {/* Background Neon Gradients */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none -z-10"></div>
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-violet-500/10 blur-[100px] pointer-events-none -z-10"></div>

      {/* Navigation Header */}
      <header className="border-b border-slate-900 bg-slate-950/70 backdrop-blur-md sticky top-0 z-40 px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
            <Sparkles className="w-5.5 h-5.5 text-white" />
          </div>
          <div>
            <h1 className="text-md font-bold tracking-wide text-slate-100 flex items-center gap-2">
              <span>ApexCRM</span>
              <span className="text-3xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/35 px-1.5 py-0.5 rounded-md font-semibold tracking-normal uppercase">
                v1.0.0
              </span>
            </h1>
            <p className="text-3xs text-slate-500 font-medium">Enterprise Lead Pipeline</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-1 text-slate-400 text-xs font-semibold bg-slate-900/60 border border-slate-800/80 px-3 py-1.5 rounded-xl">
            <Database className="w-4 h-4 text-indigo-400" />
            <span>Connection: PostgreSQL 18 (Local)</span>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-6 lg:px-12 py-8 flex flex-col gap-6.5">
        {/* KPI Scorecards */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* Card 1: Total Leads */}
          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between hover:border-slate-800 transition-all">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Visible Leads</span>
              <span className="text-2xl font-bold text-slate-100 mt-1">{loading ? '...' : meta.total}</span>
              <span className="text-3xs text-slate-500 mt-1.5">Across all pipeline stages</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400">
              <Users className="w-6 h-6" />
            </div>
          </div>

          {/* Card 2: High Priority */}
          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between hover:border-slate-800 transition-all">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">High Priority</span>
              <span className="text-2xl font-bold text-rose-450 mt-1">{loading ? '...' : highPriorityCount}</span>
              <span className="text-3xs text-slate-500 mt-1.5">Needs immediate attention</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center text-rose-400">
              <ShieldAlert className="w-6 h-6" />
            </div>
          </div>

          {/* Card 3: Conversion won */}
          <div className="bg-slate-900/40 border border-slate-800/70 rounded-2xl p-5 backdrop-blur-sm flex items-center justify-between hover:border-slate-800 transition-all">
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Won Deals</span>
              <span className="text-2xl font-bold text-emerald-450 mt-1">{loading ? '...' : wonLeadsCount}</span>
              <span className="text-3xs text-slate-500 mt-1.5">Successfully closed pipeline cases</span>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
          </div>
        </section>

        {/* Filter component */}
        <LeadFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          priority={priority}
          setPriority={setPriority}
          assignedEmployee={assignedEmployee}
          setAssignedEmployee={setAssignedEmployee}
          onClear={handleClearFilters}
          onCreateClick={() => {
            setSelectedLead(null);
            setIsFormOpen(true);
          }}
        />

        {/* Table list component */}
        <LeadTable
          leads={leads}
          meta={meta}
          loading={loading}
          onPageChange={setPage}
          onEdit={handleEditClick}
          onDelete={handleDeleteLead}
          sortOrder={sortOrder}
          toggleSortOrder={toggleSortOrder}
        />
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 px-6 py-6 text-center text-xs text-slate-550 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 max-w-7xl w-full mx-auto">
        <p>© 2026 ApexCRM Lead Management. All rights reserved.</p>
        <p className="flex items-center justify-center gap-1.5 text-3xs text-slate-500">
          Built with Next.js 16 (App Router), NestJS, PostgreSQL & Prisma
        </p>
      </footer>

      {/* Lead Create/Edit Modal */}
      {isFormOpen && (
        <LeadFormModal
          lead={selectedLead}
          onClose={() => {
            setIsFormOpen(false);
            setSelectedLead(null);
          }}
          onSubmit={handleCreateOrUpdateLead}
        />
      )}

      {/* Success/Error Toast Alert */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}
