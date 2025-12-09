import { Link } from "react-router-dom";

export default function Layout({ children }) {
  return (
    <div className="min-h-screen bg-black text-white">
      <nav className="w-full bg-gray-900 p-4 flex justify-center space-x-8 border-b border-gray-700">
        <Link className="hover:text-green-400" to="/manual">Manual Mode</Link>
        <Link className="hover:text-blue-400" to="/auto">Automatic Mode</Link>
      </nav>

      <div className="p-6 max-w-4xl mx-auto">
        {children}
      </div>
    </div>
  );
}
