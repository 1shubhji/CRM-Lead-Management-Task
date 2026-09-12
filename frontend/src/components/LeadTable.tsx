'use client';

import React from 'react';
import { Edit2, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, Inbox } from 'lucide-react';
import { Lead, PaginationMeta } from '../types/lead';

interface LeadTableProps {
  leads: Lead[];
  meta: PaginationMeta;
  loading: boolean;
  onPageChange: (page: number) => void;
  onEdit: (lead: Lead) => void;
  onDelete: (id: string) => void;
  sortOrder: 'asc' | 'desc';
  toggleSortOrder: () => void;
}

export default function LeadTable({
  leads,
  meta,
  loading,
  onPageChange,
  onEdit,
  onDelete,
  sortOrder,
  toggleSortOrder,
}: LeadTableProps) {
  const getStatusBadgeStyles = (status: string) => {
    switch (status) {
      case 'New':
        return 'bg-blue-950/40 text-blue-400 border-blue-500/25';
      case 'Contacted':
        return 'bg-cyan-950/40 text-cyan-400 border-cyan-500/25';
      case 'Qualified':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/25';
      case 'Proposal Sent':
        return 'bg-violet-950/40 text-violet-400 border-violet-500/25';
      case 'Won':
        return 'bg-emerald-950/40 text-emerald-400 border-emerald-500/25';
      case 'Lost':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/25';
      default:
        return 'bg-slate-950/40 text-slate-400 border-slate-500/25';
    }
  };

  const getPriorityBadgeStyles = (priority: string) => {
    switch (priority) {
      case 'High':
        return 'bg-rose-950/40 text-rose-400 border-rose-500/25';
      case 'Medium':
        return 'bg-amber-950/40 text-amber-400 border-amber-500/25';
      case 'Low':
        return 'bg-slate-950/40 text-slate-400 border-slate-500/25';
      default:
        return 'bg-slate-950/40 text-slate-400 border-slate-500/25';
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl shadow-xl backdrop-blur-md overflow-hidden flex flex-col">
      {/* Table Container with custom scrollbar */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-left text-sm text-slate-300">
          <thead>
            <tr className="border-b border-slate-800/80 bg-slate-950/30 text-slate-400 font-medium">
              <th className="px-6 py-4.5">Lead Name</th>
              <th className="px-6 py-4.5">Company</th>
              <th className="px-6 py-4.5">Phone</th>
              <th className="px-6 py-4.5">Email</th>
              <th className="px-6 py-4.5">Status</th>
              <th className="px-6 py-4.5">Priority</th>
              <th className="px-6 py-4.5">Assigned Employee</th>
              <th className="px-6 py-4.5">
                <button
                  onClick={toggleSortOrder}
                  className="flex items-center gap-1.5 hover:text-slate-200 transition-colors cursor-pointer select-none"
                  title="Click to toggle created date sorting"
                >
                  <span>Created Date</span>
                  <ArrowUpDown className={`w-4 h-4 transition-transform duration-200 ${sortOrder === 'asc' ? 'rotate-180 text-indigo-400' : 'text-slate-400'}`} />
                </button>
              </th>
              <th className="px-6 py-4.5 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {loading ? (
              // Loading Skeleton
              Array.from({ length: meta.limit || 5 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-28"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-36"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-800 rounded-full w-20"></div></td>
                  <td className="px-6 py-4"><div className="h-6 bg-slate-800 rounded-full w-16"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-24"></div></td>
                  <td className="px-6 py-4"><div className="h-4 bg-slate-800 rounded w-20"></div></td>
                  <td className="px-6 py-4 text-right"><div className="h-8 bg-slate-800 rounded w-16 ml-auto"></div></td>
                </tr>
              ))
            ) : leads.length === 0 ? (
              // Empty State
              <tr>
                <td colSpan={9} className="px-6 py-20 text-center">
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div className="p-4 bg-slate-950/40 border border-slate-850 rounded-2xl text-slate-500 shadow-inner">
                      <Inbox className="w-10 h-10" />
                    </div>
                    <p className="text-slate-400 font-medium">No leads found</p>
                    <p className="text-xs text-slate-500 max-w-sm">Try adjusting your filters, clearing your search, or creating a new lead entity.</p>
                  </div>
                </td>
              </tr>
            ) : (
              // Lead Rows
              leads.map((lead) => (
                <tr
                  key={lead.id}
                  className="hover:bg-slate-800/20 transition-all duration-150 group"
                >
                  <td className="px-6 py-4 font-semibold text-slate-100 whitespace-nowrap">
                    {lead.name}
                  </td>
                  <td className="px-6 py-4 text-slate-350 max-w-[150px] truncate">
                    {lead.company || <span className="text-slate-650 italic text-xs">N/A</span>}
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-slate-350 whitespace-nowrap">
                    {lead.phone}
                  </td>
                  <td className="px-6 py-4 text-slate-350 max-w-[200px] truncate">
                    {lead.email}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadgeStyles(lead.status)}`}>
                      {lead.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border ${getPriorityBadgeStyles(lead.priority)}`}>
                      {lead.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-350 truncate max-w-[140px]">
                    {lead.assignedEmployee || <span className="text-slate-650 italic text-xs">Unassigned</span>}
                  </td>
                  <td className="px-6 py-4 text-slate-400 text-xs whitespace-nowrap">
                    {formatDate(lead.createdAt)}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2.5 opacity-80 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => onEdit(lead)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-650 border border-slate-700/60 hover:border-indigo-500/50 text-slate-400 hover:text-white transition-all cursor-pointer"
                        title="Edit Lead"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(lead.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/80 border border-slate-700/60 hover:border-rose-500/50 text-slate-400 hover:text-rose-400 transition-all cursor-pointer"
                        title="Delete Lead"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!loading && leads.length > 0 && (
        <div className="px-6 py-4 border-t border-slate-800/40 bg-slate-950/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="text-xs text-slate-450">
            Showing <span className="font-semibold text-slate-300">{(meta.page - 1) * meta.limit + 1}</span> to{' '}
            <span className="font-semibold text-slate-300">{Math.min(meta.page * meta.limit, meta.total)}</span> of{' '}
            <span className="font-semibold text-slate-300">{meta.total}</span> leads
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => onPageChange(meta.page - 1)}
              disabled={meta.page <= 1}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
              <span>Previous</span>
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: meta.totalPages }).map((_, index) => {
                const pageNum = index + 1;
                const isSelected = pageNum === meta.page;
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`w-7.5 h-7.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/25 border border-indigo-500'
                        : 'border border-transparent hover:border-slate-800 text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => onPageChange(meta.page + 1)}
              disabled={meta.page >= meta.totalPages}
              className="flex items-center gap-1.5 py-1.5 px-3 rounded-lg border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold disabled:opacity-40 disabled:hover:border-slate-800 disabled:hover:text-slate-400 transition-all cursor-pointer disabled:cursor-not-allowed"
            >
              <span>Next</span>
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
