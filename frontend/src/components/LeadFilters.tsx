'use client';

import React from 'react';
import { Plus, Search, RotateCcw, User, ShieldAlert, CheckSquare } from 'lucide-react';
import { LeadStatus, Priority } from '../types/lead';

interface LeadFiltersProps {
  search: string;
  setSearch: (val: string) => void;
  status: string;
  setStatus: (val: string) => void;
  priority: string;
  setPriority: (val: string) => void;
  assignedEmployee: string;
  setAssignedEmployee: (val: string) => void;
  onClear: () => void;
  onCreateClick: () => void;
}

export default function LeadFilters({
  search,
  setSearch,
  status,
  setStatus,
  priority,
  setPriority,
  assignedEmployee,
  setAssignedEmployee,
  onClear,
  onCreateClick,
}: LeadFiltersProps) {
  return (
    <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-6 backdrop-blur-md shadow-lg flex flex-col gap-5">
      {/* Top Section - Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-slate-100 tracking-wide">Leads Directory</h2>
          <p className="text-xs text-slate-400 mt-1">Manage and track your customer relationships in real-time</p>
        </div>
        <button
          onClick={onCreateClick}
          className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold py-2.5 px-5 rounded-xl transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-indigo-600/25 cursor-pointer"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Create New Lead</span>
        </button>
      </div>

      {/* Grid Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="relative">
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              type="text"
              placeholder="Name, email, phone, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
            />
          </div>
        </div>

        {/* Filter Status */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Lead Status</label>
          <div className="relative">
            <CheckSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Statuses</option>
              <option value="New" className="bg-slate-900">New</option>
              <option value="Contacted" className="bg-slate-900">Contacted</option>
              <option value="Qualified" className="bg-slate-900">Qualified</option>
              <option value="Proposal Sent" className="bg-slate-900">Proposal Sent</option>
              <option value="Won" className="bg-slate-900">Won</option>
              <option value="Lost" className="bg-slate-900">Lost</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
          </div>
        </div>

        {/* Filter Priority */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Priority</label>
          <div className="relative">
            <ShieldAlert className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
            <select
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
              className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all appearance-none cursor-pointer"
            >
              <option value="" className="bg-slate-900">All Priorities</option>
              <option value="High" className="bg-slate-900">High</option>
              <option value="Medium" className="bg-slate-900">Medium</option>
              <option value="Low" className="bg-slate-900">Low</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none border-l-4 border-r-4 border-t-4 border-transparent border-t-slate-500 w-0 h-0"></div>
          </div>
        </div>

        {/* Filter Assigned Employee */}
        <div>
          <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Assigned Employee</label>
          <div className="relative flex gap-2">
            <div className="relative flex-1">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input
                type="text"
                placeholder="Employee name..."
                value={assignedEmployee}
                onChange={(e) => setAssignedEmployee(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 pl-9 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>
            {/* Clear Button */}
            {(search || status || priority || assignedEmployee) && (
              <button
                onClick={onClear}
                title="Reset Filters"
                className="flex items-center justify-center p-2 rounded-xl bg-slate-850 hover:bg-slate-800 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-250 transition-all cursor-pointer"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
