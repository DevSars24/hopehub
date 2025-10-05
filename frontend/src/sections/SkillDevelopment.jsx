// src/sections/SkillDevelopment.jsx
import React, { useState, useEffect } from "react";
import hope4 from "../assets/hope4.png";
import hope5 from "../assets/hope5.png";
import hope6 from "../assets/hope6.png";
import supreme from "../assets/supreme.png";

export default function SkillDevelopment() {
  const [profile, setProfile] = useState({ education: "", occupation: "", goal: "" });
  const [recommendations, setRecommendations] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState("en");
  const [typedText, setTypedText] = useState("");

  const languages = [
    { code: "en", name: "English" },
    { code: "hi", name: "हिंदी" },
  ];

  const translations = {
    en: {
      heading: "Personalized Skill Guidance",
      subtitle: "Get tailored recommendations for your skill journey (Powered by AI).",
      profileTitle: "Your Profile",
      educationLabel: "Highest Education Level",
      educationOptions: { "10th_pass": "10th Pass", "12th_pass": "12th Pass", diploma: "Diploma Holder", graduate: "Graduate" },
      occupationLabel: "Current Status",
      occupationOptions: { student: "Student", unemployed: "Unemployed", farmer: "Farmer", artisan: "Artisan / Craftsman" },
      goalLabel: "Your Main Goal",
      goalOptions: { army_police: "Join Army / Police", govt_job: "Get a Government Job", business: "Start a Small Business", modern_farming: "Learn Modern Farming", tech_skill: "Learn a Technical Skill" },
      button: "Get My Recommendations",
      loading: "Generating recommendations...",
      recTitle: "Recommended For You",
      profileSummary: "Based on your profile: {education}, {occupation}, aiming for {goal}",
      noRecommendations: "No recommendations available at the moment.",
      reset: "Reset Profile",
      selectLanguage: "Select Language",
    },
    hi: {
      heading: "व्यक्तिगत कौशल मार्गदर्शन",
      subtitle: "अपने कौशल के सफर के लिए अनुकूलित सुझाव प्राप्त करें (AI द्वारा संचालित)।",
      profileTitle: "आपका प्रोफ़ाइल",
      educationLabel: "उच्चतम शिक्षा स्तर",
      educationOptions: { "10th_pass": "10वीं पास", "12th_pass": "12वीं पास", diploma: "डिप्लोमा धारक", graduate: "स्नातक" },
      occupationLabel: "वर्तमान स्थिति",
      occupationOptions: { student: "छात्र", unemployed: "बेरोजगार", farmer: "किसान", artisan: "कारीगर / शिल्पकार" },
      goalLabel: "आपका मुख्य लक्ष्य",
      goalOptions: { army_police: "सेना / पुलिस में शामिल हों", govt_job: "सरकारी नौकरी प्राप्त करें", business: "छोटा व्यवसाय शुरू करें", modern_farming: "आधुनिक खेती सीखें", tech_skill: "एक तकनीकी कौशल सीखें" },
      button: "मेरी सिफारिशें प्राप्त करें",
      loading: "सिफारिशें उत्पन्न हो रही हैं...",
      recTitle: "आपके लिए अनुशंसित",
      profileSummary: "आपके प्रोफ़ाइल के आधार पर: {education}, {occupation}, {goal} का लक्ष्य",
      noRecommendations: "वर्तमान में कोई सुझाव उपलब्ध नहीं हैं।",
      reset: "प्रोफ़ाइल रीसेट करें",
      selectLanguage: "भाषा चुनें",
    },
  };

  const t = (key, params = {}) => {
    let lang = translations[currentLanguage] ? currentLanguage : "en";
    let text = key.split(".").reduce((o, i) => (o ? o[i] : null), translations[lang]);
    if (!text) return key;
    Object.keys(params).forEach((p) => { text = text.replace(`{${p}}`, params[p]); });
    return text;
  };

  // Typing animation effect
  useEffect(() => {
    const fullText = t("heading");
    setTypedText("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedText(fullText.slice(0, i + 1));
      i++;
      if (i >= fullText.length) clearInterval(interval);
    }, 100);
    return () => clearInterval(interval);
  }, [currentLanguage]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!profile.education || !profile.occupation || !profile.goal) {
      alert("⚠️ Please fill all fields!");
      return;
    }
    setLoading(true);
    setRecommendations(null);
    try {
      const res = await fetch("http://localhost:5000/api/skill-recommendations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile, language: currentLanguage }),
      });
      const data = await res.json();
      setRecommendations({
        summary: data.summary || t("profileSummary", {
          education: t(`educationOptions.${profile.education}`),
          occupation: t(`occupationOptions.${profile.occupation}`),
          goal: t(`goalOptions.${profile.goal}`),
        }),
      });
    } catch (err) {
      console.error(err);
      setRecommendations({
        summary: t("profileSummary", {
          education: t(`educationOptions.${profile.education}`),
          occupation: t(`occupationOptions.${profile.occupation}`),
          goal: t(`goalOptions.${profile.goal}`),
        }) + ". Explore local training options, build skills, and seek mentor guidance.",
      });
    } finally { setLoading(false); }
  };

  const handleReset = () => { setProfile({ education: "", occupation: "", goal: "" }); setRecommendations(null); };

  return (
    <section className="relative min-h-screen bg-gray-900 text-gray-100 flex flex-col items-center justify-center overflow-hidden px-6 py-16">
      {/* Background images */}
     {/* Background images: slightly moved inward */}
<img src={hope4} className="absolute top-10 left-10 w-64 opacity-15 pointer-events-none" alt="decor" />
<img src={hope5} className="absolute top-10 right-10 w-64 opacity-15 pointer-events-none" alt="decor" />
<img src={hope6} className="absolute bottom-10 left-10 w-64 opacity-15 pointer-events-none" alt="decor" />
<img src={supreme} className="absolute bottom-10 right-10 w-64 opacity-15 pointer-events-none" alt="logo" />


      <div className="relative z-10 w-full max-w-4xl">
        {/* Language Selector */}
        <div className="mb-8 text-center opacity-0 animate-fadeIn">
          <label className="block text-gray-300 mb-2 text-sm">{t("selectLanguage")}</label>
          <select
            value={currentLanguage}
            onChange={(e) => setCurrentLanguage(e.target.value)}
            className="p-3 rounded-lg bg-gray-800 text-gray-100 border border-gray-600 hover:border-yellow-400 transition shadow-sm"
          >
            {languages.map((lang) => <option key={lang.code} value={lang.code}>{lang.name}</option>)}
          </select>
        </div>

        {/* Animated Heading */}
        <h2 className="text-4xl md:text-6xl font-bold text-center text-yellow-400 mb-4 blur-sm animate-blurToClear">
          {typedText}
        </h2>
        <p className="text-gray-300 text-center text-lg md:text-xl mb-12 opacity-0 animate-fadeIn delay-500">{t("subtitle")}</p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gray-800/80 p-10 rounded-3xl shadow-xl space-y-8 opacity-0 animate-fadeIn delay-700">
          <h3 className="text-2xl font-semibold text-yellow-300 text-center">{t("profileTitle")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {["education", "occupation", "goal"].map((field) => (
              <div key={field}>
                <label className="block text-gray-300 mb-2 text-sm">{t(`${field}Label`)}</label>
                <select
                  name={field}
                  value={profile[field]}
                  onChange={handleInputChange}
                  className="w-full p-3 rounded-lg bg-gray-700 text-gray-100 border border-gray-600 hover:border-yellow-400 transition shadow-sm"
                >
                  <option value="">-- Select --</option>
                  {Object.entries(translations[currentLanguage]?.[`${field}Options`] || {}).map(([key, val]) => (
                    <option key={key} value={key}>{val}</option>
                  ))}
                </select>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <button type="submit" className="flex-1 bg-yellow-400 text-gray-900 font-bold py-3 rounded-xl hover:bg-yellow-300 transition transform hover:scale-105 shadow-lg" disabled={loading}>
              {loading ? "Loading..." : t("button")}
            </button>
            {recommendations && (
              <button type="button" onClick={handleReset} className="flex-1 bg-gray-700 text-gray-100 py-3 rounded-xl hover:bg-gray-600 transition transform hover:scale-105 shadow-md">{t("reset")}</button>
            )}
          </div>
        </form>

        {/* Recommendations */}
        {recommendations && (
          <div className="mt-12 bg-gray-800/80 p-10 rounded-3xl shadow-xl text-center opacity-0 animate-fadeIn delay-900">
            <h3 className="text-3xl font-bold text-yellow-400 mb-6">{t("recTitle")}</h3>
            <p className="text-gray-300 text-lg md:text-xl leading-relaxed">{recommendations.summary || t("noRecommendations")}</p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes blurToClear {
          0% { filter: blur(6px); opacity: 0; }
          100% { filter: blur(0); opacity: 1; }
        }
        .animate-blurToClear { animation: blurToClear 1s forwards; }

        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn { animation: fadeIn 1s forwards; }
        .delay-500 { animation-delay: 0.5s; }
        .delay-700 { animation-delay: 0.7s; }
        .delay-900 { animation-delay: 0.9s; }
      `}</style>
    </section>
  );
}
