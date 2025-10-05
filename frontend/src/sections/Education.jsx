import { useState } from "react";

export default function Education() {
  const [formData, setFormData] = useState({ name: "", location: "" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Student Registered:", formData);
    setSubmitted(true);
    setFormData({ name: "", location: "" });
  };

  return (
    <section 
      id="edu" 
      className="py-20 px-6 bg-gradient-to-r from-teal-500 to-green-600 text-white" // New gradient
    >
      <h2 className="text-4xl font-extrabold text-center mb-6 drop-shadow-md">
        Educational Support
      </h2>
      <p className="max-w-3xl mx-auto text-center text-lg mb-10">
        We work to ensure every child has access to books, tutors, and schools.
        Volunteers collaborate with government initiatives to expand reach.
      </p>

      {/* Government Schemes & Impact */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
          <h4 className="text-xl font-semibold text-teal-600 mb-2">Scholarship Programs</h4>
          <p className="text-gray-700">Government scholarships ensure underprivileged students can continue education without financial stress.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
          <h4 className="text-xl font-semibold text-teal-600 mb-2">Digital Education</h4>
          <p className="text-gray-700">E-learning platforms and government initiatives provide digital access to quality education in rural areas.</p>
        </div>
        <div className="bg-white rounded-xl p-6 shadow-xl hover:shadow-2xl transition-shadow">
          <h4 className="text-xl font-semibold text-teal-600 mb-2">Skill Development</h4>
          <p className="text-gray-700">Welfare organizations like <span className="font-semibold text-green-700">Unnati (IIIT Bhagalpur)</span> provide mentorship and skill-based programs to students.</p>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-teal-600">200+</h3>
          <p className="text-gray-600">Students Benefited</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-teal-600">15+</h3>
          <p className="text-gray-600">Government Schemes Active</p>
        </div>
        <div className="bg-white shadow-lg rounded-xl p-6 text-center">
          <h3 className="text-2xl font-bold text-teal-600">10+</h3>
          <p className="text-gray-600">Partner Organizations</p>
        </div>
      </div>

      {/* Student Registration Form */}
      <div className="max-w-xl mx-auto bg-white bg-opacity-90 backdrop-blur-sm shadow-2xl rounded-xl p-8">
        <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">Register for Support</h3>
        {submitted && (
          <p className="text-green-600 font-semibold mb-4 text-center">
            Registration submitted successfully!
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Student Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Location</label>
            <input
              type="text"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 text-gray-800"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-green-700 transition-colors"
          >
            Register
          </button>
        </form>
      </div>
    </section>
  );
}
  