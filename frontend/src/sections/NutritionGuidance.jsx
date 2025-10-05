import React, { useState, useEffect, useRef } from "react";

export default function NutritionGuidance() {
  const [input, setInput] = useState("");
  const [aiResponse, setAiResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [typedResponse, setTypedResponse] = useState("");
  const [language, setLanguage] = useState("en"); 
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const sectionRef = useRef(null);
  const recognitionRef = useRef(null);

  const languages = [
    { code: "en", name: "English", recognitionCode: "en-US" },
    { code: "hi", name: "हिंदी", recognitionCode: "hi-IN" },
    { code: "ta", name: "தமிழ்", recognitionCode: "ta-IN" },
    { code: "te", name: "తెలుగు", recognitionCode: "te-IN" },
  ];

  const translations = {
    en: {
      heading: "Nutrition Awareness & Planning",
      subtitle:
        "Proper nutrition is key to a healthy life. We guide expecting mothers, newborn caregivers, and rural families on how to maintain balanced diets using affordable local foods.",
      pregnantTitle: "For Pregnant Women",
      pregnantDesc:
        "Learn about vitamins, minerals, and balanced meals for a healthy pregnancy.",
      newbornTitle: "For Newborns & Infants",
      newbornDesc:
        "Guidance on breastfeeding, complementary foods, and feeding schedules.",
      ruralTitle: "For Rural Families",
      ruralDesc:
        "Practical tips on using local, affordable, and nutritious foods every day.",
      tipsTitle: "Nutrition Tips & Plans",
      tipsDesc:
        "Simple step-by-step nutrition planning guides for daily balanced diets.",
      formHeading: "Ask for Nutrition Guidance (Powered by AI)",
      placeholder:
        "E.g., What should pregnant women eat? (in selected language)",
      button: "Get AI Suggestions",
      generating: "Generating...",
      aiSuggestion: "AI Suggestion:",
      speak: "Speak",
      stop: "Stop",
      listen: "Listen",
      listening: "Listening...",
      noQuestion: "Please enter a question about nutrition.",
    },
    hi: {
      heading: "पोषण जागरूकता और योजना",
      subtitle:
        "उचित पोषण एक स्वस्थ जीवन की कुंजी है। हम गर्भवती माताओं, नवजात शिशु देखभालकर्ताओं और ग्रामीण परिवारों को किफायती स्थानीय खाद्यों का उपयोग करके संतुलित आहार बनाए रखने के तरीके पर मार्गदर्शन करते हैं।",
      pregnantTitle: "गर्भवती महिलाओं के लिए",
      pregnantDesc:
        "स्वस्थ गर्भावस्था के लिए विटामिन, खनिज और संतुलित भोजन के बारे में जानें।",
      newbornTitle: "नवजात शिशुओं और शिशुओं के लिए",
      newbornDesc:
        "स्तनपान, पूरक खाद्य पदार्थों और भोजन अनुसूचियों पर मार्गदर्शन।",
      ruralTitle: "ग्रामीण परिवारों के लिए",
      ruralDesc:
        "स्थानीय, किफायती और पौष्टिक खाद्यों का उपयोग करने के व्यावहारिक सुझाव।",
      tipsTitle: "पोषण सुझाव और योजनाएं",
      tipsDesc:
        "दैनिक संतुलित आहार के लिए सरल चरण-दर-चरण पोषण योजना गाइड।",
      formHeading: "पोषण मार्गदर्शन के लिए पूछें (AI द्वारा संचालित)",
      placeholder: "उदाहरण: गर्भवती महिलाओं को क्या खाना चाहिए? (चयनित भाषा में)",
      button: "AI सुझाव प्राप्त करें",
      generating: "उत्पन्न हो रहा है...",
      aiSuggestion: "AI सुझाव:",
      speak: "बोलें",
      stop: "रोकें",
      listen: "सुनें",
      listening: "सुन रहा है...",
      noQuestion: "कृपया पोषण के बारे में एक प्रश्न दर्ज करें।",
    },
    // Add Tamil and Telugu translations if needed
  };

  const t = (key) => translations[language][key] || key;

  // Scroll-trigger animation
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisible(true);
            observer.disconnect();
            startListening(); // auto-start listening when section is visible
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  // Typing animation
  useEffect(() => {
    if (!aiResponse) return;

    setTypedResponse("");
    let i = 0;
    const interval = setInterval(() => {
      setTypedResponse((prev) => prev + aiResponse.charAt(i));
      i++;
      if (i >= aiResponse.length) {
        clearInterval(interval);
        speak();
      }
    }, 25);

    return () => clearInterval(interval);
  }, [aiResponse]);

  // Text-to-Speech
  const speak = () => {
    if (!typedResponse) return;
    const utterance = new SpeechSynthesisUtterance(typedResponse);
    utterance.lang = languages.find((l) => l.code === language).recognitionCode;
    utterance.rate = 0.8;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    speechSynthesis.speak(utterance);
  };

  const stopSpeak = () => {
    speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  // Speech-to-Text
  useEffect(() => {
    if (!("SpeechRecognition" in window || "webkitSpeechRecognition" in window)) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    recognitionRef.current = new SpeechRecognition();
    recognitionRef.current.continuous = false;
    recognitionRef.current.interimResults = false;
    recognitionRef.current.lang = languages.find((l) => l.code === language).recognitionCode;

    recognitionRef.current.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      setInput(transcript);
      setIsListening(false);
    };

    recognitionRef.current.onerror = () => setIsListening(false);
    recognitionRef.current.onend = () => setIsListening(false);

    return () => recognitionRef.current.stop();
  }, [language]);

  const startListening = () => {
    if (recognitionRef.current && !isListening) {
      setIsListening(true);
      recognitionRef.current.start();
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }
  };

  // Handle AI request
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!input.trim()) {
      setAiResponse(t("noQuestion"));
      return;
    }

    setLoading(true);
    setAiResponse("");
    setTypedResponse("");

    try {
      const res = await fetch("http://localhost:5000/api/nutrition_ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: input, language }),
      });

      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setAiResponse(data.answer || "No answer received from AI.");
    } catch (err) {
      console.error(err);
      setAiResponse(
        "Error connecting to AI backend. Using mock: Maintain a balanced diet with local foods like dal, rice, and veggies."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      ref={sectionRef}
      id="nutrition"
      className="relative min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white px-6 md:px-12 overflow-hidden"
    >
      {/* Background Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_#facc15,_transparent_40%)] opacity-20 animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_#6366f1,_transparent_40%)] opacity-20 animate-pulse"></div>

      {/* Language Selector */}
      <div className="absolute top-4 right-4">
        <select
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
          className="p-2 bg-gray-800 text-white rounded-lg border border-gray-600"
        >
          {languages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </select>
      </div>

      {/* Heading */}
      <h1
        className={`text-3xl md:text-5xl font-extrabold text-yellow-300 mb-4 transition-all duration-1000 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {t("heading")}
      </h1>

      <p
        className={`max-w-2xl text-center text-gray-300 mb-10 transition-all duration-1000 delay-300 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        {t("subtitle")}
      </p>

      {/* Info Cards */}
      <div
        className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 transition-all duration-1000 delay-500 ${
          visible ? "opacity-100 scale-100" : "opacity-0 scale-90"
        }`}
      >
        {[t("pregnantTitle"), t("newbornTitle"), t("ruralTitle"), t("tipsTitle")].map((title, index) => (
          <div key={index} className="bg-white/10 backdrop-blur-lg p-6 rounded-2xl border border-white/20 hover:bg-white/20 transition-all duration-300">
            <h3 className="text-xl font-semibold text-yellow-400 mb-2">{title}</h3>
            <p className="text-gray-300 text-sm">{translations[language][Object.keys(translations[language])[4 + index]]}</p>
          </div>
        ))}
      </div>

      {/* AI Form */}
      <form
        onSubmit={handleSubmit}
        className={`w-full max-w-lg text-center transition-all duration-1000 delay-700 ${
          visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
        }`}
      >
        <h2 className="text-2xl font-semibold text-yellow-300 mb-3">{t("formHeading")}</h2>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={t("placeholder")}
          className="w-full p-3 rounded-xl bg-gray-800 border border-gray-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />

        <div className="flex gap-4 mt-4 items-center justify-center">
          <button
            type="submit"
            disabled={loading || isListening}
            className="px-6 py-2 bg-yellow-400 text-black font-bold rounded-xl hover:bg-yellow-300 transition-all duration-300 disabled:opacity-50"
          >
            {loading ? t("generating") : t("button")}
          </button>

          <button
            type="button"
            onClick={isListening ? stopListening : startListening}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-xl hover:bg-green-500 transition-all duration-300 disabled:opacity-50"
          >
            {isListening ? "⏹️" : "🎤"} <span className="text-sm">{isListening ? t("stop") : t("listen")}</span>
            {isListening && <span className="ml-1 text-xs text-gray-300 italic">{t("listening")}</span>}
          </button>

          {typedResponse && (
            <button
              type="button"
              onClick={isSpeaking ? stopSpeak : speak}
              disabled={loading || isListening}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-500 transition-all duration-300 disabled:opacity-50"
            >
              {isSpeaking ? "⏹️" : "🎙️"} <span className="text-sm">{isSpeaking ? t("stop") : t("speak")}</span>
            </button>
          )}
        </div>
      </form>

      {/* AI Response */}
      {typedResponse && (
        <div className="mt-6 max-w-lg bg-gray-800/70 p-4 rounded-xl border border-gray-700">
          <h3 className="text-yellow-300 font-semibold mb-2">{t("aiSuggestion")}</h3>
          <p className="text-gray-200 text-sm leading-relaxed">{typedResponse}</p>
        </div>
      )}
    </section>
  );
}
