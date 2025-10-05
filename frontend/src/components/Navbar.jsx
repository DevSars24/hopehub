import { useState } from "react";
import { Link } from "react-router-dom";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 sticky top-0 z-50 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        {/* Logo */}
        <h1 className="text-2xl font-bold">HopeHub</h1>

        {/* Desktop Menu */}
        <ul className="hidden md:flex gap-6">
          <li><Link to="/" className="hover:text-yellow-400">Home</Link></li>
          <li><Link to="/skills" className="hover:text-yellow-400">Skill Dev</Link></li>
          <li><Link to="/food" className="hover:text-yellow-400">Nutrition Guidance</Link></li>
      
          <li><Link to="/health" className="hover:text-yellow-400">Health</Link></li>
          <li><Link to="/donor" className="hover:text-yellow-400">Donor</Link></li>
        </ul>

      
        <button
          className="md:hidden focus:outline-none text-2xl"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? "✖" : "☰"}
        </button>
      </div>

      
      {isOpen && (
        <ul className="md:hidden flex flex-col gap-6 py-6 bg-gray-700 rounded-lg mt-4">
          <li><Link to="/" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Home</Link></li>
          <li><Link to="/skills" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Skill Dev</Link></li>
          <li><Link to="/food" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Nutrition Guidance</Link></li>
        
          <li><Link to="/health" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Health</Link></li>
          <li><Link to="/donor" className="hover:text-yellow-400" onClick={() => setIsOpen(false)}>Donor</Link></li>
        </ul>
      )}
    </nav>
  );
}

