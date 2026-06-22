/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Stethoscope, 
  Wind, 
  Dna, 
  ChevronRight, 
  User, 
  Phone, 
  Calendar, 
  Clock, 
  MapPin, 
  Send, 
  CheckCircle, 
  Heart, 
  ShieldCheck, 
  AlertCircle,
  HelpCircle,
  X
} from 'lucide-react';
import { Appointment } from '../types';

interface PatientPortalProps {
  onNavigateToDashboard: () => void;
  onAddAppointment: (apt: Omit<Appointment, 'id' | 'status' | 'category' | 'initials'>) => void;
  onShowToast: (message: string, type: 'success' | 'info' | 'error') => void;
}

export default function PatientPortal({ 
  onNavigateToDashboard, 
  onAddAppointment, 
  onShowToast 
}: PatientPortalProps) {
  // Form state
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [preferredDate, setPreferredDate] = useState('');
  const [preferredTime, setPreferredTime] = useState('09:00 AM - 11:00 AM');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDoctorMenu, setShowDoctorMenu] = useState(false);

  // Modal state for service detail
  const [activeServiceModal, setActiveServiceModal] = useState<string | null>(null);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);

  // Help support simulation
  const [supportMessage, setSupportMessage] = useState('');
  const [showSupportModal, setShowSupportModal] = useState(false);

  const handleBookingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !phone || !preferredDate || !reason) {
      onShowToast('Please fill out all booking fields', 'error');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      onAddAppointment({
        fullName,
        phone,
        date: preferredDate,
        timeSlot: preferredTime,
        reason,
      });

      // Clear form
      setFullName('');
      setPhone('');
      setPreferredDate('');
      setReason('');
      setIsSubmitting(false);
      onShowToast('Appointment request sent to Dr. Sharma! Confirmation within 2 hours.', 'success');
      
      // Auto scroll to the notification indicator
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 1500);
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      onShowToast('Please enter a valid email address', 'error');
      return;
    }
    setNewsletterSubscribed(true);
    setNewsletterEmail('');
    onShowToast('Subscribed successfully to health updates!', 'success');
  };

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!supportMessage.trim()) return;
    onShowToast('Message saved. Quick support staff will contact you shortly!', 'success');
    setSupportMessage('');
    setShowSupportModal(false);
  };

  const servicesDetails = {
    general: {
      title: 'General Medicine',
      description: 'Holistic primary care and medical solutions designed for systemic wellbeing and preventative longevity.',
      details: [
        'Annual health checkups and biometric screenings.',
        'Hypertension, diabetes, and metabolic system tracking.',
        'Infectious disease cure protocols and recovery support.',
        'Elderly special care checks and nutritional balance guidance.',
        'Immunization programs for children and overseas travelers.'
      ],
      icon: Stethoscope,
      bg: 'bg-primary-fixed text-primary'
    },
    respiratory: {
      title: 'Respiratory Care',
      description: 'Advanced pulmonary interventions tackling Jaipur’s specific seasonal air conditions and environmental allergens.',
      details: [
        'Spirometry & complete pulmonary function examinations.',
        'Asthma and Chronic Obstructive Pulmonary Disease (COPD) treatment.',
        'Allergic bronchitis treatments tailored to seasonal pollen/smog indices.',
        'Nebulizer sessions and modern therapeutic inhaler training.',
        'Post-pulmonary infection rehab and strength recovery guidance.'
      ],
      icon: Wind,
      bg: 'bg-secondary-container text-on-secondary-container'
    },
    diagnostics: {
      title: 'Diagnostics & Pathology',
      description: 'In-house diagnostic suites engineered to supply high-fidelity medical imaging and rapid-turnaround blood assessments.',
      details: [
        'High-resolution digital radiology and ultrasound imaging.',
        'Comprehensive hematological assays and biochemistry trials.',
        'Allergy testing profiles targeting regional dust & pollen.',
        'Electrocardiography (ECG) and arterial gas testing.',
        'Digital reports sent directly to patient WhatsApp and portal within 1 hour.'
      ],
      icon: Dna,
      bg: 'bg-tertiary-fixed text-on-tertiary-fixed'
    }
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen">
      {/* Top Banner Alert (Simulated Patient notice) */}
      <div className="bg-secondary text-white text-xs py-2 px-4 shadow-sm text-center font-medium flex items-center justify-center gap-2">
        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
        <span>Simulated Patient Portal. Click on the profile icon in the header or the bottom right toggle to view Dr. Sharma’s Admin Dashboard.</span>
      </div>

      {/* Header */}
      <header className="bg-white/95 backdrop-blur-md sticky top-0 w-full z-40 border-b border-surface-container-high shadow-xs">
        <nav className="flex justify-between items-center px-6 py-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">J</div>
            <span className="font-display text-xl font-extrabold text-primary tracking-tight">Jaipur Health</span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            <a href="#services" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">Services</a>
            <a href="#booking" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">Book Appointment</a>
            <a href="#about-us" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200">About Us</a>
            <a href="#contact" className="text-on-surface-variant font-medium hover:text-secondary transition-colors duration-200 font-semibold text-secondary flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Open Now
            </a>
          </div>

          <div className="flex items-center gap-4 relative">
            {/* Account Circle as portal switcher trigger */}
            <div className="relative">
              <button 
                onClick={() => setShowDoctorMenu(!showDoctorMenu)}
                className="w-10 h-10 rounded-full bg-surface-container-high hover:bg-secondary-container hover:text-on-secondary-container text-on-surface-variant cursor-pointer flex items-center justify-center transition-all p-1 relative"
                title="Portal Settings"
              >
                <User size={20} />
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full border border-white"></span>
              </button>

              <AnimatePresence>
                {showDoctorMenu && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setShowDoctorMenu(false)} />
                    <motion.div 
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-surface-container-highest p-4 z-50"
                    >
                      <h4 className="font-semibold text-xs text-on-surface-variant uppercase tracking-widest mb-2">Portal Quick Switch</h4>
                      <div className="p-2.5 bg-surface rounded-lg mb-3">
                        <p className="font-bold text-sm text-primary">Dr. Sharma</p>
                        <p className="text-xs text-on-surface-variant">Respiratory Specialist</p>
                      </div>
                      <button 
                        onClick={() => {
                          setShowDoctorMenu(false);
                          onNavigateToDashboard();
                        }}
                        className="w-full bg-primary hover:bg-primary-container text-white text-xs py-2 px-3 rounded-lg font-bold flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                      >
                        Enter Doctor Dashboard
                      </button>
                      <div className="mt-3 pt-2.5 border-t border-surface-container text-[11px] text-on-surface-variant text-center">
                        Simulating unified clinic flow
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            <a 
              href="#booking"
              className="bg-secondary hover:bg-opacity-90 active:scale-95 text-white px-5 py-2 rounded-full text-xs font-semibold tracking-wide transition-all uppercase cursor-pointer"
            >
              Book Appointment
            </a>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="relative px-6 max-w-7xl mx-auto py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          <div className="md:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-secondary-container text-on-secondary-container text-xs font-bold shadow-xs">
              <span className="w-2.5 h-2.5 rounded-full bg-secondary animate-pulse" />
              <span>Now Accepting New Patients</span>
            </div>
            
            <h1 className="font-display text-4xl md:text-5xl font-extrabold text-on-surface leading-tight tracking-tight">
              Expert Healthcare in the <br />
              <span className="text-primary italic">Heart of Jaipur</span>
            </h1>
            
            <p className="text-base text-on-surface-variant leading-relaxed max-w-xl">
              Modern clinical resources meet warm, compassionate care. Experience elite respiratory diagnostic excellence and patient-first general medicine inside our serene clinic designed around your continuous comfort.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a 
                href="#booking"
                className="bg-primary hover:transform hover:scale-105 hover:shadow-lg hover:shadow-primary/20 text-white text-center py-4 px-8 rounded-2xl font-semibold transition-all shadow-md cursor-pointer"
              >
                Book Appointment
              </a>
              <a 
                href="#services"
                className="bg-surface-container-high hover:bg-surface-container-highest text-on-surface text-center py-4 px-8 rounded-2xl font-semibold transition-colors cursor-pointer"
              >
                Explore Services
              </a>
            </div>
          </div>

          <div className="md:col-span-6 relative">
            <div className="relative w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-2xl border-4 border-white">
              <img 
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover" 
                alt="Jaipur Health Modern Clinic Lobby"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDtDIi1r4mBJQFEkPLgvtchem99GGFi9Fu9-kL7ageOywsCORw4kJYdqAC1WRmyuRVa2CHz9znqHWN34oBerLUQHuXP__bFUXO5TS76HjwKQzfpu6sT6Sh8RB12wZI4ywxUmw32aJkae74s-4nW0kKonAKINR_z_AG-sd12WEbR75pXo9R50q75IhawrIUdu51D6wSfOZ4pNnLnZHfH3ylcImxPka6w4E70gxNSM5Rmy1RgwEZvxlTNmIWPANmRD27YEsJ1AAVfYaq-" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent" />
            </div>

            {/* Statistic Card overlay */}
            <motion.div 
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, type: 'spring' }}
              className="absolute -bottom-6 -left-4 md:-left-8 glass-card p-6 rounded-2xl shadow-xl max-w-[280px]"
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-secondary/10 rounded-full flex items-center justify-center shrink-0">
                  <span className="text-secondary font-bold text-lg">↑</span>
                </div>
                <div className="font-display font-black text-3xl text-primary">40%</div>
              </div>
              <p className="text-xs font-semibold text-on-surface leading-snug">
                Increase in regular patient bookings since launching our digital consultation home.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="bg-surface-container-low py-16 px-6" id="services">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col items-center text-center mb-12 space-y-3">
            <span className="text-secondary font-bold text-xs tracking-widest uppercase">Our Specializations</span>
            <h2 className="font-display text-3xl md:text-4xl font-extrabold text-on-surface">
              Comprehensive Care Tailored to You
            </h2>
            <div className="w-16 h-1 bg-primary rounded-full" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Service 1 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group border border-surface-container-high">
              <div>
                <div className="w-14 h-14 bg-primary-fixed text-primary rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Stethoscope size={28} />
                </div>
                <h3 className="font-display font-bold text-xl text-on-surface mb-3">General Medicine</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Family wellbeing and proactive prevention. General physical metrics evaluation, health maintenance planning, and diagnostic monitoring across all age demographics.
                </p>
              </div>
              <button 
                onClick={() => setActiveServiceModal('general')}
                className="inline-flex items-center text-primary text-xs font-bold hover:underline cursor-pointer align-self-start"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {/* Service 2 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group border border-surface-container-high">
              <div>
                <div className="w-14 h-14 bg-secondary-container text-on-secondary-container rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Wind size={28} />
                </div>
                <h3 className="font-display font-bold text-xl text-on-surface mb-3">Respiratory Care</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  Advanced treatment regimens targeted around local climate, allergies, and seasonal Jaipur environmental challenges. Specialist therapy for asthma, COPD, and recovery.
                </p>
              </div>
              <button 
                onClick={() => setActiveServiceModal('respiratory')}
                className="inline-flex items-center text-secondary text-xs font-bold hover:underline cursor-pointer align-self-start"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </button>
            </div>

            {/* Service 3 */}
            <div className="bg-white p-8 rounded-3xl shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group border border-surface-container-high">
              <div>
                <div className="w-14 h-14 bg-tertiary-fixed text-on-tertiary-fixed rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Dna size={28} />
                </div>
                <h3 className="font-display font-bold text-xl text-on-surface mb-3">Diagnostics</h3>
                <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                  State of the art in-house pathology and screening labs. Rapid response imaging and chemistry reports ensuring precision decision mapping for correct, faster recovery.
                </p>
              </div>
              <button 
                onClick={() => setActiveServiceModal('diagnostics')}
                className="inline-flex items-center text-tertiary font-bold text-xs hover:underline cursor-pointer align-self-start"
              >
                Learn more <ChevronRight size={16} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form and Contact Details Section */}
      <section className="py-16 px-6 max-w-7xl mx-auto" id="booking">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Appointment request panel */}
          <div className="lg:col-span-7 bg-white p-8 md:p-10 rounded-3xl shadow-sm border border-surface-container-high flex flex-col justify-between">
            <div>
              <h2 className="font-display text-2xl font-bold text-on-surface mb-1">Book Your Consultation</h2>
              <p className="text-on-surface-variant text-sm mb-6">
                Fill in the details below and we will analyze your case and confirm your slot within 2 hours.
              </p>
              
              <form onSubmit={handleBookingSubmit} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.0">
                    <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 ml-1">
                      <User size={13} className="text-secondary" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full p-3.5 bg-surface rounded-xl text-sm border-2 border-transparent focus:border-secondary focus:bg-white focus:outline-hidden transition-all placeholder-on-surface-variant/40"
                    />
                  </div>
                  <div className="space-y-1.0">
                    <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 ml-1">
                      <Phone size={13} className="text-secondary" /> Phone Number
                    </label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. +91 98765 43210"
                      className="w-full p-3.5 bg-surface rounded-xl text-sm border-2 border-transparent focus:border-secondary focus:bg-white focus:outline-hidden transition-all placeholder-on-surface-variant/40"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div className="space-y-1.0">
                    <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 ml-1">
                      <Calendar size={13} className="text-secondary" /> Preferred Date
                    </label>
                    <input 
                      type="date" 
                      value={preferredDate}
                      onChange={(e) => setPreferredDate(e.target.value)}
                      className="w-full p-3.5 bg-surface rounded-xl text-sm border-2 border-transparent focus:border-secondary focus:bg-white focus:outline-hidden transition-all text-on-surface"
                    />
                  </div>
                  <div className="space-y-1.0">
                    <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 ml-1">
                      <Clock size={13} className="text-secondary" /> Preferred Time
                    </label>
                    <select 
                      value={preferredTime}
                      onChange={(e) => setPreferredTime(e.target.value)}
                      className="w-full p-3.5 bg-surface rounded-xl text-sm border-2 border-transparent focus:border-secondary focus:bg-white focus:outline-hidden transition-all text-on-surface appearance-none"
                    >
                      <option value="09:00 AM - 11:00 AM">09:00 AM - 11:00 AM</option>
                      <option value="11:00 AM - 01:00 PM">11:00 AM - 01:00 PM</option>
                      <option value="04:00 PM - 06:00 PM">04:00 PM - 06:00 PM</option>
                      <option value="06:00 PM - 08:00 PM">06:00 PM - 08:00 PM</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.0">
                  <label className="text-xs font-semibold text-on-surface-variant flex items-center gap-1.5 ml-1">
                    Reason for Visit
                  </label>
                  <textarea 
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    placeholder="Briefly describe your symptoms, concern or medical background"
                    rows={3}
                    className="w-full p-3.5 bg-surface rounded-xl text-sm border-2 border-transparent focus:border-secondary focus:bg-white focus:outline-hidden resize-none transition-all placeholder-on-surface-variant/40"
                  />
                </div>

                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-4 px-6 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md disabled:opacity-75 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                      Registering Request...
                    </span>
                  ) : (
                    <>Confirm Appointment Request</>
                  )}
                </button>
              </form>
            </div>
          </div>

          {/* Map and contact cards panel */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            {/* Map image overlay with link */}
            <div className="rounded-3xl overflow-hidden shadow-xs relative flex-1 min-h-[260px] border border-surface-container-high group">
              <img 
                referrerPolicy="no-referrer"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCS4aIeFcMEVsm4EdFfxEmz16-YVD4PMAuQzALy6ooTVPPifg22V4GjVeMcNxR4jmNxNkT_6CpSTYHtUOe9uZeFtxL2jA-wbMOO6OlsE6xTNZUGd4omjTE2HoveCY6cfpk_QwwACxtkzj79xgTeQIPfKo24RMY41qVzaaHZxbBYq4yGW2IdgekSouCKKMALhLFNU-5ZUojFPH7RVu0C6DODsSVDBrOCU5_O1geKMzdAsFLEB13JYeTLoIKWCisTfmzu6h-G4H-BFl-n" 
                alt="Jaipur Health Map Location"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 absolute inset-0"
              />
              <div className="absolute inset-0 bg-black/5" />
              
              <div className="absolute top-4 left-4 glass-card px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 shadow-xs text-on-surface">
                <MapPin size={14} className="text-primary" />
                <span>Find us in Jaipur</span>
              </div>
            </div>

            {/* Direct Information panel */}
            <div className="bg-surface-container-highest/60 p-6 md:p-8 rounded-3xl border border-surface-container-high space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-surface-container-high">
                  <MapPin size={18} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">Clinic Address</h4>
                  <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">
                    Plot 42, Health Street, Near Pink City Plaza, Jaipur, Rajasthan 302001
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center shrink-0 shadow-xs border border-surface-container-high">
                  <Clock size={18} className="text-secondary" />
                </div>
                <div>
                  <h4 className="font-bold text-on-surface text-sm">Open Hours</h4>
                  <p className="text-on-surface-variant text-xs mt-0.5 leading-relaxed">
                    Mon - Sat: 09:00 AM - 08:00 PM <br />
                    Sundays: Closed (Emergency on call)
                  </p>
                </div>
              </div>

              <a 
                href="https://wa.me/910000000000" 
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => {
                  e.preventDefault();
                  onShowToast('Navigating to simulated client WhatsApp Chat...', 'success');
                }}
                className="flex items-center justify-center gap-2.5 w-full bg-[#25D366] text-white py-4 rounded-2xl font-semibold hover:shadow-lg transition-all text-sm cursor-pointer shadow-sm shadow-[#25d366]/20"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766 0-3.18-2.587-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-1.557-.519-2.79-1.608-1.02-.899-1.72-2.01-1.922-2.348-.202-.338-.021-.52.15-.691.153-.153.339-.395.508-.593.169-.197.226-.338.338-.564.113-.226.056-.423-.028-.592-.085-.17-.762-1.835-1.044-2.513-.275-.66-.554-.571-.762-.581l-.649-.011c-.226 0-.593.085-.903.423-.31.338-1.185 1.157-1.185 2.822 0 1.664 1.213 3.27 1.382 3.496s2.387 3.645 5.783 5.105c.808.348 1.439.555 1.931.711.812.259 1.553.222 2.138.134.653-.1 1.347-.551 1.536-1.085.188-.534.188-1.01.131-1.085s-.207-.123-.481-.259z" />
                </svg>
                <span>Chat on WhatsApp</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 bg-white border-t border-surface-container" id="about-us">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <span className="text-primary font-bold text-xs tracking-widest uppercase mb-1 block">Clinical Heritage</span>
              <h3 className="font-display text-2xl md:text-3xl font-extrabold text-on-surface mb-4">
                Jaipur’s Leading Specialists in Pulmonology & Preventive Medicine
              </h3>
              <p className="text-sm text-on-surface-variant leading-relaxed mb-6">
                Established over a decade ago, our modern C-Scheme respiratory clinic targets complex environmental breathing constraints with elite custom analytics. Led by Dr. Sharma, our goal is high physical resistance and quick respiratory strength restoring.
              </p>
              
              <div className="space-y-4">
                <div className="flex gap-3">
                  <ShieldCheck className="text-secondary shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-semibold text-sm text-on-surface">ISO Certified Clinical Space</h5>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Continuous HEPA filtration and pristine cleanliness conforming to international clinical standards.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Heart className="text-secondary shrink-0 mt-0.5" size={20} />
                  <div>
                    <h5 className="font-semibold text-sm text-on-surface">Precision Medication Delivery</h5>
                    <p className="text-xs text-on-surface-variant leading-relaxed">Custom treatments linked closely to your diagnostic biochemistry and respiratory volumes mapping.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-surface-container-low p-6 rounded-3xl border border-surface-container-high relative overflow-hidden">
              <h4 className="font-display font-bold text-lg text-on-surface mb-4 flex items-center gap-2">
                <HelpCircle size={20} className="text-primary" /> Frequently Asked Questions
              </h4>
              <div className="space-y-4 text-xs">
                <div className="p-4 bg-white rounded-2xl shadow-xs">
                  <p className="font-semibold text-on-surface mb-1">Do I need a prior appointment for lab tests?</p>
                  <p className="text-on-surface-variant">No, we support walk-in diagnostic collections, though booking online secures zero-waiting priority.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-xs">
                  <p className="font-semibold text-on-surface mb-1">How can I view my pathology reports?</p>
                  <p className="text-on-surface-variant">A secure, downloadable PDF report is automatically pushed to your registered mobile WhatsApp chat line within 1 hour of specimen retrieval.</p>
                </div>
                <div className="p-4 bg-white rounded-2xl shadow-xs">
                  <p className="font-semibold text-on-surface mb-1">Does Dr. Sharma perform video screenings?</p>
                  <p className="text-on-surface-variant">Yes! Initial discussions and regular prescription follow-ups can be conducted via our secure video portal.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-surface-container-highest text-on-surface border-t border-surface-container-highest py-16 px-6" id="contact">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
            {/* Column 1 */}
            <div className="md:col-span-4 space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-lg">J</div>
                <span className="font-display text-lg font-extrabold text-primary tracking-tight">Jaipur Health</span>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Elevating healthcare standards in the Pink City with state-of-the-art precision laboratory diagnostics and customized, compassionate respiratory care.
              </p>
              <div className="pt-2 text-xs text-on-surface-variant">
                <p className="font-bold">Contact emergency desk:</p>
                <p className="text-secondary font-semibold text-sm">+91 141 298 4301</p>
              </div>
            </div>

            {/* Column 2 */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="font-display font-extrabold text-xs text-primary uppercase tracking-widest">Quick Links</h4>
              <ul className="space-y-2 text-xs">
                <li><a href="#services" className="text-on-surface-variant hover:text-primary transition-colors">Find a Clinic</a></li>
                <li><a href="#booking" className="text-on-surface-variant hover:text-primary transition-colors">Emergency Registry</a></li>
                <li><a href="#about-us" className="text-on-surface-variant hover:text-primary transition-colors">Privacy Principles</a></li>
                <li><a href="#about-us" className="text-on-surface-variant hover:text-primary transition-colors">Terms of Care</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="md:col-span-2 space-y-3">
              <h4 className="font-display font-extrabold text-xs text-primary uppercase tracking-widest">Our Services</h4>
              <ul className="space-y-2 text-xs">
                <li><button onClick={() => setActiveServiceModal('respiratory')} className="text-on-surface-variant hover:text-primary transition-colors text-left cursor-pointer">Pulmonary Function</button></li>
                <li><button onClick={() => setActiveServiceModal('general')} className="text-on-surface-variant hover:text-primary transition-colors text-left cursor-pointer">Cardiac Screening</button></li>
                <li><button onClick={() => setActiveServiceModal('diagnostics')} className="text-on-surface-variant hover:text-primary transition-colors text-left cursor-pointer">Pathology Panel</button></li>
                <li><button onClick={() => setActiveServiceModal('general')} className="text-on-surface-variant hover:text-primary transition-colors text-left cursor-pointer">Flu Immunizations</button></li>
              </ul>
            </div>

            {/* Column 4 - Newsletter */}
            <div className="md:col-span-4 space-y-3">
              <h4 className="font-display font-extrabold text-xs text-primary uppercase tracking-widest">Wellness Newsletter</h4>
              <p className="text-xs text-on-surface-variant leading-relaxed">
                Receive proactive respiratory tips, pollen allergen counts, and general health news quarterly.
              </p>
              
              {newsletterSubscribed ? (
                <div className="p-3 bg-secondary-container text-on-secondary-container rounded-xl text-xs font-semibold flex items-center gap-2">
                  <CheckCircle size={16} /> Subscribed successfully!
                </div>
              ) : (
                <form onSubmit={handleNewsletterSubmit} className="flex gap-2">
                  <input 
                    type="email" 
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter email address"
                    className="flex-1 px-4 py-2.5 rounded-xl text-xs bg-white border border-surface-container-high focus:outline-hidden focus:border-primary text-on-surface"
                  />
                  <button 
                    type="submit" 
                    className="bg-primary hover:bg-primary-container text-white px-4 rounded-xl flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send size={15} />
                  </button>
                </form>
              )}
            </div>
          </div>

          <div className="mt-12 pt-8 border-t border-surface-container-high text-xs text-on-surface-variant flex flex-col md:flex-row justify-between items-center gap-4">
            <p>© 2026 Jaipur Health Excellence. All rights reserved.</p>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSupportModal(true)} 
                className="hover:text-primary font-semibold underline cursor-pointer"
              >
                Instant Support Box
              </button>
              <span>•</span>
              <button 
                onClick={onNavigateToDashboard} 
                className="hover:text-secondary font-semibold transition-all flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck size={14} /> Doctor Log In
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Service details Modal */}
      <AnimatePresence>
        {activeServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-xs" 
              onClick={() => setActiveServiceModal(null)} 
            />
            
            {(() => {
              const info = servicesDetails[activeServiceModal as keyof typeof servicesDetails];
              if (!info) return null;
              const IconComp = info.icon;
              return (
                <motion.div 
                  initial={{ scale: 0.9, y: 20, opacity: 0 }}
                  animate={{ scale: 1, y: 0, opacity: 1 }}
                  exit={{ scale: 0.9, y: 20, opacity: 0 }}
                  className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative z-10 border border-surface-container-high"
                >
                  <button 
                    onClick={() => setActiveServiceModal(null)}
                    className="absolute top-4 right-4 text-on-surface-variant hover:text-on-surface cursor-pointer p-1 rounded-full hover:bg-surface"
                  >
                    <X size={20} />
                  </button>

                  <div className="flex items-center gap-4 mb-4">
                    <div className={`p-3 rounded-2xl ${info.bg}`}>
                      <IconComp size={24} />
                    </div>
                    <h3 className="font-display font-extrabold text-xl text-on-surface">{info.title}</h3>
                  </div>

                  <p className="text-on-surface-variant text-sm leading-relaxed mb-6">
                    {info.description}
                  </p>

                  <h4 className="font-display font-bold text-xs uppercase tracking-wider text-secondary mb-3">Included Specialty Care Elements:</h4>
                  <ul className="space-y-3 mb-6">
                    {info.details.map((detail, idx) => (
                      <li key={idx} className="flex gap-2.5 text-xs text-on-surface-variant leading-relaxed">
                        <span className="text-secondary shrink-0 font-bold">✓</span>
                        <span>{detail}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex gap-3 justify-end">
                    <button 
                      onClick={() => setActiveServiceModal(null)}
                      className="px-4 py-2 bg-surface hover:bg-surface-container-high text-on-surface-variant rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      Close Details
                    </button>
                    <a 
                      href="#booking"
                      onClick={() => setActiveServiceModal(null)}
                      className="px-5 py-2 bg-primary hover:bg-primary-container text-white rounded-xl text-xs font-bold cursor-pointer transition-colors"
                    >
                      Book Specialty Slot
                    </a>
                  </div>
                </motion.div>
              );
            })()}
          </div>
        )}
      </AnimatePresence>

      {/* Support box modal */}
      <AnimatePresence>
        {showSupportModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60" 
              onClick={() => setShowSupportModal(false)} 
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl relative z-10 border border-surface-container-high"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-display font-bold text-lg text-on-surface">Instant Medical Help Support</h3>
                <button onClick={() => setShowSupportModal(false)} className="text-on-surface-variant hover:text-on-surface cursor-pointer">
                  <X size={18} />
                </button>
              </div>
              <p className="text-xs text-on-surface-variant leading-relaxed mb-4">
                Have a quick prescription inquiry or respiratory crisis question? Type it below and our administrative team will confirm response instantly.
              </p>
              <form onSubmit={handleSupportSubmit} className="space-y-4">
                <textarea 
                  rows={3}
                  value={supportMessage}
                  onChange={(e) => setSupportMessage(e.target.value)}
                  placeholder="Ask any direct concern or register quick clinic search help..."
                  className="w-full p-3 bg-surface rounded-xl text-xs border border-surface-container-highest focus:outline-hidden focus:border-secondary resize-none text-on-surface placeholder-on-surface-variant/40"
                />
                <button 
                  type="submit"
                  className="w-full bg-secondary hover:bg-secondary/90 text-white py-2.5 rounded-xl text-xs font-bold cursor-pointer"
                >
                  Submit Inquiry
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
