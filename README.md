# Genetics Quiz App 🧬

[![React](https://img.shields.io/badge/React-18.2.0-blue)](https://react.dev/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green)](https://opensource.org/licenses/MIT)

An interactive quiz application focused on molecular biology and genetics, featuring timed challenges, detailed solutions, and dynamic UI animations.

![App Screenshot](/public/screenshot.png) <!-- Add your screenshot path here -->

## Live Demo ▶️
<!-- Add hosted URL or video walkthrough link here -->
[Video Walkthrough](https://your-demo-link.com) 

## Table of Contents
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Tech Stack](#tech-stack)
- [Screenshots](#screenshots)
- [Customization](#customization)
- [Contributing](#contributing)
- [License](#license)

## Features ✨
- 3-minute timed quizzes with auto-submission
- Light/dark mode toggle
- Interactive question navigation
- Progress tracking visualizations
- Skip & revisit functionality
- Detailed solution explanations
- Score breakdown analytics
- Animated transitions

## Installation ⚙️

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/genetics-quiz.git
Install dependencies:
bash
Copy
Edit
cd genetics-quiz && npm install
Start the development server:
bash
Copy
Edit
npm start
Usage 🚀
Click "Start Quiz" on the welcome screen
Answer/Skip questions within 3 minutes
Review results with detailed solutions
Use the sidebar to track progress
Toggle dark mode in the top-right corner
Tech Stack 💻
Frontend: React 18, Framer Motion
Styling: CSS Modules, Flexbox/Grid
Icons: React Icons
State Management: React Hooks
Build Tool: Vite
Screenshots 📸
<!-- Add your screenshots with captions -->
Start Screen	Quiz Interface	Results Page
<img src="/public/start-screen.png" width="300">	<img src="/public/quiz-interface.png" width="300">	<img src="/public/results-page.png" width="300">
Dark Mode <br> <img src="/public/dark-mode.png" width="600">

Customization 🔧
Modify in src/config.js:

javascript
Copy
Edit
export const QUIZ_CONFIG = {
  DURATION: 180, // Quiz duration in seconds
  QUESTION_API: "/api/questions",
  COLORS: {
    light: "#f8f9fa",
    dark: "#1a1a1a"
  }
};
Contributing 🤝
Fork the repository
Create a feature branch (git checkout -b feature/your-feature)
Commit changes (git commit -m 'Add amazing feature')
Push to branch (git push origin feature/your-feature)
Open a Pull Request
License 📄
This project is licensed under the MIT License - see LICENSE.md for details.
