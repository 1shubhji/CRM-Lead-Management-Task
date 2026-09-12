'use client';

import React, { useState, useEffect } from 'react';
import { X, Send, User, Building, Mail, Phone, MapPin, Compass, Briefcase, AlertCircle } from 'lucide-react';
import { Lead, LeadStatus, Priority } from '../types/lead';

interface LeadFormModalProps {
  lead?: Lead | null;
  onClose: () => void;
  onSubmit: (leadData: any) => Promise<void>;
}

export default function LeadFormModal({ lead, onClose, onSubmit }: LeadFormModalProps) {
  const isEditMode = !!lead;

  // Form states
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [source, setSource] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [status, setStatus] = useState<LeadStatus>('New');
  const [priority, setPriority] = useState<Priority>('Medium');

  // Error states
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  // Populate form if in edit mode
  useEffect(() => {
    if (lead) {
      setName(lead.name || '');
      setCompany(lead.company || '');
      setPhone(lead.phone || '');
      setEmail(lead.email || '');
      setCity(lead.city || '');
      setSource(lead.source || '');
      setAssignedEmployee(lead.assignedEmployee || '');
      setStatus(lead.status || 'New');
      setPriority(lead.priority || 'Medium');
    }
  }, [lead]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Name check
    if (!name.trim()) {
      newErrors.name = 'Lead Name is required';
    }

    // Phone check
    const phoneTrim = phone.trim();
    if (!phoneTrim) {
      newErrors.phone = 'Phone Number is required';
    } else if (!/^\d{10}$/.test(phoneTrim)) {
      newErrors.phone = 'Phone Number must contain exactly 10 digits';
    }

    // Email check
    const emailTrim = email.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailTrim) {
      newErrors.email = 'Email Address is required';
    } else if (!emailRegex.test(emailTrim)) {
      newErrors.email = 'Email Address must be a valid email format';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setServerError(null);

    if (!validate()) {
      return;
    }

    setSubmitting(true);

    const payload = {
      name: name.trim(),
      company: company.trim() || undefined,
      phone: phone.trim(),
      email: email.trim(),
      city: city.trim() || undefined,
      source: source.trim() || undefined,
      assignedEmployee: assignedEmployee.trim() || undefined,
      status,
      priority,
    };

    try {
      await onSubmit(payload);
    } catch (err: any) {
      if (err.messages && Array.isArray(err.messages)) {
        // Field specific validation error from NestJS class-validator
        const validationErrors: Record<string, string> = {};
        err.messages.forEach((msg: string) => {
          if (msg.toLowerCase().includes('name')) validationErrors.name = msg;
          else if (msg.toLowerCase().includes('phone')) validationErrors.phone = msg;
          else if (msg.toLowerCase().includes('email')) validationErrors.email = msg;
          else if (msg.toLowerCase().includes('status')) validationErrors.status = msg;
          else if (msg.toLowerCase().includes('priority')) validationErrors.priority = msg;
          else setServerError(msg);
        });
        if (Object.keys(validationErrors).length > 0) {
          setErrors(validationErrors);
        }
      } else {
        setServerError(err.message || 'An unexpected error occurred. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 px-6 py-4.5 bg-slate-950/30">
          <div>
            <h3 className="text-lg font-bold text-slate-100">
              {isEditMode ? 'Modify Lead Details' : 'Register New Lead'}
            </h3>
            <p className="text-xs text-slate-450 mt-1">
              {isEditMode ? 'Update information for this customer lead' : 'Enter lead contact and status details'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-all cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Server Error Alert */}
        {serverError && (
          <div className="mx-6 mt-4 p-3.5 bg-rose-950/50 border border-rose-500/30 text-rose-350 text-xs rounded-xl flex items-center gap-2.5">
            <AlertCircle className="w-5 h-5 text-rose-400 flex-shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          {/* Main Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Lead Name */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-500" />
                <span>Lead Name <span className="text-indigo-400">*</span></span>
              </label>
              <input
                type="text"
                placeholder="John Doe"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={`w-full bg-slate-950/45 border ${
                  errors.name ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 ${
                  errors.name ? 'focus:ring-rose-500/10' : 'focus:ring-indigo-500/10'
                } transition-all`}
              />
              {errors.name && <span className="text-rose-450 text-2xs mt-1.5">{errors.name}</span>}
            </div>

            {/* Company Name */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-slate-500" />
                <span>Company Name</span>
              </label>
              <input
                type="text"
                placeholder="Acme Corp"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Email Address */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-500" />
                <span>Email Address <span className="text-indigo-400">*</span></span>
              </label>
              <input
                type="email"
                placeholder="john@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={`w-full bg-slate-950/45 border ${
                  errors.email ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 ${
                  errors.email ? 'focus:ring-rose-500/10' : 'focus:ring-indigo-500/10'
                } transition-all`}
              />
              {errors.email && <span className="text-rose-450 text-2xs mt-1.5">{errors.email}</span>}
            </div>

            {/* Phone Number */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-slate-500" />
                <span>Phone Number <span className="text-indigo-400">*</span></span>
              </label>
              <input
                type="text"
                placeholder="10-digit number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`w-full bg-slate-950/45 border ${
                  errors.phone ? 'border-rose-500' : 'border-slate-800 focus:border-indigo-500'
                } rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 ${
                  errors.phone ? 'focus:ring-rose-500/10' : 'focus:ring-indigo-500/10'
                } transition-all`}
              />
              {errors.phone && <span className="text-rose-450 text-2xs mt-1.5">{errors.phone}</span>}
            </div>

            {/* City */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>City</span>
              </label>
              <input
                type="text"
                placeholder="New York"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Lead Source */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-slate-500" />
                <span>Lead Source</span>
              </label>
              <input
                type="text"
                placeholder="Website, Referral, Social Media..."
                value={source}
                onChange={(e) => setSource(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Assigned Employee */}
            <div className="flex flex-col">
              <label className="text-xs font-semibold text-slate-400 mb-1.5 flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-slate-500" />
                <span>Assigned Employee</span>
              </label>
              <input
                type="text"
                placeholder="Emma Watson"
                value={assignedEmployee}
                onChange={(e) => setAssignedEmployee(e.target.value)}
                className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3.5 text-sm text-slate-200 placeholder-slate-550 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
              />
            </div>

            {/* Status & Priority Row */}
            <div className="grid grid-cols-2 gap-3">
              {/* Lead Status */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as LeadStatus)}
                  className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-sm text-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                >
                  <option value="New">New</option>
                  <option value="Contacted">Contacted</option>
                  <option value="Qualified">Qualified</option>
                  <option value="Proposal Sent">Proposal Sent</option>
                  <option value="Won">Won</option>
                  <option value="Lost">Lost</option>
                </select>
              </div>

              {/* Priority */}
              <div className="flex flex-col">
                <label className="text-xs font-semibold text-slate-400 mb-1.5 block">Priority</label>
                <select
                  value={priority}
                  onChange={(e) => setPriority(e.target.value as Priority)}
                  className="w-full bg-slate-950/45 border border-slate-800 focus:border-indigo-500 rounded-xl py-2 px-3 text-sm text-slate-350 focus:outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all cursor-pointer"
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3.5 border-t border-slate-800 mt-4 pt-5">
            <button
              type="button"
              onClick={onClose}
              disabled={submitting}
              className="py-2.5 px-5 rounded-xl border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-slate-200 text-sm font-semibold transition-all cursor-pointer disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-sm font-semibold py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg shadow-indigo-600/25 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Send className="w-4 h-4" />
              <span>{submitting ? 'Submitting...' : isEditMode ? 'Save Changes' : 'Register Lead'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
