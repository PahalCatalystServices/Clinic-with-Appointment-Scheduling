/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface Appointment {
  id: string;
  fullName: string;
  phone: string;
  date: string;
  timeSlot: string;
  reason: string;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  category: string;
  initials: string;
}

export interface Patient {
  id: string;
  fullName: string;
  age: number;
  gender: string;
  phone: string;
  lastVisit: string;
  condition: string;
  status: 'Active' | 'Recovered' | 'On Treatment';
}

export interface ClinicStats {
  totalBookings: number;
  pendingRequests: number;
  newPatients: number;
  bookingTrendPercentage: number;
}
