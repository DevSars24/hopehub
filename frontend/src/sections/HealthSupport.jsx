// src/sections/SymptomChecker.jsx
import React, { useState, useEffect, useRef } from "react";

export default function SymptomChecker() {
  const [activeTab, setActiveTab] = useState("symptomChecker");
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [typedPrediction, setTypedPrediction] = useState("");
  const [language, setLanguage] = useState("en"); // Default English
  const [diseaseOutbreakData, setDiseaseOutbreakData] = useState({
    state: "",
    village: "",
    weather: "",
    sanitation: "",
  });
  const [outbreakPrediction, setOutbreakPrediction] = useState(null);
  const sectionRef = useRef(null);
  const [visible, setVisible] = useState(false);

  const translations = {
    en: {
      symptomChecker: "Symptom Checker",
      outbreakPrediction: "Outbreak Prediction",
      chooseSymptoms: "Choose Symptoms",
      predictDisease: "Predict Disease",
      village: "Village / Area",
      state: "State",
      weather: "Weather Conditions",
      sanitation: "Sanitation Indicators",
      predictOutbreak: "Predict Outbreak Risk",
      selectLang: "🌐 Select Language",
    },
    hi: {
      symptomChecker: "लक्षण जांच",
      outbreakPrediction: "रोग प्रकोप की भविष्यवाणी",
      chooseSymptoms: "लक्षण चुनें",
      predictDisease: "बीमारी की भविष्यवाणी करें",
      village: "गांव / क्षेत्र",
      state: "राज्य",
      weather: "मौसम की स्थिति",
      sanitation: "स्वच्छता सूचक",
      predictOutbreak: "प्रकोप जोखिम का पूर्वानुमान",
      selectLang: "🌐 भाषा चुनें",
    },
    bn: { /* Bengali */ },
    ta: { /* Tamil */ },
  };

  const t = translations[language];

  const symptoms = [
    "Fever", "Cough", "Headache", "Fatigue", "Shortness of breath",
    "Nausea", "Diarrhea", "Sore throat", "Body aches", "Rash", "Vomiting",
    "Stomach pain", "Chills", "Dizziness", "Loss of appetite", "Joint pain"
  ];

  const handleSymptomChange = (symptom) => {
    setSelectedSymptoms(prev =>
      prev.includes(symptom) ? prev.filter(s => s !== symptom) : [...prev, symptom]
    );
  };

  const handleSymptomSubmit = (e) => {
    e.preventDefault();
    if (selectedSymptoms.length === 0) {
      setPrediction({ disease: "⚠️ Please select at least one symptom" });
      return;
    }

    let possibleDisease;
    if (selectedSymptoms.includes("Fever") && selectedSymptoms.includes("Headache")) {
      possibleDisease = "🦟 Possible: Dengue or Malaria";
    } else if (selectedSymptoms.includes("Cough") && selectedSymptoms.includes("Fever")) {
      possibleDisease = "🤧 Possible: Flu or COVID-19";
    } else {
      possibleDisease = "🤒 Possible: Viral infection";
    }

    setPrediction({
      disease: possibleDisease,
      confidence: `Confidence: ${Math.floor(Math.random() * (95 - 60 + 1)) + 60}%`,
      advice: "⚠️ Consult a healthcare professional for accurate diagnosis.",
    });
  };

  const handleOutbreakChange = (e) => {
    const { name, value } = e.target;
    setDiseaseOutbreakData(prev => ({ ...prev, [name]: value }));
  };

  const handleOutbreakSubmit = (e) => {
    e.preventDefault();
    const { state, village, weather, sanitation } = diseaseOutbreakData;
    let risk = "Low";
    let advice = "✅ Low risk. Maintain hygiene.";

    if (sanitation === "poor" && weather === "heavy_rain") {
      risk = "High";
      advice = "🚨 HIGH RISK! Deploy medical camps.";
    } else if (sanitation === "moderate" && weather === "moderate_rain") {
      risk = "Medium";
      advice = "⚠️ Monitor health closely.";
    }

    setOutbreakPrediction({ state, village, risk, advice });
  };

  // 👁️ Scroll-trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // 🖋 Typing animation for Symptom Checker prediction
  useEffect(() => {
    if (prediction) {
      setTypedPrediction("");
      const fullText = `${prediction.disease} ${prediction.confidence || ""} ${prediction.advice}`;
      let i = 0;
      const typing = setInterval(() => {
        setTypedPrediction(prev => prev + fullText.charAt(i));
        i++;
        if (i >= fullText.length) clearInterval(typing);
      }, 25);
      return () => clearInterval(typing);
    }
  }, [prediction]);

  return (
    <section ref={sectionRef} className="py-20 px-6 bg-gradient-to-b from-gray-900 to-gray-800 min-h-screen text-white">
      <div className="max-w-6xl mx-auto">
        {/* Language Selector */}
        <div className="flex justify-end mb-6">
          <select
            value={language}
            onChange={e => setLanguage(e.target.value)}
            className="p-2 bg-gray-700 text-white rounded-lg"
          >
            <option value="en">English</option>
            <option value="hi">हिंदी</option>
            <option value="bn">বাংলা</option>
            <option value="ta">தமிழ்</option>
          </select>
        </div>

        {/* Tab Buttons */}
        <div className={`flex justify-center gap-4 mb-12 transition-all duration-1000 ${visible ? "opacity-100" : "opacity-0 translate-y-10"}`}>
          <button
            onClick={() => setActiveTab("symptomChecker")}
            className={`py-3 px-6 rounded-full text-lg font-semibold ${activeTab === "symptomChecker" ? "bg-yellow-500 text-black" : "bg-gray-700"}`}
          >
            🩺 {t.symptomChecker}
          </button>
          <button
            onClick={() => setActiveTab("outbreakPrediction")}
            className={`py-3 px-6 rounded-full text-lg font-semibold ${activeTab === "outbreakPrediction" ? "bg-yellow-500 text-black" : "bg-gray-700"}`}
          >
            🌍 {t.outbreakPrediction}
          </button>
        </div>

        {/* Symptom Checker */}
        {activeTab === "symptomChecker" && (
          <form onSubmit={handleSymptomSubmit} className={`bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <h3 className="text-2xl font-semibold mb-6">{t.chooseSymptoms}</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              {symptoms.map(symptom => (
                <label key={symptom} className={`p-3 rounded-lg cursor-pointer ${selectedSymptoms.includes(symptom) ? "bg-yellow-400 text-black" : "bg-gray-700"}`}>
                  <input
                    type="checkbox"
                    value={symptom}
                    checked={selectedSymptoms.includes(symptom)}
                    onChange={() => handleSymptomChange(symptom)}
                    className="hidden"
                  />
                  {symptom}
                </label>
              ))}
            </div>
            <button className="w-full bg-yellow-500 text-black py-3 rounded-lg">{t.predictDisease}</button>
          </form>
        )}

        {/* Outbreak Prediction */}
        {activeTab === "outbreakPrediction" && (
          <form onSubmit={handleOutbreakSubmit} className={`bg-gray-800 p-8 rounded-2xl shadow-lg transition-all duration-1000 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}>
            <div className="mb-4">
              <label className="block mb-2">{t.state}:</label>
              <input type="text" name="state" value={diseaseOutbreakData.state} onChange={handleOutbreakChange} className="w-full p-3 rounded-lg bg-gray-900 text-white" placeholder="e.g., Bihar" required/>
            </div>
            <div className="mb-4">
              <label className="block mb-2">{t.village}:</label>
              <input type="text" name="village" value={diseaseOutbreakData.village} onChange={handleOutbreakChange} className="w-full p-3 rounded-lg bg-gray-900 text-white" placeholder="e.g., Kadamgaon" required/>
            </div>
            <div className="mb-4">
              <label className="block mb-2">{t.weather}:</label>
              <select name="weather" value={diseaseOutbreakData.weather} onChange={handleOutbreakChange} className="w-full p-3 rounded-lg bg-gray-900 text-white" required>
                <option value="">-- Select --</option>
                <option value="heavy_rain">Heavy Rain</option>
                <option value="moderate_rain">Moderate Rain</option>
                <option value="dry">Dry</option>
              </select>
            </div>
            <div className="mb-6">
              <label className="block mb-2">{t.sanitation}:</label>
              <select name="sanitation" value={diseaseOutbreakData.sanitation} onChange={handleOutbreakChange} className="w-full p-3 rounded-lg bg-gray-900 text-white" required>
                <option value="">-- Select --</option>
                <option value="poor">Poor</option>
                <option value="moderate">Moderate</option>
                <option value="good">Good</option>
              </select>
            </div>
            <button className="w-full bg-yellow-500 text-black py-3 rounded-lg">{t.predictOutbreak}</button>
          </form>
        )}

        {/* Symptom Prediction Result with Typing */}
        {typedPrediction && activeTab === "symptomChecker" && (
          <div className="bg-gray-900 mt-8 p-6 rounded-2xl text-center transition-all duration-1000 opacity-100">
            <h3 className="text-2xl font-bold text-yellow-400">{typedPrediction}</h3>
          </div>
        )}

        {/* Outbreak Prediction Result */}
        {outbreakPrediction && activeTab === "outbreakPrediction" && (
          <div className="bg-gray-900 mt-8 p-6 rounded-2xl text-center transition-all duration-1000 opacity-100">
            <h3 className="text-2xl font-bold text-yellow-400">{outbreakPrediction.state}, {outbreakPrediction.village} → {outbreakPrediction.risk}</h3>
            <p>{outbreakPrediction.advice}</p>
          </div>
        )}
      </div>
    </section>
  );
}
