import Link from 'next/link';
import { Calendar, Users, Award, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-600/20 to-purple-600/20 blur-3xl"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
              Welcome to{' '}
              <span className="bg-gradient-to-r from-primary-500 to-purple-500 bg-clip-text text-transparent">
                CampusConnect Lite
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Your all-in-one platform for managing college events. Students can discover
              and register for events, while admins have full control over event management.
            </p>
            <div className="flex justify-center space-x-4">
              <Link
                href="/register"
                className="bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200 flex items-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/login"
                className="bg-gray-700 hover:bg-gray-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
              >
                Login
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <h2 className="text-3xl font-bold text-center text-white mb-12">
          Why Choose CampusConnect?
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {/* Feature 1 */}
          <div className="card hover:border-primary-500/50 transition">
            <div className="flex justify-center mb-4">
              <div className="bg-primary-500/20 p-3 rounded-full">
                <Calendar className="h-8 w-8 text-primary-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              Easy Event Management
            </h3>
            <p className="text-gray-400 text-center">
              Admins can create, update, and manage events effortlessly with our intuitive
              dashboard interface.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="card hover:border-primary-500/50 transition">
            <div className="flex justify-center mb-4">
              <div className="bg-purple-500/20 p-3 rounded-full">
                <Users className="h-8 w-8 text-purple-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              Student Registration
            </h3>
            <p className="text-gray-400 text-center">
              Students can browse all events and register with just one click. Track your
              registered events easily.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="card hover:border-primary-500/50 transition">
            <div className="flex justify-center mb-4">
              <div className="bg-green-500/20 p-3 rounded-full">
                <Award className="h-8 w-8 text-green-400" />
              </div>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2 text-center">
              Role-Based Access
            </h3>
            <p className="text-gray-400 text-center">
              Secure authentication with separate dashboards for students and administrators.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="card bg-gradient-to-r from-primary-600/10 to-purple-600/10 border-primary-500/30 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Join CampusConnect Lite today and experience seamless event management for your
            college.
          </p>
          <Link
            href="/register"
            className="inline-block bg-primary-600 hover:bg-primary-700 text-white font-semibold px-8 py-3 rounded-lg transition duration-200"
          >
            Create Account
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-800 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <p className="text-center text-gray-400">
            © 2024 CampusConnect Lite. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
