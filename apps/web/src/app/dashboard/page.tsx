'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import Navbar from '@/components/Navbar';
import { appointmentsAPI, patientsAPI, financialAPI } from '@/lib/api';

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, loadFromStorage } = useAuthStore();
  const [appointments, setAppointments] = useState([]);
  const [patients, setPatients] = useState([]);
  const [revenue, setRevenue] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFromStorage();
    if (!isAuthenticated && typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
      }
    }
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [appoRes, patRes, revRes] = await Promise.all([
          appointmentsAPI.list(),
          patientsAPI.list(),
          financialAPI.getRevenue(),
        ]);
        setAppointments(appoRes.data || []);
        setPatients(patRes.data || []);
        setRevenue(revRes.data?.totalRevenue || 0);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated || typeof window !== 'undefined' && localStorage.getItem('token')) {
      fetchData();
    }
  }, [isAuthenticated]);

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 font-semibold">Total Appointments</h2>
            <p className="text-3xl font-bold text-blue-600 mt-2">{appointments.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 font-semibold">Total Patients</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">{patients.length}</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-gray-600 font-semibold">Total Revenue</h2>
            <p className="text-3xl font-bold text-purple-600 mt-2">R$ {revenue.toFixed(2)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Appointments</h2>
            <div className="space-y-2">
              {appointments.slice(0, 5).map((apt: any) => (
                <div key={apt.id} className="border-b pb-2">
                  <p className="font-semibold text-gray-900">{apt.patient?.name}</p>
                  <p className="text-sm text-gray-600">{new Date(apt.startTime).toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Patients</h2>
            <div className="space-y-2">
              {patients.slice(0, 5).map((patient: any) => (
                <div key={patient.id} className="border-b pb-2">
                  <p className="font-semibold text-gray-900">{patient.name}</p>
                  <p className="text-sm text-gray-600">{patient.email}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
