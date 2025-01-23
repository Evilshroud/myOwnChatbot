from flask import Flask, request, jsonify
from flask_cors import CORS
import os
import google.generativeai as genai

# Flask setup
app = Flask(__name__)
CORS(app)

# Configure the Gemini API with the new API key
os.environ["GEMINI_API_KEY"] = "AIzaSyDgGhn77y7dekJ9d9eu54fe1n7KK4YPRsI"
genai.configure(api_key=os.environ["GEMINI_API_KEY"])

# Create the generative model configuration
generation_config = {
    "temperature": 1.15,
    "top_p": 0.95,
    "top_k": 40,
    "max_output_tokens": 8192,
    "response_mime_type": "application/json",
}
model = genai.GenerativeModel(
    model_name="gemini-2.0-flash-exp",
    generation_config=generation_config,
)

@app.route("/chat", methods=["POST"])
def chat():
    # Parse the incoming JSON request
    data = request.json
    user_message = data.get("message", "")

    if not user_message.strip():
        return jsonify({"error": "Message cannot be empty"}), 400

    try:
        # Start a chat session and send the message
        chat_session = model.start_chat(
            history=[]  # Optionally, you can maintain a chat history here
        )
        response = chat_session.send_message(user_message)

        # Extract the clean response text (plain text, not JSON)
        clean_reply = response.text.strip()

        # Return the clean reply to the frontend (as plain text)
        return jsonify({"reply": clean_reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == "__main__":
    app.run(debug=True)
