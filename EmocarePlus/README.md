# 🍃 EmoCare+ | Your AI-Powered Wellness Companion

[![Live App](https://img.shields.io/badge/Live_App-Click_Here-5B9BD5?style=for-the-badge)](https://emotioncare.netlify.app/)


EmoCare+ is a comprehensive, cross-platform mental wellness application designed to provide users with accessible, AI-driven emotional support. By combining real-time physiological data, machine learning, and cognitive behavioral therapy (CBT) frameworks, EmoCare+ helps users track their mental health, reframe negative thoughts, and find moments of calm.

## ✨ Key Features

* **🧠 AI Stress Prediction:** Uses a custom TensorFlow machine learning model to predict daily stress levels based on user vitals (heart rate, sleep hours, daily steps, and age).
* **📷 Real-Time Emotion Detection:** Integrates DeepFace and computer vision to analyze facial expressions via webcam, providing real-time emotional feedback.
* **💬 Mindful AI Companion:** A 24/7 conversational chatbot fine-tuned with DistilBERT for sentiment analysis and powered by Google Gemini to provide empathetic, context-aware support and immediate crisis intervention.
* **📝 CBT Thought Record:** Interactive exercises guiding users through Cognitive Behavioral Therapy techniques to identify and reframe negative automatic thoughts.
* **🧘 Meditations & Resources:** A curated library of breathing exercises, guided meditations, and psycho-educational resources.
* **📍 Therapist Locator:** Geolocation-powered map interface to find nearby mental health clinics and licensed therapists.
* **🏆 Web3 "HappyCoin" Rewards:** A blockchain-based reward system (ERC-20 on Sepolia) that incentivizes positive emotional check-ins by distributing crypto tokens directly to the user's wallet.
* **🌗 Dynamic Theming:** Beautiful, accessible UI with smooth transitions between a crisp "Therapeutic Clarity" Light Mode and a calming "Deep Ocean" Dark Mode.
* **📱 Native Mobile Ready:** Wrapped with Capacitor for seamless deployment to Android and iOS devices.

## 🛠️ Tech Stack

**Frontend:**
* React.js (Vite)
* Tailwind CSS & Framer Motion (Styling & Animations)
* Capacitor (Native Mobile Wrapper)
* Recharts (Data Visualization)

**Backend & Database:**
* Flask (Python)
* MongoDB (User data, Chat logs, CBT records)
* JWT & Google OAuth 2.0 (Authentication)

**Machine Learning & AI:**
* TensorFlow / Keras (Stress Prediction Model)
* DeepFace / OpenCV (Facial Emotion Recognition)
* HuggingFace Transformers / DistilBERT (Text Sentiment)
* Google Gemini API (Generative AI Responses)

**Blockchain:**
* Web3.py
* Ethereum (Sepolia Testnet)
* Solidity (ERC-20 Smart Contract)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18+)
* Python (3.9+)
* MongoDB Instance
* Google Cloud Console Project (For OAuth)

### Installation

1. **Clone the repository:**
   ```bash
   git clone [https://github.com/YOUR_USERNAME/EmoCarePlus.git](https://github.com/YOUR_USERNAME/EmoCarePlus.git)
   cd EmoCarePlus