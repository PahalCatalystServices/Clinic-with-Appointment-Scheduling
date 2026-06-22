/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Appointment, Patient, ClinicStats } from '../types';

export const INITIAL_APPOINTMENTS: Appointment[] = [
  {
    id: 'apt-1',
    fullName: 'Rajesh Jha',
    phone: '+91 98234 56789',
    date: '2024-10-24',
    timeSlot: '09:00 AM - 11:00 AM',
    reason: 'Frequent shortness of breath during seasonal change.',
    status: 'CONFIRMED',
    category: 'Asthma Checkup',
    initials: 'RJ'
  },
  {
    id: 'apt-2',
    fullName: 'Priya Kapoor',
    phone: '+91 97712 34567',
    date: '2024-10-24',
    timeSlot: '11:00 AM - 01:00 PM',
    reason: 'Initial respiratory consultation and general physical checkup.',
    status: 'PENDING',
    category: 'Initial Consultation',
    initials: 'PK'
  },
  {
    id: 'apt-3',
    fullName: 'Amit Sharma',
    phone: '+91 88123 45670',
    date: '2024-10-24',
    timeSlot: '11:00 AM - 01:00 PM',
    reason: 'Post-allergic response review, checking peak flow recovery.',
    status: 'CONFIRMED',
    category: 'Follow-up',
    initials: 'AS'
  },
  {
    id: 'apt-4',
    fullName: 'Neha Verma',
    phone: '+91 91234 87654',
    date: '2024-10-25',
    timeSlot: '11:00 AM - 01:00 PM',
    reason: 'Spirometry and complete Lung Function test.',
    status: 'CONFIRMED',
    category: 'Lung Function Test',
    initials: 'NV'
  }
];

export const INITIAL_PATIENTS: Patient[] = [
  {
    id: 'pat-1',
    fullName: 'Rajesh Jha',
    age: 45,
    gender: 'Male',
    phone: '+91 98234 56789',
    lastVisit: '2024-10-10',
    condition: 'Chronic Asthma',
    status: 'On Treatment'
  },
  {
    id: 'pat-2',
    fullName: 'Priya Kapoor',
    age: 29,
    gender: 'Female',
    phone: '+91 97712 34567',
    lastVisit: 'First Visit',
    condition: 'Acute Bronchitis',
    status: 'Active'
  },
  {
    id: 'pat-3',
    fullName: 'Amit Sharma',
    age: 34,
    gender: 'Male',
    phone: '+91 88123 45670',
    lastVisit: '2024-09-18',
    condition: 'Allergic Rhinitis',
    status: 'Recovered'
  },
  {
    id: 'pat-4',
    fullName: 'Neha Verma',
    age: 38,
    gender: 'Female',
    phone: '+91 91234 87654',
    lastVisit: '2024-10-01',
    condition: 'Post-COVID Recovery',
    status: 'On Treatment'
  },
  {
    id: 'pat-5',
    fullName: 'Vikram Singh',
    age: 52,
    gender: 'Male',
    phone: '+91 96543 21098',
    lastVisit: '2024-08-22',
    condition: 'COPD Mild',
    status: 'Active'
  }
];

export const INITIAL_STATS: ClinicStats = {
  totalBookings: 24,
  pendingRequests: 8,
  newPatients: 15,
  bookingTrendPercentage: 12
};
