'use client';

import { useState, useEffect } from 'react';
import ProtectedRoute from '@/components/ProtectedRoute';
import api from '@/lib/api';
import { Calendar, MapPin, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

interface Event {
  _id: string;
  title: string;
  description: string;
  date: string;
  createdBy: {
    name: string;
  };
}

interface Registration {
  _id: string;
  event: Event;
  createdAt: string;
}

export default function StudentDashboard() {
  const [events, setEvents] = useState<Event[]>([]);
  const [registrations, setRegistrations] = useState<Registration[]>([]);
  const [loading, setLoading] = useState(true);
  const [registering, setRegistering] = useState<string | null>(null);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [eventsRes, registrationsRes] = await Promise.all([
        api.get('/events'),
        api.get('/register/my-registrations'),
      ]);

      setEvents(eventsRes.data.data);
      setRegistrations(registrationsRes.data.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (eventId: string) => {
    setRegistering(eventId);
    setMessage(null);

    try {
      await api.post(`/register/${eventId}`);
      setMessage({ type: 'success', text: 'Successfully registered for event!' });
      fetchData();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to register for event',
      });
    } finally {
      setRegistering(null);
    }
  };

  const handleCancelRegistration = async (eventId: string) => {
    if (!confirm('Are you sure you want to cancel this registration?')) return;

    try {
      await api.delete(`/register/${eventId}`);
      setMessage({ type: 'success', text: 'Registration cancelled successfully!' });
      fetchData();
    } catch (error: any) {
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Failed to cancel registration',
      });
    }
  };

  const isRegistered = (eventId: string) => {
    return registrations.some((reg) => reg.event._id === eventId);
  };

  if (loading) {
    return (
      <ProtectedRoute requiredRole="student">
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute requiredRole="student">
      <div className="min-h-screen py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Student Dashboard</h1>
            <p className="text-gray-400 mt-2">Browse and register for upcoming events</p>
          </div>

          {message && (
            <div
              className={`mb-6 rounded-lg p-4 flex items-start space-x-2 ${
                message.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/50'
                  : 'bg-red-500/10 border border-red-500/50'
              }`}
            >
              {message.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="h-5 w-5 text-red-400 flex-shrink-0 mt-0.5" />
              )}
              <p
                className={`text-sm ${
                  message.type === 'success' ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {message.text}
              </p>
            </div>
          )}

          {/* My Registered Events */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-white mb-4">My Registered Events</h2>
            {registrations.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-400">You haven't registered for any events yet.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {registrations.map((registration) => (
                  <div key={registration._id} className="card hover:border-green-500/50 transition">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-xl font-semibold text-white">
                        {registration.event.title}
                      </h3>
                      <CheckCircle className="h-5 w-5 text-green-400 flex-shrink-0" />
                    </div>
                    <p className="text-gray-400 text-sm mb-4">
                      {registration.event.description || 'No description available'}
                    </p>
                    <div className="flex items-center text-sm text-gray-400 mb-4">
                      <Calendar className="h-4 w-4 mr-2" />
                      {new Date(registration.event.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                    <button
                      onClick={() => handleCancelRegistration(registration.event._id)}
                      className="w-full btn-danger text-sm"
                    >
                      Cancel Registration
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* All Events */}
          <div>
            <h2 className="text-2xl font-bold text-white mb-4">All Events</h2>
            {events.length === 0 ? (
              <div className="card text-center py-8">
                <p className="text-gray-400">No events available at the moment.</p>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => {
                  const registered = isRegistered(event._id);
                  return (
                    <div
                      key={event._id}
                      className={`card transition ${
                        registered ? 'border-green-500/50' : 'hover:border-primary-500/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="text-xl font-semibold text-white">{event.title}</h3>
                        {registered && (
                          <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-full">
                            Registered
                          </span>
                        )}
                      </div>
                      <p className="text-gray-400 text-sm mb-4">
                        {event.description || 'No description available'}
                      </p>
                      <div className="flex items-center text-sm text-gray-400 mb-2">
                        <Calendar className="h-4 w-4 mr-2" />
                        {new Date(event.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </div>
                      <div className="flex items-center text-sm text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        Organized by {event.createdBy?.name || 'Admin'}
                      </div>
                      {!registered ? (
                        <button
                          onClick={() => handleRegister(event._id)}
                          disabled={registering === event._id}
                          className="w-full btn-primary disabled:opacity-50"
                        >
                          {registering === event._id ? 'Registering...' : 'Register'}
                        </button>
                      ) : (
                        <button
                          onClick={() => handleCancelRegistration(event._id)}
                          className="w-full btn-secondary"
                        >
                          Cancel Registration
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
