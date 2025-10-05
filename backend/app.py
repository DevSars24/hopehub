# backend/app.py
# Gemini Mentor Backend (No Safety Blocking, Full Debug)

import logging
from flask import Flask, request, jsonify
from flask_cors import CORS
import google.generativeai as genai
import os
from dotenv import load_dotenv
import sys
import traceback
import re

# -------------------- Logging --------------------
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(message)s",
    handlers=[logging.StreamHandler(sys.stdout)],
)

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:*"}})  # Restrict CORS to API routes

# -------------------- Load Environment --------------------
load_dotenv()
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    logging.critical("❌ GEMINI_API_KEY missing in .env")
    raise EnvironmentError("Missing GEMINI_API_KEY")

# -------------------- Initialize Gemini --------------------
model = None  # Initialize as None to handle fallback
try:
    genai.configure(api_key=api_key)
    model = genai.GenerativeModel("gemini-2.5-flash")
    logging.info("✅ Gemini 2.5 Flash model initialized successfully.")
except Exception as e:
    logging.critical(f"❌ Failed to initialize Gemini: {e}", exc_info=True)
    try:
        model = genai.GenerativeModel("gemini-pro")
        logging.info("✅ Falling back to Gemini Pro model successfully.")
    except Exception as e:
        logging.critical(f"❌ Failed to initialize Gemini Pro: {e}", exc_info=True)
        logging.warning("⚠️ Falling back to dummy responses due to Gemini initialization failure.")

# -------------------- Utility --------------------
def safe_generate(prompt, config):
    """Generate with Gemini, fallback on error."""
    if not model:
        logging.warning("⚠️ Gemini model not available, using fallback.")
        return None

    try:
        response = model.generate_content(contents=prompt, generation_config=config)
        logging.debug(f"Gemini response raw: {response}")
        if response.candidates and response.candidates[0].finish_reason == 2 and not response.candidates[0].content.parts:
            logging.warning("⚠️ Gemini response stopped with no valid parts (finish_reason: 2).")
        elif response.candidates and response.candidates[0].finish_reason == "MAX_TOKENS":
            logging.warning(f"⚠️ Gemini response stopped due to MAX_TOKENS limit. Tokens used: {response.usage_metadata.total_token_count}")
        return response
    except Exception as e:
        logging.error(f"❌ Gemini request failed: {e}\n{traceback.format_exc()}")
        return None

def extract_text(resp):
    """Safely extract text from Gemini response."""
    if not resp or not hasattr(resp, "candidates") or not resp.candidates:
        logging.warning("⚠️ No candidates in Gemini response.")
        return ""

    candidate = resp.candidates[0]
    if not candidate.content or not candidate.content.parts:
        logging.warning(f"⚠️ No valid parts in Gemini response. Finish reason: {candidate.finish_reason}")
        return ""

    try:
        text = next((part.text for part in candidate.content.parts if hasattr(part, "text")), "")
        return text.strip() if text else ""
    except Exception as e:
        logging.error(f"❌ Error extracting text: {e}\n{traceback.format_exc()}")
        return ""

def parse_skill_response(text):
    """Parse the Gemini response into a single paragraph."""
    result = {"summary": text.strip()}  # Store the entire text as summary
    return result

# -------------------- Routes --------------------
@app.route("/api/skill-recommendations", methods=["POST"])
def skill_recommendations():
    logging.debug("Received request for /api/skill-recommendations")
    try:
        data = request.get_json(silent=True)
        if not data:
            logging.warning("⚠️ No JSON data received.")
            return jsonify({"error": "Invalid JSON data"}), 400

        profile = data.get("profile", {})
        language = data.get("language", "en")

        if not all(k in profile for k in ("education", "occupation", "goal")):
            logging.warning("⚠️ Missing required profile fields.")
            return jsonify({"error": "Missing profile fields"}), 400

        prompt = f"""
        You are an AI mentor guiding individuals in India with practical, actionable advice in a warm and encouraging tone.

        Profile:
        Education: {profile['education']}
        Occupation: {profile['occupation']}
        Goal: {profile['goal']}

        Respond in {language} with a single, well-structured paragraph (under 200 words). Provide a motivational summary tailored to the profile, followed by 2-3 clear, actionable steps to achieve the goal. Include specific suggestions for government schemes (e.g., Skill India, Startup India) and learning resources (e.g., online courses or platforms like Skill India) without listing URLs or bullet points. Focus on practical advice, such as exploring training programs, building skills, or connecting with local support, to inspire and guide the user on their journey. Ensure the response is fully in {language}.
        """

        logging.debug(f"Prompt sent to Gemini:\n{prompt}")

        response = safe_generate(prompt, genai.types.GenerationConfig(
            temperature=0.8,
            max_output_tokens=2000,
        ))

        if not response:
            logging.warning("⚠️ Using fallback data (Gemini unavailable).")
            return jsonify({
                "summary": "Here’s how you can start improving your skills. Begin by exploring local training programs, then focus on building basic skills through community workshops, and finally seek guidance from career counselors to plan your next steps."
            })

        text = extract_text(response)
        if not text:
            logging.warning("⚠️ No valid text extracted from response, using fallback.")
            return jsonify({
                "summary": "Here’s how you can start improving your skills. Begin by exploring local training programs, then focus on building basic skills through community workshops, and finally seek guidance from career counselors to plan your next steps."
            })

        result = parse_skill_response(text)
        if not result["summary"]:
            logging.warning("⚠️ Parsed response is empty, using fallback.")
            return jsonify({
                "summary": "Here’s how you can start improving your skills. Begin by exploring local training programs, then focus on building basic skills through community workshops, and finally seek guidance from career counselors to plan your next steps."
            })

        return jsonify(result)

    except Exception as e:
        logging.error(f"❌ Skill Recommendation Error: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/api/nutrition_ai", methods=["POST"])
def nutrition_ai():
    logging.debug("Received request for /api/nutrition_ai")
    try:
        data = request.get_json(silent=True)
        if not data:
            logging.warning("⚠️ No JSON data received.")
            return jsonify({"error": "Invalid JSON data"}), 400

        question = data.get("question", "").strip()
        language = data.get("language", "en")

        if not question:
            logging.warning("⚠️ Question is required.")
            return jsonify({"error": "Question is required"}), 400

        prompt = f"""
        You are a local health mentor.
        Question: "{question}"
        Reply in {language} with a clear text response.
        Provide practical and simple advice in a single paragraph (under 150 words), including specific foods and daily habits, without listing URLs or bullet points. Focus on actionable steps to improve health, tailored to the question, in a warm and supportive tone. Ensure the response is fully in {language}.
        """

        logging.debug(f"Prompt sent to Gemini:\n{prompt}")

        response = safe_generate(prompt, genai.types.GenerationConfig(
            temperature=0.6,
            max_output_tokens=2000,
        ))

        if not response:
            logging.warning("⚠️ Gemini failed; using dummy nutrition reply.")
            return jsonify({"answer": "Eat local fruits, vegetables, dal, and rice daily. Stay hydrated by drinking plenty of water, and avoid packaged foods to boost your health naturally."})

        answer = extract_text(response)
        if not answer:
            logging.warning("⚠️ No valid text extracted, using dummy reply.")
            return jsonify({"answer": "Eat local fruits, vegetables, dal, and rice daily. Stay hydrated by drinking plenty of water, and avoid packaged foods to boost your health naturally."})

        return jsonify({"answer": answer})

    except Exception as e:
        logging.error(f"❌ Nutrition API Error: {e}\n{traceback.format_exc()}")
        return jsonify({"error": "Internal server error"}), 500

@app.route("/", methods=["GET"])
def root():
    logging.debug("Received request for root route")
    return jsonify({"status": "running", "model": "gemini-2.5-flash" if model else "unavailable"})

if __name__ == "__main__":
    logging.info("🚀 Flask server starting at http://localhost:5000")
    try:
        app.run(debug=True, host="0.0.0.0", port=5000)
    except Exception as e:
        logging.critical(f"💥 Server startup failed: {e}", exc_info=True)
        raise