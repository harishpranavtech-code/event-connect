'use client';

import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { GraduationCap, LogOut, User } from 'lucide-react';

export default function Navbar() {
  const { user, logout, isAuthenticated } = useAuth();

  return (
    <nav className="bg-gray-900 border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <GraduationCap className="h-8 w-8 text-primary-500" />
              <span className="text-xl font-bold text-white">
                CampusConnect <span className="text-primary-500">Lite</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <Link
                  href="/login"
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md text-sm font-medium transition"
                >
                  Register
                </Link>
              </>
            ) : (
              <>
                <div className="flex items-center space-x-2">
                  <span className="text-gray-300 text-sm">{user?.name}</span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user?.role === 'admin'
                        ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                        : 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                    }`}
                  >
                    {user?.role}
                  </span>
                </div>
                <Link
                  href={user?.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition flex items-center space-x-1"
                >
                  <User className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>
                <button
                  onClick={logout}
                  className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm font-medium transition flex items-center space-x-1"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
