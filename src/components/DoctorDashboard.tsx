/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Calendar, 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Activity, 
  AlertCircle, 
  Settings, 
  LayoutDashboard, 
  LogOut, 
  Phone, 
  Plus, 
  Search, 
  FileText, 
  Download, 
  Lightbulb, 
  ChevronRight, 
  Heart, 
  UserPlus, 
  Sparkles,
  RefreshCw,
  X,
  MapPin,
  Check
} from 'lucide-react';
import { Appointment, Patient, ClinicStats } from '../types';

interface DoctorDashboardProps {
  appointments: Appointment[];
  patients: Patient[];
  stats: ClinicStats;
  onConfirmAppointment: (id: string) => void;
  onCancelAppointment: (id: string) => void;
  onAddPatient: (patient: Omit<Patient, 'id'>) => void;
  onAddAppointment: (apt: Omit<Appointment, 'id' | 'initials' | 'status'> & { category: string }) => void;
  onNavigateToPatientView: () => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function DoctorDashboard({
  appointments,
  patients,
  stats,
  onConfirmAppointment,
  onCancelAppointment,
  onAddPatient,
  onAddAppointment,
  onNavigateToPatientView,
  onShowToast
}: DoctorDashboardProps) {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<'dashboard' | 'appointments' | 'patients' | 'reports' | 'settings'>('dashboard');

  // Modal control states
  const [showAddPatientModal, setShowAddPatientModal] = useState(false);
  const [showAddConsultationModal, setShowAddConsultationModal] = useState(false);
  const [selectedAppointmentDetails, setSelectedAppointmentDetails] = useState<Appointment | null>(null);
  const [showReportModal, setShowReportModal] = useState(false);

  // New Patient Form state
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientGender, setPatientGender] = useState('Male');
  const [patientPhone, setPatientPhone] = useState('');
  const [patientCondition, setPatientCondition] = useState('');

  // New Consultation Form state
  const [aptName, setAptName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('09:00 AM - 11:00 AM');
  const [aptReason, setAptReason] = useState('');
  const [aptCategory, setAptCategory] = useState('Asthma Checkup');

  // Search filter states
  const [patientSearchQuery, setPatientSearchQuery] = useState('');
  const [appointmentSearchQuery, setAppointmentSearchQuery] = useState('');

  // Clinic settings mock state
  const [autoConfirm, setAutoConfirm] = useState(false);
  const [acceptingNew, setAcceptingNew] = useState(true);
  const [notificationVolume, setNotificationVolume] = useState('High');

  // Handle addition of patient from form
  const handleAddNewPatientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName || !patientAge || !patientPhone || !patientCondition) {
      onShowToast('Please fill all patient credentials', 'error');
      return;
    }

    onAddPatient({
      fullName: patientName,
      age: parseInt(patientAge) || 30,
      gender: patientGender,
      phone: patientPhone,
      lastVisit: new Date().toISOString().split('T')[0],
      condition: patientCondition,
      status: 'Active'
    });

    // Reset fields
    setPatientName('');
    setPatientAge('');
    setPatientPhone('');
    setPatientCondition('');
    setShowAddPatientModal(false);
    onShowToast(`Patient profile for ${patientName} registered successfully!`, 'success');
  };

  // Handle consultation addition from dashboard
  const handleAddConsultationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aptName || !aptPhone || !aptDate || !aptReason || !aptCategory) {
      onShowToast('Please supply all appointment constraints', 'error');
      return;
    }

    onAddAppointment({
      fullName: aptName,
      phone: aptPhone,
      date: aptDate,
      timeSlot: aptTime,
      reason: aptReason,
      category: aptCategory
    });

    // Reset fields
    setAptName('');
    setAptPhone('');
    setAptDate('');
    setAptReason('');
    setShowAddConsultationModal(false);
    onShowToast(`New session booked for ${aptName}! Status is set to CONFIRMED.`, 'success');
  };

  // Derived dashboard analytics
  const pendingCount = appointments.filter(a => a.status === 'PENDING').length;
  const confirmedTodayCount = appointments.filter(a => a.status === 'CONFIRMED' && a.date === '2024-10-24').length;

  return (
    <div className="bg-surface text-on-surface flex h-screen overflow-hidden font-sans">
      
      {/* Sidebar Navigation */}
      <aside className="h-full w-64 bg-surface-container-low border-r border-surface-container-high flex flex-col justify-between py-6 shrink-0">
        <div>
          {/* Brand header */}
          <div className="px-6 mb-8 flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">J</div>
            <span className="font-display font-extrabold text-lg text-primary tracking-tight">Jaipur Health</span>
          </div>

          {/* Profile Card */}
          <div className="px-4 mb-8">
            <div className="flex items-center gap-3 p-3 bg-surface-container rounded-xl border border-surface-container-high shadow-xs">
              <div className="w-10 h-10 rounded-full bg-secondary-fixed flex items-center justify-center text-on-secondary-fixed font-black">
                DS
              </div>
              <div className="overflow-hidden">
                <p className="font-semibold text-xs text-on-surface truncate">Dr. Sharma</p>
                <p className="text-[10px] text-on-surface-variant font-extrabold uppercase tracking-wider truncate">
                  Respiratory Center
                </p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 px-2">
            <button 
              onClick={() => setActiveTab('dashboard')}
              className={`w-full text-left rounded-xl px-4 py-3 font-semibold text-xs tracking-wide flex items-center gap-3.5 transition-all outline-hidden cursor-pointer ${
                activeTab === 'dashboard' 
                  ? 'bg-secondary-container text-on-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <LayoutDashboard size={18} />
              <span>Dashboard</span>
            </button>

            <button 
              onClick={() => setActiveTab('appointments')}
              className={`w-full text-left rounded-xl px-4 py-3 font-semibold text-xs tracking-wide flex items-center gap-3.5 transition-all outline-hidden cursor-pointer ${
                activeTab === 'appointments' 
                  ? 'bg-secondary-container text-on-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Calendar size={18} />
              <span>Appointments <span className="ml-auto inline-block px-2 py-0.5 rounded-full text-[10px] bg-primary text-white font-semibold">{pendingCount}</span></span>
            </button>

            <button 
              onClick={() => setActiveTab('patients')}
              className={`w-full text-left rounded-xl px-4 py-3 font-semibold text-xs tracking-wide flex items-center gap-3.5 transition-all outline-hidden cursor-pointer ${
                activeTab === 'patients' 
                  ? 'bg-secondary-container text-on-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Users size={18} />
              <span>Patients</span>
            </button>

            <button 
              onClick={() => setActiveTab('reports')}
              className={`w-full text-left rounded-xl px-4 py-3 font-semibold text-xs tracking-wide flex items-center gap-3.5 transition-all outline-hidden cursor-pointer ${
                activeTab === 'reports' 
                  ? 'bg-secondary-container text-on-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Activity size={18} />
              <span>Reports & Insights</span>
            </button>

            <button 
              onClick={() => setActiveTab('settings')}
              className={`w-full text-left rounded-xl px-4 py-3 font-semibold text-xs tracking-wide flex items-center gap-3.5 transition-all outline-hidden cursor-pointer ${
                activeTab === 'settings' 
                  ? 'bg-secondary-container text-on-secondary-container shadow-xs' 
                  : 'text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              <Settings size={18} />
              <span>Clinic Settings</span>
            </button>
          </nav>
        </div>

        {/* Sidebar Footer Buttons */}
        <div className="px-3 space-y-2">
          <button 
            onClick={() => setShowAddConsultationModal(true)}
            className="w-full bg-secondary hover:bg-secondary/90 active:scale-95 text-white py-3 px-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm text-xs uppercase"
          >
            <Plus size={16} />
            <span>New Consultation</span>
          </button>

          <button 
            onClick={() => {
              onShowToast('Connected to patient support gateway.', 'info');
            }}
            className="w-full text-left rounded-lg px-4 py-2 hover:bg-surface-container text-xs text-on-surface-variant flex items-center gap-2.5 transition-colors cursor-pointer"
          >
            <span>?</span>
            <span>Technical Support</span>
          </button>

          <button 
            onClick={onNavigateToPatientView}
            className="w-full text-left rounded-lg px-4 py-2 hover:bg-red-50 text-xs text-primary font-bold flex items-center gap-2.5 transition-all cursor-pointer"
          >
            <LogOut size={16} className="text-primary rotate-180" />
            <span>Logout / Exit Portal</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-surface p-6 md:p-8">
        
        {/* Dynamic header depending on Tab */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-extrabold text-on-surface tracking-tight">
              {activeTab === 'dashboard' && "Good Morning, Dr. Sharma"}
              {activeTab === 'appointments' && "Appointment Scheduler"}
              {activeTab === 'patients' && "Patient Directory"}
              {activeTab === 'reports' && "Operational Diagnostics"}
              {activeTab === 'settings' && "Clinic Rules Config"}
            </h1>
            <p className="text-sm text-on-surface-variant mt-1.5 leading-relaxed">
              {activeTab === 'dashboard' && "Here is a synchronized overview of your respiratory clinic today."}
              {activeTab === 'appointments' && "Confirm pending patient requests and review scheduled consulting hours."}
              {activeTab === 'patients' && "Check comprehensive histories and clinical status reports for all active files."}
              {activeTab === 'reports' && "Analyze diagnostic categories, peak seasonal flow summaries, and booking trends."}
              {activeTab === 'settings' && "Manage portal automation models, intake statuses, and clinical timings."}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="bg-surface-container-highest/60 text-on-surface px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-xs border border-surface-container-high">
              <Calendar size={14} className="text-secondary" />
              <span>Oct 24, 2024</span>
            </div>
            <button 
              onClick={() => {
                onShowToast('Syncing database entries in real-time...', 'info');
              }}
              className="p-2.0 bg-white hover:bg-surface rounded-xl border border-surface-container-high shadow-xs cursor-pointer text-on-surface-variant hover:text-secondary transition-colors"
              title="Refresh Clinic Sync"
            >
              <RefreshCw size={14} />
            </button>
          </div>
        </header>

        {/* Dynamic Tab Body renders */}
        <AnimatePresence mode="wait">
          {activeTab === 'dashboard' && (
            <motion.div 
              key="dashboard"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Dynamic Stats Row */}
              <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Stat 1 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container-high flex items-start justify-between">
                  <div>
                    <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Total Bookings Today</p>
                    <h3 className="font-display font-extrabold text-3xl text-on-surface">
                      {appointments.filter(a => a.date === '2024-10-24').length}
                    </h3>
                    <p className="text-secondary text-xs mt-3 flex items-center gap-1 font-bold">
                      <TrendingUp size={14} />
                      <span>+{stats.bookingTrendPercentage}% since morning</span>
                    </p>
                  </div>
                  <div className="bg-secondary-container/30 p-3.5 rounded-xl text-secondary shrink-0">
                    <Calendar size={20} />
                  </div>
                </div>

                {/* Stat 2 (Pending requests highlight) */}
                <div className={`bg-white p-6 rounded-3xl shadow-sm border-l-4 transition-all duration-300 flex items-start justify-between ${
                  pendingCount > 0 ? 'border-primary' : 'border-emerald-500'
                }`}>
                  <div>
                    <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">Pending Requests</p>
                    <h3 className={`font-display font-extrabold text-3xl ${pendingCount > 0 ? 'text-primary' : 'text-emerald-600'}`}>
                      {pendingCount < 10 ? `0${pendingCount}` : pendingCount}
                    </h3>
                    <p className={`text-xs mt-3 font-semibold ${pendingCount > 0 ? 'text-primary animate-pulse' : 'text-emerald-500'}`}>
                      {pendingCount > 0 ? "Requires immediate actions" : "Intake perfectly completed"}
                    </p>
                  </div>
                  <div className={`p-3.5 rounded-xl shrink-0 ${pendingCount > 0 ? 'bg-primary-fixed text-primary' : 'bg-emerald-100 text-emerald-600'}`}>
                    <AlertCircle size={20} />
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-surface-container-high flex items-start justify-between">
                  <div>
                    <p className="text-on-surface-variant text-xs font-semibold uppercase tracking-wider mb-1">New Patient Registrations</p>
                    <h3 className="font-display font-extrabold text-3xl text-on-surface">{patients.length}</h3>
                    <p className="text-secondary text-xs mt-3 flex items-center gap-1 font-bold">
                      <span>✓</span>
                      <span>Directory Active & Up to Date</span>
                    </p>
                  </div>
                  <div className="bg-tertiary-fixed text-on-tertiary-fixed p-3.5 rounded-xl shrink-0">
                    <Users size={20} />
                  </div>
                </div>
              </section>

              {/* Main Grid: Upcoming and side panel actions */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Column Left (Table) */}
                <section className="lg:col-span-8 bg-white rounded-3xl border border-surface-container-high shadow-xs overflow-hidden">
                  <div className="px-6 py-5 border-b border-surface-container-high flex justify-between items-center bg-white/50">
                    <h2 className="font-display font-bold text-lg text-on-surface">Upcoming Appointments Listed Today</h2>
                    <button 
                      onClick={() => setActiveTab('appointments')}
                      className="text-secondary hover:text-secondary-fixed-dim text-xs font-bold transition-all hover:underline cursor-pointer"
                    >
                      View All Scheduler
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-surface-container-low border-b border-surface-container-high">
                          <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Patient Details</th>
                          <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Time Slot</th>
                          <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant">Status</th>
                          <th className="px-6 py-3.5 text-[11px] font-bold uppercase tracking-wider text-on-surface-variant text-right">Operations Offered</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-surface-container-high">
                        {appointments.slice(0, 5).map((apt) => (
                          <tr key={apt.id} className="hover:bg-surface-container-low/30 transition-colors">
                            <td className="px-6 py-4.5">
                              <div className="flex items-center gap-3">
                                <div className="w-9 h-9 rounded-full bg-surface-container-high flex items-center justify-center font-bold text-secondary text-xs tracking-wider shrink-0">
                                  {apt.initials}
                                </div>
                                <div className="overflow-hidden">
                                  <p className="font-semibold text-xs text-on-surface truncate">{apt.fullName}</p>
                                  <p className="text-[10px] text-on-surface-variant truncate font-medium">{apt.category}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4.5 text-xs text-on-surface-variant font-medium">
                              {apt.timeSlot.split(' - ')[0]}
                            </td>
                            <td className="px-6 py-4.5">
                              {apt.status === 'CONFIRMED' ? (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] bg-secondary-container text-on-secondary-container font-black uppercase tracking-wider">
                                  Confirmed
                                </span>
                              ) : apt.status === 'PENDING' ? (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] bg-primary-fixed text-primary font-black uppercase tracking-wider animate-pulse">
                                  Pending
                                </span>
                              ) : (
                                <span className="inline-flex items-center px-3 py-0.5 rounded-full text-[10px] bg-surface-container-highest text-on-surface-variant font-black uppercase tracking-wider">
                                  Cancelled
                                </span>
                              )}
                            </td>
                            <td className="px-6 py-4.5 text-right">
                              {apt.status === 'PENDING' ? (
                                <div className="flex justify-end gap-1.5">
                                  <button 
                                    onClick={() => onCancelAppointment(apt.id)}
                                    className="p-1 px-2.5 bg-surface text-on-surface-variant hover:bg-red-50 hover:text-primary rounded-lg text-xs font-semibold transition-all cursor-pointer border border-surface-container-high"
                                  >
                                    Deny
                                  </button>
                                  <button 
                                    onClick={() => onConfirmAppointment(apt.id)}
                                    className="bg-primary hover:bg-primary-container text-white p-1 px-3.5 rounded-lg text-xs font-black transition-all cursor-pointer shadow-xs active:scale-95"
                                  >
                                    Confirm
                                  </button>
                                </div>
                              ) : (
                                <button 
                                  onClick={() => setSelectedAppointmentDetails(apt)}
                                  className="text-secondary border border-secondary hover:bg-secondary hover:text-white p-1 px-3.5 rounded-lg text-xs font-semibold transition-all cursor-pointer"
                                >
                                  Details
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                {/* Column Right (Widgets) */}
                <aside className="lg:col-span-4 space-y-6">
                  
                  {/* Quick operational actions */}
                  <div className="bg-white p-5 rounded-3xl border border-surface-container-high shadow-xs">
                    <h3 className="font-display font-bold text-sm text-on-surface mb-4">Quick Operational Actions</h3>
                    <div className="space-y-3">
                      <button 
                        onClick={() => setShowAddPatientModal(true)}
                        className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-secondary-container hover:text-on-secondary-container transition-all rounded-xl border border-surface-container shadow-xs group cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 border border-surface-container-high text-secondary group-hover:bg-white transition-colors">
                          <UserPlus size={16} />
                        </div>
                        <span className="font-semibold text-xs text-on-surface group-hover:text-current">Add New Patient Profile</span>
                      </button>

                      <button 
                        onClick={() => setShowReportModal(true)}
                        className="w-full flex items-center gap-3 p-3 bg-surface hover:bg-secondary-container hover:text-on-secondary-container transition-all rounded-xl border border-surface-container shadow-xs group cursor-pointer text-left"
                      >
                        <div className="w-9 h-9 rounded-full bg-white flex items-center justify-center shrink-0 border border-surface-container-high text-secondary group-hover:bg-white transition-colors">
                          <FileText size={16} />
                        </div>
                        <span className="font-semibold text-xs text-on-surface group-hover:text-current">Generate Clinic Report</span>
                      </button>
                    </div>
                  </div>

                  {/* Promotion updated files box */}
                  <div className="relative overflow-hidden rounded-3xl h-64 border border-surface-container-high shadow-xs group">
                    <img 
                      referrerPolicy="no-referrer"
                      alt="Jaipur Health Atmosphere Guideline Banner"
                      src="https://lh3.googleusercontent.com/aida-public/AB6AXuC5jQLXqfx-nRUD1wjpQtluv-QJsjS_ZL5v10W3KHVqZ8kc0Wuz0KNa2A0ajcNsv2YfNLFWcISmIcUh4X0vMRnA9ePDIfXRP91aMiYfEZxsXYJwzs-8IynOrRLz7pyTC9ph0vh2Aur9DhZp2Md6zus7Cc1xDTYbyhE9VVi1n88V4uyV776kcomwdXeiNtdDm9-EY67v70NrjBRC8rx6MnKWoDGfJwjhzhiuRIObSuwdxXSqTR2wltig9AMqEjj7EXkErGGYGVA6f_FL"
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
                    
                    <div className="absolute bottom-0 left-0 p-5 text-white space-y-2.5">
                      <p className="text-[9px] uppercase font-black tracking-widest text-secondary-container">Intake Standards</p>
                      <h4 className="font-display font-extrabold text-base leading-snug">Patient Care Guidelines Updated</h4>
                      <button 
                        onClick={() => {
                          onShowToast('Care guidelines downloaded to your systems! (Simulated)', 'success');
                        }}
                        className="bg-white text-primary hover:bg-surface hover:scale-[1.02] text-xs font-bold py-1.5 px-4 rounded-full active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Download size={13} />
                        <span>Download care.pdf</span>
                      </button>
                    </div>
                  </div>

                  {/* Dynamic health tip widget */}
                  <div className="bg-secondary-container text-on-secondary-container p-5 rounded-3xl border border-[#beece5] shadow-xs relative overflow-hidden">
                    <div className="relative z-10 space-y-2.5">
                      <div className="flex items-center gap-1.5">
                        <Lightbulb size={16} />
                        <span className="text-[10px] uppercase font-black tracking-widest">Medical Tip of the Season</span>
                      </div>
                      <p className="text-xs italic leading-relaxed">
                        "Encourage patients to monitor peak flow daily during the changing season in Jaipur to avoid acute respiratory episodes."
                      </p>
                    </div>
                  </div>

                </aside>
              </div>
            </motion.div>
          )}

          {activeTab === 'appointments' && (
            <motion.div 
              key="appointments"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-surface-container-high shadow-xs p-5 md:p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <h3 className="font-display font-bold text-lg text-on-surface">Integrated Scheduler Directory</h3>
                
                {/* Search and control filter */}
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-on-surface-variant" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search patient name, reasons..."
                      value={appointmentSearchQuery}
                      onChange={(e) => setAppointmentSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-surface text-xs text-on-surface placeholder-on-surface-variant/40 rounded-xl border border-surface-container focus:outline-hidden focus:border-secondary"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddConsultationModal(true)}
                    className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-xs"
                  >
                    <Plus size={14} /> Add Appt
                  </button>
                </div>
              </div>

              {/* Grid appointments list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {appointments.filter(apt => 
                  apt.fullName.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                  apt.category.toLowerCase().includes(appointmentSearchQuery.toLowerCase()) ||
                  apt.reason.toLowerCase().includes(appointmentSearchQuery.toLowerCase())
                ).map(apt => (
                  <div key={apt.id} className="p-4 rounded-2xl border border-surface-container-high bg-surface-container-lowest hover:border-secondary/20 hover:shadow-xs transition-all relative">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-container flex items-center justify-center font-bold text-xs text-secondary shrink-0">
                          {apt.initials}
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-on-surface leading-tight">{apt.fullName}</h4>
                          <p className="text-[10px] text-on-surface-variant font-semibold mt-0.5">{apt.category}</p>
                        </div>
                      </div>
                      
                      {apt.status === 'CONFIRMED' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-secondary-container text-on-secondary-container font-black uppercase">Confirmed</span>
                      ) : apt.status === 'PENDING' ? (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-primary-fixed text-primary font-black uppercase tracking-wider animate-pulse">Pending</span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full text-[9px] bg-surface-container-highest text-on-surface-variant font-black uppercase">Cancelled</span>
                      )}
                    </div>

                    <p className="text-xs text-on-surface-variant leading-relaxed line-clamp-2 mb-4 bg-surface p-2.5 rounded-xl border border-[#ededed]/50">
                      <strong>Concern:</strong> {apt.reason}
                    </p>

                    <div className="flex items-center justify-between text-[11px] text-on-surface-variant">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1">
                          <Calendar size={12} className="text-secondary" /> {apt.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock size={12} className="text-secondary" /> {apt.timeSlot.split(' - ')[0]}
                        </span>
                      </div>

                      <div className="flex gap-1">
                        {apt.status === 'PENDING' && (
                          <>
                            <button 
                              onClick={() => {
                                onCancelAppointment(apt.id);
                                onShowToast('Appointment cancelled.', 'info');
                              }}
                              className="px-2 py-1 bg-surface text-on-surface-variant hover:text-primary rounded-lg font-bold transition-all cursor-pointer"
                            >
                              Deny
                            </button>
                            <button 
                              onClick={() => onConfirmAppointment(apt.id)}
                              className="px-3 py-1 bg-secondary text-white rounded-lg font-bold hover:opacity-90 active:scale-95 transition-transform cursor-pointer"
                            >
                              Confirm
                            </button>
                          </>
                        )}
                        {apt.status === 'CONFIRMED' && (
                          <button 
                            onClick={() => setSelectedAppointmentDetails(apt)}
                            className="text-secondary hover:underline cursor-pointer font-bold"
                          >
                            Details
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'patients' && (
            <motion.div 
              key="patients"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-surface-container-high shadow-xs p-5 md:p-6"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                <div>
                  <h3 className="font-display font-bold text-lg text-on-surface">Registered Patient Profiles</h3>
                  <p className="text-xs text-on-surface-variant mt-1.0">Active records mapped in Jaipur Center registry.</p>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                  <div className="relative flex-1 sm:w-64">
                    <Search className="absolute left-3 top-2.5 text-on-surface-variant" size={16} />
                    <input 
                      type="text" 
                      placeholder="Search patient database..."
                      value={patientSearchQuery}
                      onChange={(e) => setPatientSearchQuery(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 bg-surface text-xs text-on-surface placeholder-on-surface-variant/40 rounded-xl border border-surface-container focus:outline-hidden focus:border-secondary"
                    />
                  </div>
                  <button 
                    onClick={() => setShowAddPatientModal(true)}
                    className="bg-secondary text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer hover:bg-secondary/90 transition-all shadow-xs"
                  >
                    <UserPlus size={14} /> Add Profile
                  </button>
                </div>
              </div>

              {/* Patient Directories list */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {patients.filter(pat => 
                  pat.fullName.toLowerCase().includes(patientSearchQuery.toLowerCase()) ||
                  pat.condition.toLowerCase().includes(patientSearchQuery.toLowerCase())
                ).map(pat => (
                  <div key={pat.id} className="p-5 rounded-2xl border border-surface-container-high bg-white hover:border-secondary/20 hover:shadow-md hover:shadow-secondary/5 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-secondary-container/50 text-on-secondary-container flex items-center justify-center font-bold text-xs shrink-0">
                        {pat.fullName[0]}{pat.fullName.split(' ')[1]?.[0] || pat.fullName[1] || ''}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-on-surface leading-tight">{pat.fullName}</h4>
                        <p className="text-[10px] text-on-surface-variant">{pat.gender}, {pat.age} years old</p>
                      </div>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Condition:</span>
                        <span className="font-semibold text-on-surface">{pat.condition}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Last Session:</span>
                        <span className="text-on-surface-variant">{pat.lastVisit}</span>
                      </div>
                      <div className="flex justify-between text-xs">
                        <span className="text-on-surface-variant">Intake Status:</span>
                        <span className={`font-bold uppercase text-[9px] ${
                          pat.status === 'Active' ? 'text-primary' : pat.status === 'Recovered' ? 'text-emerald-600' : 'text-blue-600'
                        }`}>{pat.status}</span>
                      </div>
                    </div>

                    <div className="pt-3.5 border-t border-surface-container flex justify-between items-center text-xs">
                      <a href={`tel:${pat.phone}`} className="text-secondary flex items-center gap-1.5 hover:underline font-semibold">
                        <Phone size={13} /> {pat.phone}
                      </a>
                      
                      <button 
                        onClick={() => {
                          const mockApt: Appointment = {
                            id: `sim-${pat.id}`,
                            fullName: pat.fullName,
                            phone: pat.phone,
                            date: pat.lastVisit === 'First Visit' ? '2024-10-24' : pat.lastVisit,
                            timeSlot: '09:00 AM - 11:00 AM',
                            reason: `Active clinical follow up on diagnosed condition: ${pat.condition}`,
                            status: 'CONFIRMED',
                            category: 'Follow-up',
                            initials: pat.fullName[0] + (pat.fullName.split(' ')[1]?.[0] || 'X')
                          };
                          setSelectedAppointmentDetails(mockApt);
                        }}
                        className="text-primary hover:underline cursor-pointer font-bold tracking-wide"
                      >
                        Clinical Summary
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {activeTab === 'reports' && (
            <motion.div 
              key="reports"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="space-y-6"
            >
              {/* Infographics graphics and trends */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
                
                {/* Seasonal Incident trend */}
                <div className="md:col-span-8 bg-white p-6 rounded-3xl border border-surface-container-high shadow-xs">
                  <div className="flex justify-between items-center mb-6">
                    <div>
                      <h4 className="font-display font-bold text-sm text-on-surface">Rajasthan Pulmonary Index Trends</h4>
                      <p className="text-xs text-on-surface-variant">Asthma & Allergic incidence volumes per season (Average 2024-2026)</p>
                    </div>
                    <span className="text-[10px] bg-secondary-container text-on-secondary-container font-black px-3 py-1 rounded-full uppercase">Pollen Level Match</span>
                  </div>

                  {/* Responsive inline SVG chart graph */}
                  <div className="relative w-full h-64 bg-surface rounded-2xl border border-surface-container-high p-4 flex flex-col justify-between">
                    <div className="flex h-48 items-end gap-3 px-2">
                      {/* Bar 1 */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-secondary-container rounded-t-lg transition-all duration-700" style={{ height: '40%' }}>
                          <div className="text-[9px] text-on-secondary-container font-bold text-center pt-1">40%</div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant truncate">Winter</span>
                      </div>
                      {/* Bar 2 */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary-container rounded-t-lg transition-all duration-700" style={{ height: '85%' }}>
                          <div className="text-[9px] text-white font-bold text-center pt-1">85%</div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant truncate">Spring (Smog)</span>
                      </div>
                      {/* Bar 3 */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-secondary-container rounded-t-lg transition-all duration-700" style={{ height: '25%' }}>
                          <div className="text-[9px] text-on-secondary-container font-bold text-center pt-1">25%</div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant truncate">Monsoons</span>
                      </div>
                      {/* Bar 4 */}
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-secondary-container rounded-t-lg transition-all duration-700" style={{ height: '55%' }}>
                          <div className="text-[9px] text-on-secondary-container font-bold text-center pt-1">55%</div>
                        </div>
                        <span className="text-[10px] font-bold text-on-surface-variant truncate">Autumn (Crop Dust)</span>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-surface-container-high text-[10px] text-on-surface-variant leading-relaxed italic text-center">
                      *Special warning: High humidity paired with spring wind currents increases regional particulate matter. Encourage daily preventative checks.
                    </div>
                  </div>
                </div>

                {/* Patient segmentation */}
                <div className="md:col-span-4 bg-white p-6 rounded-3xl border border-surface-container-high shadow-xs flex flex-col justify-between">
                  <div>
                    <h4 className="font-display font-bold text-sm text-on-surface mb-1">Diagnostic Breakdown</h4>
                    <p className="text-xs text-on-surface-variant mb-4">Patient category mapping</p>
                    
                    <div className="space-y-3.5">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                          <span>Asthma Treatment</span>
                          <span className="font-bold text-on-surface">62%</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5">
                          <div className="bg-primary h-1.5 rounded-full" style={{ width: '62%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                          <span>Allergic Bronchitis</span>
                          <span className="font-bold text-on-surface">24%</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5">
                          <div className="bg-secondary h-1.5 rounded-full" style={{ width: '24%' }}></div>
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-on-surface-variant font-medium">
                          <span>Wellness Screenings</span>
                          <span className="font-bold text-on-surface">14%</span>
                        </div>
                        <div className="w-full bg-surface-container rounded-full h-1.5">
                          <div className="bg-[#6a758a] h-1.5 rounded-full" style={{ width: '14%' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      onShowToast('Pulmonary category report exported successfully.', 'success');
                    }}
                    className="w-full bg-secondary hover:bg-secondary/90 text-white mt-6 py-2.5 rounded-xl font-bold text-xs uppercase"
                  >
                    Export Statistics File
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'settings' && (
            <motion.div 
              key="settings"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white rounded-3xl border border-surface-container-high shadow-xs p-5 md:p-6 max-w-2xl"
            >
              <h3 className="font-display font-bold text-lg text-on-surface mb-6">Portal Configuration</h3>
              
              <div className="space-y-6">
                
                {/* Toggle 1 */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-[#eceef0]">
                  <div>
                    <h5 className="font-bold text-xs text-on-surface">Auto-Confirmation Rule</h5>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Toggle auto confirmation for lab-tests and routine spirometry bookings.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAutoConfirm(!autoConfirm);
                      onShowToast(`Auto confirmation rule set to ${!autoConfirm ? 'ACTIVE' : 'INACTIVE'}`, 'info');
                    }}
                    className={`w-11 h-6 rounded-full p-1 transition-all outline-hidden cursor-pointer ${
                      autoConfirm ? 'bg-secondary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${
                      autoConfirm ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Toggle 2 */}
                <div className="flex items-center justify-between p-4 bg-surface rounded-2xl border border-[#eceef0]">
                  <div>
                    <h5 className="font-bold text-xs text-on-surface">Accepting New Patient Status</h5>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">Control the blinking intake status tracker on the public home segment.</p>
                  </div>
                  <button 
                    onClick={() => {
                      setAcceptingNew(!acceptingNew);
                      onShowToast(`Accepting new patient status updated to ${!acceptingNew ? 'ACTIVE' : 'INACTIVE'}`, 'info');
                    }}
                    className={`w-11 h-6 rounded-full p-1 transition-all outline-hidden cursor-pointer ${
                      acceptingNew ? 'bg-secondary' : 'bg-surface-container-highest'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-all ${
                      acceptingNew ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                {/* Toggle 3 */}
                <div className="space-y-2 p-4 bg-surface rounded-2xl border border-[#eceef0]">
                  <h5 className="font-bold text-xs text-on-surface">Alert Intake Volume</h5>
                  <p className="text-[11px] text-on-surface-variant leading-relaxed">Adjust sound intensity for urgent pending patient requests.</p>
                  <div className="flex gap-2 pt-2">
                    {['High', 'Medium', 'Silent'].map((vol) => (
                      <button 
                        key={vol}
                        onClick={() => {
                          setNotificationVolume(vol);
                          onShowToast(`System sound set to ${vol}`, 'success');
                        }}
                        className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          notificationVolume === vol 
                            ? 'bg-secondary text-white font-bold' 
                            : 'bg-white border border-surface-container text-on-surface-variant hover:bg-surface'
                        }`}
                      >
                        {vol}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Save button info banner */}
                <div className="pt-4 border-t border-surface-container flex items-center justify-between">
                  <p className="text-[10px] text-on-surface-variant italic">Configuration files are synchronized locally under Dr. Sharma secure instance.</p>
                  <button 
                    onClick={() => {
                      onShowToast('All settings committed to clinical drive storage.', 'success');
                      setActiveTab('dashboard');
                    }}
                    className="bg-primary hover:bg-primary-container text-white px-5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Save & Return to Dashboard
                  </button>
                </div>

              </div>
            </motion.div>
          )}
        </AnimatePresence>

      </main>

      {/* Add Patient Modal */}
      <AnimatePresence>
        {showAddPatientModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setShowAddPatientModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10 border border-surface-container-high"
            >
              <button 
                onClick={() => setShowAddPatientModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-full hover:bg-surface"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-secondary-container text-on-secondary-container rounded-xl">
                  <UserPlus size={20} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-on-surface">Register Patient Profile</h3>
              </div>

              <form onSubmit={handleAddNewPatientSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">FullName</label>
                  <input 
                    type="text" 
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="e.g. Vineet Kumar"
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant ml-1">Age</label>
                    <input 
                      type="number" 
                      value={patientAge}
                      onChange={(e) => setPatientAge(e.target.value)}
                      placeholder="e.g. 42"
                      className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant ml-1">Gender</label>
                    <select 
                      value={patientGender}
                      onChange={(e) => setPatientGender(e.target.value)}
                      className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Phone Connection</label>
                  <input 
                    type="tel" 
                    value={patientPhone}
                    onChange={(e) => setPatientPhone(e.target.value)}
                    placeholder="e.g. +91 91122 33445"
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Diagnosed Condition</label>
                  <input 
                    type="text" 
                    value={patientCondition}
                    onChange={(e) => setPatientCondition(e.target.value)}
                    placeholder="e.g. Chronic Asthma Step 2"
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3.5 rounded-xl text-xs font-bold transition-all mt-2 cursor-pointer shadow-md"
                >
                  Create Patient File
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Appointment/Consultation Modal */}
      <AnimatePresence>
        {showAddConsultationModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setShowAddConsultationModal(false)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, y: 15, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 15, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10 border border-surface-container-high"
            >
              <button 
                onClick={() => setShowAddConsultationModal(false)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-full hover:bg-surface"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3 mb-4">
                <div className="p-2.5 bg-primary-fixed text-primary rounded-xl">
                  <Calendar size={20} />
                </div>
                <h3 className="font-display font-extrabold text-lg text-on-surface">Book Direct Session</h3>
              </div>

              <form onSubmit={handleAddConsultationSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Patient Full Name</label>
                  <input 
                    type="text" 
                    value={aptName}
                    onChange={(e) => setAptName(e.target.value)}
                    placeholder="e.g. Ramesh Sharma"
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Phone Number</label>
                  <input 
                    type="tel" 
                    value={aptPhone}
                    onChange={(e) => setAptPhone(e.target.value)}
                    placeholder="e.g. +91 99887 76655"
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant ml-1">Date</label>
                    <input 
                      type="date" 
                      value={aptDate}
                      onChange={(e) => setAptDate(e.target.value)}
                      className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[11px] font-bold text-on-surface-variant ml-1">Time Slot</label>
                    <select 
                      value={aptTime}
                      onChange={(e) => setAptTime(e.target.value)}
                      className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Session Category</label>
                  <select 
                    value={aptCategory}
                    onChange={(e) => setAptCategory(e.target.value)}
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden"
                  >
                    <option value="Asthma Checkup">Asthma Checkup</option>
                    <option value="Initial Consultation">Initial Consultation</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Lung Function Test">Lung Function Test</option>
                    <option value="Cardiac Checkup">Cardiac Checkup</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-on-surface-variant ml-1">Symptomatic reason</label>
                  <textarea 
                    value={aptReason}
                    onChange={(e) => setAptReason(e.target.value)}
                    placeholder="Type specific pulmonary or medicine concern here..."
                    rows={2}
                    className="w-full p-3 bg-surface rounded-xl text-xs text-on-surface border border-transparent focus:border-secondary focus:bg-white focus:outline-hidden resize-none"
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-3.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-md mt-2"
                >
                  Create Session Request
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Appointment/Patient Detail modal */}
      <AnimatePresence>
        {selectedAppointmentDetails && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setSelectedAppointmentDetails(null)}
            />
            
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-sm w-full shadow-2xl relative z-10 border border-surface-container-high"
            >
              <button 
                onClick={() => setSelectedAppointmentDetails(null)}
                className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-full hover:bg-surface"
              >
                <X size={18} />
              </button>

              <div className="flex items-center gap-3.5 mb-5">
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container font-black text-xs rounded-xl flex items-center justify-center shrink-0">
                  {selectedAppointmentDetails.initials}
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-on-surface leading-tight">
                    {selectedAppointmentDetails.fullName}
                  </h4>
                  <p className="text-[10px] text-on-surface-variant font-bold uppercase tracking-wider mt-0.5">
                    {selectedAppointmentDetails.category}
                  </p>
                </div>
              </div>

              <div className="space-y-4 text-xs">
                <div className="p-3 bg-surface rounded-2xl border border-[#eceef0]/50 space-y-2">
                  <p className="text-on-surface-variant flex items-center gap-2">
                    <Calendar size={13} className="text-secondary" /> <strong>Appointment Date:</strong> {selectedAppointmentDetails.date}
                  </p>
                  <p className="text-on-surface-variant flex items-center gap-2">
                    <Clock size={13} className="text-secondary" /> <strong>Time:</strong> {selectedAppointmentDetails.timeSlot}
                  </p>
                  <p className="text-on-surface-variant flex items-center gap-2">
                    <Phone size={13} className="text-secondary" /> <strong>Contact phone:</strong> {selectedAppointmentDetails.phone}
                  </p>
                </div>

                <div className="space-y-1">
                  <h5 className="font-bold text-on-surface-variant text-[11px] uppercase tracking-wider ml-1">Clinical Signs / Concern</h5>
                  <p className="bg-surface p-3.5 rounded-2xl border border-[#eceef0]/50 text-on-surface-variant italic leading-relaxed">
                    "{selectedAppointmentDetails.reason}"
                  </p>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button 
                    onClick={() => {
                      onShowToast('Pushes digital prescription template to Doctor editor.', 'info');
                      setSelectedAppointmentDetails(null);
                    }}
                    className="flex-1 bg-secondary hover:bg-secondary/90 text-white py-2.5 rounded-xl font-bold transition-all text-[11px] uppercase tracking-wider cursor-pointer text-center"
                  >
                    Start consultation
                  </button>
                  <button 
                    onClick={() => setSelectedAppointmentDetails(null)}
                    className="px-4 py-2.5 bg-surface hover:bg-surface-container-high text-on-surface-variant rounded-xl font-semibold transition-all text-[11px] cursor-pointer"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Generate Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60" 
              onClick={() => setShowReportModal(false)}
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl relative z-10 border border-surface-container-high"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-on-surface">Generate Clinic Report</h3>
                <button onClick={() => setShowReportModal(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <X size={18} />
                </button>
              </div>

              <div className="space-y-4">
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  Select report parameters to compile. The built analytical PDF generator queries appointments, patients conditions, and Jaipur's seasonal allergy indexes automatically.
                </p>

                <div className="space-y-2">
                  <label className="text-[11px] font-bold text-on-surface-variant block uppercase tracking-wider ml-1">Metric Range</label>
                  <select className="w-full p-2.5 bg-surface text-xs text-on-surface rounded-xl border border-surface-container focus:outline-hidden">
                    <option>Today Overall (Oct 24, 2024)</option>
                    <option>Past Week summary</option>
                    <option>Monthly Pulmonary Index (October 2024)</option>
                  </select>
                </div>

                <div className="p-3.5 bg-surface rounded-2xl border border-[#eceef0] space-y-2.5 text-xs">
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Active Clinical Files:</span>
                    <span className="font-bold text-on-surface">{patients.length} patients</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Intake Confirmed:</span>
                    <span className="font-bold text-on-surface">{confirmedTodayCount} sessions</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-on-surface-variant">Urgent Pending alerts:</span>
                    <span className="font-bold text-primary">{pendingCount} requests</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-2">
                  <button 
                    onClick={() => {
                      onShowToast('Clinic status summary sheet downloaded!', 'success');
                      setShowReportModal(false);
                    }}
                    className="flex-1 bg-secondary text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    Download Compiled PDF
                  </button>
                  <button 
                    onClick={() => setShowReportModal(false)}
                    className="px-4 py-2.5 bg-surface text-on-surface-variant rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
