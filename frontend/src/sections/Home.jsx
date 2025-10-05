// src/sections/Home.jsx
import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link } from "react-router-dom";
import hopeImage1 from "../assets/hope.png";
import hopeImage2 from "../assets/hope4.png";
import hopeImage3 from "../assets/hope5.png";
import hopeImage4 from "../assets/hope6.png";
import hopeImage5 from "../assets/hope7.png";
import saurabhPhoto from "../assets/my-photo.jpg";
import anujPhoto from "../assets/one.png";
import sudhanshuPhoto from "../assets/one2.png";
import supremeImage from "../assets/supreme.png"; // HopeHub symbol

const teamMembers = [
  {
    id: 1,
    name: "Saurabh Singh Rajput",
    role: "IIIT Bhagalpur · Web Dev & Agentic AI",
    description:
      "Designed the project and implemented the full web platform with AI integration for real-world impact.",
    photo: saurabhPhoto,
  },
  {
    id: 2,
    name: "Anuj Soni",
    role: "IIIT Bhagalpur · ML Expert",
    description:
      "Contributed machine learning expertise to make HopeHub intelligent and efficient.",
    photo: anujPhoto,
  },
  {
    id: 3,
    name: "Sudhanshu Shekhar",
    role: "IIIT Bhagalpur · Deep Learning",
    description:
      "Developed deep learning modules to power smart insights and decision-making.",
    photo: sudhanshuPhoto,
  },
];

const headingLines = [
  "HopeHub — Empowering the Future",
  "Where Kindness Meets Technology",
  "Connecting Donors, Volunteers, and Dreams",
  "Hope for the Young Generation",
  "Together We Create Change",
];

const hopeImages = [hopeImage1, hopeImage2, hopeImage3, hopeImage4, hopeImage5];

const backgroundGradients = [
  "bg-gradient-to-br from-indigo-900 via-gray-900 to-black",
  "bg-gradient-to-br from-purple-900 via-gray-900 to-indigo-900",
  "bg-gradient-to-br from-blue-900 via-gray-900 to-purple-900",
  "bg-gradient-to-br from-indigo-900 via-gray-900 to-blue-900",
];

export default function Home() {
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [activeHeadingIndex, setActiveHeadingIndex] = useState(0);
  const [activeHopeIndex, setActiveHopeIndex] = useState(0);
  const [activeBgIndex, setActiveBgIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [autoMode, setAutoMode] = useState(true); // Toggle for auto/manual

  const hopeRef = useRef(null);
  const teamRef = useRef(null);

  const handleMouseEnter = useCallback(() => setIsHovered(true), []);
  const handleMouseLeave = useCallback(() => setIsHovered(false), []);

  // Auto rotate animations with pause on hover and autoMode
  useEffect(() => {
    if (isHovered || !autoMode) return;

    const teamInterval = setInterval(
      () => setActiveTeamIndex((prev) => (prev + 1) % teamMembers.length),
      4000
    );
    const headingInterval = setInterval(
      () => setActiveHeadingIndex((prev) => (prev + 1) % headingLines.length),
      3500
    );
    const hopeInterval = setInterval(
      () => setActiveHopeIndex((prev) => (prev + 1) % hopeImages.length),
      3500
    );
    const bgInterval = setInterval(
      () => setActiveBgIndex((prev) => (prev + 1) % backgroundGradients.length),
      5000
    );

    return () => {
      clearInterval(teamInterval);
      clearInterval(headingInterval);
      clearInterval(hopeInterval);
      clearInterval(bgInterval);
    };
  }, [isHovered, autoMode]);

  // Entrance animation trigger
  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Manual rotation handlers
  const nextTeam = useCallback(() => setActiveTeamIndex((prev) => (prev + 1) % teamMembers.length), []);
  const prevTeam = useCallback(() => setActiveTeamIndex((prev) => (prev - 1 + teamMembers.length) % teamMembers.length), []);
  const nextHope = useCallback(() => setActiveHopeIndex((prev) => (prev + 1) % hopeImages.length), []);
  const prevHope = useCallback(() => setActiveHopeIndex((prev) => (prev - 1 + hopeImages.length) % hopeImages.length), []);

  // Swipe handlers
  const handleTouchStart = useCallback((e, setter, currentIndex) => {
    const touch = e.touches[0];
    e.target.setAttribute('data-touch-start', touch.clientX);
  }, []);

  const handleTouchMove = useCallback((e) => {
    if (e.touches.length > 1) return;
  }, []);

  const handleTouchEnd = useCallback((e, setter, currentIndex) => {
    const touch = e.changedTouches[0];
    const startX = parseInt(e.target.getAttribute('data-touch-start') || '0');
    const endX = touch.clientX;
    const diff = startX - endX;

    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        setter((prev) => (prev + 1) % (currentIndex === 'team' ? teamMembers.length : hopeImages.length));
      } else {
        setter((prev) => (prev - 1 + (currentIndex === 'team' ? teamMembers.length : hopeImages.length)) % (currentIndex === 'team' ? teamMembers.length : hopeImages.length));
      }
    }

    e.target.removeAttribute('data-touch-start');
  }, []);

  const TeamMemberCard = ({ member, isActive }) => (
    <div
      className={`flex flex-col lg:flex-row items-center lg:items-start gap-4 bg-gray-800/70 backdrop-blur-md rounded-2xl p-6 shadow-xl border border-yellow-400/30 hover:border-yellow-400/50 transition-all duration-500 ease-in-out hover:shadow-2xl ${
        isActive ? 'opacity-100 scale-100 translate-x-0' : 'opacity-0 scale-90 -translate-x-full'
      }`}
      style={{ transition: 'opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      role="article"
      aria-label={`${member.name}, ${member.role}`}
    >
      <img
        src={member.photo}
        alt={member.name}
        className="w-20 lg:w-24 h-20 lg:h-24 rounded-full object-cover border-2 border-yellow-400 shadow-lg flex-shrink-0 hover:scale-105 hover:rotate-3 transition-all duration-400 ease-out"
        loading="lazy"
      />
      <div className="text-center lg:text-left flex-1">
        <h3 className="text-lg lg:text-xl font-bold text-white mb-1 transition-all duration-300">
          {member.name}
        </h3>
        <p className="text-sm font-semibold text-yellow-300 mb-2 transition-all duration-300">{member.role}</p>
        <p className="text-sm text-gray-300 leading-relaxed transition-all duration-300">{member.description}</p>
      </div>
    </div>
  );

  const SlideshowContainer = ({ children, refObj, onNext, onPrev, currentIndex, itemsLength, type }) => (
    <div 
      ref={refObj}
      className="relative"
      onTouchStart={(e) => handleTouchStart(e, type === 'team' ? setActiveTeamIndex : setActiveHopeIndex, type)}
      onTouchEnd={(e) => handleTouchEnd(e, type === 'team' ? setActiveTeamIndex : setActiveHopeIndex, type)}
      onTouchMove={handleTouchMove}
    >
      {children}
      <button
        onClick={onPrev}
        className="absolute left-2 bottom-2 bg-yellow-400/90 hover:bg-yellow-500/90 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 ease-out opacity-100 z-20 hover:scale-110 backdrop-blur-sm border border-yellow-300/50"
        aria-label={`Previous ${type}`}
        style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
      >
        ←
      </button>
      <button
        onClick={onNext}
        className="absolute right-2 bottom-2 bg-yellow-400/90 hover:bg-yellow-500/90 text-gray-900 p-3 rounded-full shadow-lg transition-all duration-300 ease-out opacity-100 z-20 hover:scale-110 backdrop-blur-sm border border-yellow-300/50"
        aria-label={`Next ${type}`}
        style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
      >
        →
      </button>
    </div>
  );

  const toggleAutoMode = () => {
    setAutoMode(!autoMode);
    // Reset indices on toggle for smooth start
    setActiveHeadingIndex(0);
    setActiveHopeIndex(0);
    setActiveTeamIndex(0);
  };

  return (
    <>
      <section
        id="home"
        className={`min-h-screen flex flex-col lg:flex-row items-center justify-center relative overflow-hidden 
        text-white px-4 lg:px-12 py-10 transition-all duration-2000 ease-in-out ${backgroundGradients[activeBgIndex]}`}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        role="main"
        aria-label="HopeHub Home Page"
        style={{ transition: 'background 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
      >
        <img
          src={supremeImage}
          alt="HopeHub Symbol Background"
          className="supreme-bg pointer-events-none"
          aria-hidden="true"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,_#facc15_0%,_transparent_50%)] opacity-20 animate-pulse-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,_#6366f1_0%,_transparent_50%)] opacity-15 animate-pulse-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_#10b981_0%,_transparent_70%)] opacity-10 animate-pulse-slow delay-2000"></div>

        {/* Auto/Manual Toggle Button */}
        <button
          onClick={toggleAutoMode}
          className="fixed top-4 right-4 z-30 bg-yellow-400/90 hover:bg-yellow-500/90 text-gray-900 px-4 py-2 rounded-full shadow-lg transition-all duration-300 ease-out hover:scale-105 backdrop-blur-sm border border-yellow-300/50"
          aria-label={autoMode ? "Switch to Manual Mode" : "Switch to Auto Mode"}
          style={{ boxShadow: '0 0 20px rgba(251, 191, 36, 0.5)' }}
        >
          {autoMode ? "🔄 Auto" : "🖱️ Manual"}
        </button>

        <div className="flex-1 flex flex-col items-center lg:items-start justify-center gap-8 relative z-10 text-center lg:text-left w-full max-w-md lg:max-w-lg animate-slideInLeft">
          <div className={`flex items-center justify-center lg:justify-start gap-4 mb-4 transition-all duration-800 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
          }`}>
            <div className="heading-animate text-3xl lg:text-5xl xl:text-6xl font-extrabold text-yellow-300 leading-tight tracking-tight drop-shadow-lg flex-1 transition-all duration-700 ease-in-out">
              {headingLines[activeHeadingIndex]}
            </div>
          </div>

          <p className={`text-sm lg:text-lg text-gray-300 max-w-xl leading-relaxed transition-all duration-1000 ease-out transform ${
            isVisible ? 'translate-y-0 opacity-100 delay-200' : 'translate-y-8 opacity-0'
          }`}>
            A digital platform uniting <span className="text-yellow-300 font-semibold">donors</span>,{" "}
            <span className="text-yellow-300 font-semibold">volunteers</span>, and{" "}
            <span className="text-yellow-300 font-semibold">beneficiaries</span> to
            create a lasting social impact through technology and compassion.
          </p>

          <SlideshowContainer
            refObj={hopeRef}
            onNext={nextHope}
            onPrev={prevHope}
            currentIndex={activeHopeIndex}
            itemsLength={hopeImages.length}
            type="hope"
          >
            <div className="relative w-56 lg:w-80 xl:w-104 h-56 lg:h-80 xl:h-104 mt-6 rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-400/40 hover:border-yellow-400/60 transition-all duration-500 ease-in-out">
              {hopeImages.map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`HopeHub impact ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover rounded-3xl transition-all duration-1200 ease-in-out ${
                    index === activeHopeIndex 
                      ? 'opacity-100 scale-100' 
                      : 'opacity-0 scale-110'
                  }`}
                  loading="lazy"
                  style={{ transitionDelay: index === activeHopeIndex ? '0s' : '0s' }}
                />
              ))}
            </div>
          </SlideshowContainer>

          <div className={`bg-gray-800/70 backdrop-blur-lg rounded-3xl p-6 mt-6 shadow-xl w-full border border-gray-700/50 hover:border-gray-600/50 transition-all duration-500 ease-in-out transform ${
            isVisible ? 'translate-y-0 opacity-100 delay-400' : 'translate-y-8 opacity-0'
          }`}>
            <p className="text-sm lg:text-base text-gray-200 leading-relaxed transition-all duration-400 ease-out">
              HopeHub bridges the gap between generosity and need. Built with{" "}
              <span className="text-yellow-400 font-semibold">AI insights</span> and{" "}
              <span className="text-yellow-400 font-semibold">data transparency</span>, 
              it ensures that every donation and effort reaches where it truly matters.
            </p>
          </div>

          <div className={`flex flex-col sm:flex-row gap-4 mt-8 justify-center lg:justify-start transform ${
            isVisible ? 'translate-y-0 opacity-100 delay-600' : 'translate-y-8 opacity-0'
          }`} style={{ transition: 'opacity 1s ease-out, transform 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}>
            <Link
              to="/donor"
              className="bg-yellow-400 text-indigo-900 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-yellow-500/50 transition-all duration-400 ease-out text-base hover:scale-105 active:scale-95"
              aria-label="Donate Now"
            >
              Donate Now
            </Link>
            <Link
              to="/edu"
              className="bg-white text-indigo-700 font-bold px-8 py-3 rounded-full shadow-lg hover:shadow-indigo-300/50 transition-all duration-400 ease-out text-base hover:scale-105 active:scale-95"
              aria-label="Learn More"
            >
              Learn More
            </Link>
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center justify-center gap-6 mt-12 lg:mt-0 z-10 w-full max-w-md lg:max-w-lg animate-slideInRight">
          <div className="text-center mb-6 transform transition-all duration-1000 ease-out" style={{ transitionDelay: '0.2s' }}>
            <h2 className={`text-2xl lg:text-3xl font-bold text-white mb-2 transform transition-all duration-500 ease-in-out ${
              isVisible ? 'translate-y-0 opacity-100' : 'translate-y-5 opacity-0'
            }`}>Meet Our Team</h2>
            <p className={`text-sm text-gray-400 transform transition-all duration-500 ease-in-out ${
              isVisible ? 'translate-y-0 opacity-100 delay-100' : 'translate-y-5 opacity-0'
            }`}>Passionate creators driving change</p>
          </div>

          <SlideshowContainer
            refObj={teamRef}
            onNext={nextTeam}
            onPrev={prevTeam}
            currentIndex={activeTeamIndex}
            itemsLength={teamMembers.length}
            type="team"
          >
            <div className={`team-card-container overflow-hidden w-full max-w-sm transition-all duration-700 ease-in-out ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}>
              <TeamMemberCard 
                member={teamMembers[activeTeamIndex]} 
                isActive={true} 
              />
            </div>
          </SlideshowContainer>
        </div>
      </section>

      <style>{`
        .supreme-bg {
          position: absolute;
          top: -6vw;
          right: -6vw;
          width: 60vw;
          min-width: 400px;
          max-width: 90vw;
          height: 60vw;
          min-height: 400px;
          max-height: 90vw;
          opacity: 0.17;
          z-index: 2;
          pointer-events: none;
          object-fit: contain;
          object-position: top right;
          animation: supreme-float 12s ease-in-out infinite alternate, supreme-rotate 30s linear infinite;
          filter: blur(1px) drop-shadow(0 0 30px #facc15aa);
          transition: opacity 2s ease-in-out, transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @media (max-width: 900px) {
          .supreme-bg {
            width: 90vw;
            height: 50vw;
            min-width: 220px;
            min-height: 220px;
            right: -18vw;
            top: -12vw;
          }
        }
        @media (max-width: 600px) {
          .supreme-bg {
            width: 120vw;
            height: 60vw;
            min-width: 200px;
            min-height: 140px;
            right: -26vw;
            top: -22vw;
          }
        }
        @keyframes supreme-float {
          0% { transform: translateY(0) scale(1) rotate(0deg); }
          40% { transform: translateY(-15px) scale(1.04) rotate(2deg); }
          75% { transform: translateY(8px) scale(0.98) rotate(-1deg); }
          100% { transform: translateY(0) scale(1.06) rotate(0deg); }
        }
        @keyframes supreme-rotate {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slideInRight {
          from { opacity: 0; transform: translateX(50px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideInLeft { animation: slideInLeft 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        .animate-slideInRight { animation: slideInRight 0.7s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards; }
        @keyframes pulse-slow {
          0%, 100% { opacity: 0.2; }
          50% { opacity: 0.4; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 6s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .delay-1000 { animation-delay: 1s; }
        .delay-2000 { animation-delay: 2s; }
        .heading-animate {
          animation: fadeSlideUp 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .team-card-container > div {
          transition: opacity 0.6s ease-in-out, transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}