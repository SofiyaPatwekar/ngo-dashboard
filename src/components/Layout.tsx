"use client";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-gray-100">

      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg p-5 flex flex-col justify-between">
        <div>
          <h1 className="text-xl font-bold text-green-700 mb-6">
            NGO Command
          </h1>

          <nav className="space-y-4 text-gray-600">
            <p className="hover:text-green-600 cursor-pointer">Dashboard</p>
            <p className="hover:text-green-600 cursor-pointer">Map</p>
            <p className="hover:text-green-600 cursor-pointer">Volunteers</p>
            <p className="hover:text-green-600 cursor-pointer">Resources</p>
            <p className="hover:text-green-600 cursor-pointer">Insights</p>
          </nav>
        </div>

        <div className="text-sm text-gray-400">
          Help & Support
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 overflow-y-auto">
        {children}
      </div>

    </div>
  );
}