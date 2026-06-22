/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RefreshCw, Shield, Users, ToggleLeft, ToggleRight, Sparkles, AlertCircle, CheckCircle, Info } from 'lucide-react';

import { Appointment, Patient, ClinicStats } from './types';
import { INITIAL_APPOINTMENTS, INITIAL_PATIENTS, INITIAL_STATS } from './data/initialData';
import PatientPortal from './components/PatientPortal';
import DoctorDashboard from './components/DoctorDashboard';

export default function App() {
  // Navigation view switcher state
  const [activeView, setActiveView] = useState<'patient' | 'doctor'>('patient');

  // Shared state synchronized with localStorage
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [stats, setStats] = useState<ClinicStats>(INITIAL_STATS);

  // Toast system state
  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'info' | 'error';
    id: number;
  } | null>(null);

  // Load initial datasets from LocalStorage or fallbacks
  useEffect(() => {
    const cachedAppointments = localStorage.getItem('jaipur_health_appointments');
    const cachedPatients = localStorage.getItem('jaipur_health_patients');
    
    if (cachedAppointments) {
      setAppointments(JSON.parse(cachedAppointments));
    } else {
      setAppointments(INITIAL_APPOINTMENTS);
      localStorage.setItem('jaipur_health_appointments', JSON.stringify(INITIAL_APPOINTMENTS));
    }

    if (cachedPatients) {
      setPatients(JSON.parse(cachedPatients));
    } else {
      setPatients(INITIAL_PATIENTS);
      localStorage.setItem('jaipur_health_patients', JSON.stringify(INITIAL_PATIENTS));
    }
  }, []);

  // Save changes to LocalStorage whenever state modifies
  const saveAppointments = (apts: Appointment[]) => {
    setAppointments(apts);
    localStorage.setItem('jaipur_health_appointments', JSON.stringify(apts));
  };

  const savePatients = (pats: Patient[]) => {
    setPatients(pats);
    localStorage.setItem('jaipur_health_patients', JSON.stringify(pats));
  };

  // Toast notifier helper
  const showToast = (message: string, type: 'success' | 'info' | 'error') => {
    const id = Date.now();
    setToast({ message, type, id });
  };

  // Auto clear toasts
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Handle client adding an appointment request
  const handleAddAppointment = (newApt: Omit<Appointment, 'id' | 'status' | 'category' | 'initials'>) => {
    // Generate simple initials
    const nameParts = newApt.fullName.trim().split(/\s+/);
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (nameParts[0].slice(0, 2)).toUpperCase();

    // Dynamically categorize based on descriptive cues
    const reasonLower = newApt.reason.toLowerCase();
    let category = 'Initial Consultation';
    if (reasonLower.includes('asthma') || reasonLower.includes('breath') || reasonLower.includes('cough') || reasonLower.includes('wheez')) {
      category = 'Asthma Checkup';
    } else if (reasonLower.includes('test') || reasonLower.includes('spirometry') || reasonLower.includes('lung') || reasonLower.includes('breath test')) {
      category = 'Lung Function Test';
    } else if (reasonLower.includes('follow') || reasonLower.includes('again') || reasonLower.includes('regular') || reasonLower.includes('review')) {
      category = 'Follow-up';
    } else if (reasonLower.includes('diagnost') || reasonLower.includes('blood') || reasonLower.includes('urine') || reasonLower.includes('lab')) {
      category = 'Diagnostics Lab';
    }

    const createdAppointment: Appointment = {
      id: `apt-${Date.now()}`,
      fullName: newApt.fullName,
      phone: newApt.phone,
      date: newApt.date,
      timeSlot: newApt.timeSlot,
      reason: newApt.reason,
      status: 'PENDING',
      category,
      initials
    };

    const updatedApts = [createdAppointment, ...appointments];
    saveAppointments(updatedApts);

    // Dynamic Clinical Flow: Check if patient already exists in patient list.
    // If they do not, auto-register them in patients directory!
    const patientExists = patients.some(
      p => p.fullName.toLowerCase() === newApt.fullName.toLowerCase() || p.phone === newApt.phone
    );

    if (!patientExists) {
      const newPatientRecord: Patient = {
        id: `pat-${Date.now()}`,
        fullName: newApt.fullName,
        age: 35, // default estimated
        gender: 'Male', // default
        phone: newApt.phone,
        lastVisit: newApt.date,
        condition: category,
        status: 'Active'
      };
      const updatedPatients = [newPatientRecord, ...patients];
      savePatients(updatedPatients);
    }
  };

  // Confirm appointment from Doctor Board
  const handleConfirmAppointment = (id: string) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: 'CONFIRMED' as const };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast('Appointment confirmed! Pushed confirmation notification.', 'success');
  };

  // Deny / Cancel appointment from Doctor Board
  const handleCancelAppointment = (id: string) => {
    const updated = appointments.map(apt => {
      if (apt.id === id) {
        return { ...apt, status: 'CANCELLED' as const };
      }
      return apt;
    });
    saveAppointments(updated);
    showToast('Appointment session cancelled.', 'info');
  };

  // Register Patient Profile in Admin Dashboard
  const handleAddPatientFromDashboard = (newPatient: Omit<Patient, 'id'>) => {
    const record: Patient = {
      id: `pat-${Date.now()}`,
      ...newPatient
    };
    savePatients([record, ...patients]);
  };

  // Book consultative appointment from Admin Dashboard
  const handleAddAppointmentFromDashboard = (newApt: Omit<Appointment, 'id' | 'initials' | 'status'> & { category: string }) => {
    const nameParts = newApt.fullName.trim().split(/\s+/);
    const initials = nameParts.length > 1 
      ? (nameParts[0][0] + nameParts[nameParts.length - 1][0]).toUpperCase()
      : (nameParts[0].slice(0, 2)).toUpperCase();

    const record: Appointment = {
      id: `apt-${Date.now()}`,
      fullName: newApt.fullName,
      phone: newApt.phone,
      date: newApt.date,
      timeSlot: newApt.timeSlot,
      reason: newApt.reason,
      status: 'CONFIRMED', // Direct doctor appointment starts confirmed
      category: newApt.category,
      initials
    };

    saveAppointments([record, ...appointments]);

    // Also auto-register patient profile if needed
    const exists = patients.some(p => p.fullName.toLowerCase() === newApt.fullName.toLowerCase());
    if (!exists) {
      const recordPatient: Patient = {
        id: `pat-${Date.now()}`,
        fullName: newApt.fullName,
        age: 40,
        gender: 'Male',
        phone: newApt.phone,
        lastVisit: newApt.date,
        condition: newApt.category,
        status: 'On Treatment'
      };
      savePatients([recordPatient, ...patients]);
    }
  };

  return (
    <div className="relative">
      
      {/* Dynamic Views Rendering */}
      {activeView === 'patient' ? (
        <PatientPortal 
          onNavigateToDashboard={() => setActiveView('doctor')}
          onAddAppointment={handleAddAppointment}
          onShowToast={showToast}
        />
      ) : (
        <DoctorDashboard 
          appointments={appointments}
          patients={patients}
          stats={stats}
          onConfirmAppointment={handleConfirmAppointment}
          onCancelAppointment={handleCancelAppointment}
          onAddPatient={handleAddPatientFromDashboard}
          onAddAppointment={handleAddAppointmentFromDashboard}
          onNavigateToPatientView={() => setActiveView('patient')}
          onShowToast={showToast}
        />
      )}

      {/* Persistent floating view master switcher for seamless verification */}
      <div className="fixed bottom-6 right-6 z-50">
        <div className="flex items-center gap-2 bg-inverse-surface text-inverse-on-surface p-3 px-4.5 rounded-full shadow-lg border border-surface-container-highest flex-row select-none">
          <span className="text-[11px] font-black tracking-wider uppercase">Portal Switch:</span>
          <button 
            onClick={() => {
              const nextView = activeView === 'patient' ? 'doctor' : 'patient';
              setActiveView(nextView);
              showToast(`Switched view to ${nextView === 'patient' ? 'Patient Portal' : "Dr. Sharma's Dashboard"}`, 'success');
            }}
            className="flex items-center gap-1 bg-white hover:bg-surface text-on-surface text-[10px] font-extrabold p-1 px-3.5 rounded-full transition-colors truncate active:scale-95 border border-[#ededed]"
            title="Toggle between Patient website and Doctor records dashboard"
          >
            {activeView === 'patient' ? (
              <span className="flex items-center gap-1.5 font-bold">
                <Shield size={12} className="text-primary" /> View Doctor Dashboard
              </span>
            ) : (
              <span className="flex items-center gap-1.5 font-bold">
                <Users size={12} className="text-secondary" /> View Patient Site
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Floating Animated Toast Container */}
      <AnimatePresence>
        {toast && (
          <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 px-4 w-full max-w-sm">
            <motion.div
              initial={{ y: 20, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: -20, opacity: 0, scale: 0.9 }}
              className="bg-inverse-surface text-inverse-on-surface p-4 rounded-2xl shadow-2xl border border-surface-container-highest flex items-center gap-3"
            >
              <div className="shrink-0">
                {toast.type === 'success' && <CheckCircle size={18} className="text-emerald-500" />}
                {toast.type === 'info' && <Info size={18} className="text-sky-400" />}
                {toast.type === 'error' && <AlertCircle size={18} className="text-red-500" />}
              </div>
              <p className="text-xs font-semibold leading-relaxed leading-tight text-white flex-1">
                {toast.message}
              </p>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
