export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-gray-900 mb-6">
            Med-System
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Comprehensive Medical Clinic Automation Platform
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">📅 Appointments</h2>
              <p className="text-gray-600">Smart scheduling and conflict detection</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">🔔 Reminders</h2>
              <p className="text-gray-600">Automatic patient reminders and no-show tracking</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">💰 Financial</h2>
              <p className="text-gray-600">Invoice management and revenue analytics</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
