# Ora (Hyper-Local Omni-Sensor AI)

Build with AI: Innovation Challenge 2026 Submission
Challenge Area: Healthcare, Productivity, & Smart Cities
Developer: Nihal

🔗 **Live Prototype Demo:** [https://nihalunfc.github.io/GDGCHackathon2026/](https://nihalunfc.github.io/GDGCHackathon2026/)

---

## Elevator Pitch
Ora is a zero-input, omni-sensor AI that acts as a 24/7 personal safety sentinel. By amalgamating a user's entire Google device ecosystem (Health Connect, Maps, Wear OS) into a "Single Node," Ora achieves something unprecedented: 100-meter hyper-locality. When hard sensor data is unavailable at that resolution, Ora pivots to advanced predictive modeling and mathematical extrapolation to deduce your exact micro-climate and physiological risk, warning you of invisible threats before they occur.

## The Problem
The fundamental flaw in modern environmental safety apps is their resolution. Weather apps predict conditions for a 5km to 10km grid. But a user's physical reality happens within a 100-meter radius. Walking on a treeless asphalt road at noon is drastically different from walking in a shaded park 500 meters away, yet macro-weather models treat them identically. 

Furthermore, users shouldn't have to manually input data. Their existing ecosystem of devices (phones, watches) already contains the raw material needed to read "between the lines," but this data currently exists in silos.

## The Solution
Ora solves the resolution problem by transforming macro-data into 100m micro-data through a combination of sensor amalgamation and mathematical deduction.

*   The Single Node Integration: Users authenticate via Google, connecting their disparate data silos (Google Health Connect, Maps, Wear OS) into one centralized Ora profile.
*   100m Hyper-Local Extrapolation Engine: We take base meteorological data (e.g., temperature per 10km) and apply deductive reasoning algorithms. By analyzing proxy variables within a 100m radius—such as urban density (concrete vs. green space via Maps), elevation, and indoor building type—the AI mathematically downscales the macro-weather to derive the exact micro-climate.
*   Actionable Context: Ora cross-references this 100m micro-climate with the user's real-time physiological data (steps, continuous standing time, heart rate variance) to issue highly specific alerts (e.g., "50ml water now," "Rest legs for 5 minutes to prevent vascular strain").

## Science & Data Amalgamation Strategy
1.  Deductive Downscaling (Mathematics & ML): If base temperature is X°C over 10km, Ora adjusts this mathematically. (e.g., +2.5°C for high albedo concrete, -1.5°C for park canopy, overridden humidity for indoor HVAC environments).
2.  Google Maps / Places API: Feeds the extrapolation engine with the physical characteristics of the 100m radius.
3.  Google Health Connect / Wear OS: Provides the biometric baseline (steps, standing time, heart rate).

## Google AI Technologies Used
*   Gemini API: Acts as the reasoning engine to interpret the extrapolated mathematical models and output probabilistic confidence scores (e.g., "85% confidence in ambient heat stress; connect Wear OS for 99% accuracy").
*   Google Maps Platform: Essential for the geographic proxy variables used in the 100m downscaling.
*   Google Cloud / Firebase: Designed for Single-Node authentication (Google Auth) and real-time database hosting.

## How to Run the Prototype Locally
This prototype was designed to run completely offline for seamless testing and demonstration. 
1. Clone this repository to your local machine.
2. Open the ora-dashboard folder.
3. Double click on index.html to open it in your web browser. 
4. No server, npm, or Node.js installation is required.

### Navigating the Demo
The dashboard is an interactive simulator designed to prove the core concept:
- Toggle Environment: Switch between Outdoor Asphalt, Park Canopy, and Indoor Factory to watch the math engine deduce the micro-climate in real time.
- Toggle Biometrics: Change your simulated physiological state (Walking vs Standing) and adjust the duration slider.
- Connect Wear OS: Click the "Wear OS" card in the sidebar to simulate connecting a smartwatch, instantly boosting the Gemini AI's probabilistic confidence score from 85% to 99%.

## Project Roadmap (To-Do List)

| Phase | Task | Status |
| :--- | :--- | :--- |
| **Phase 1** | Project Proposal & Concept Design | ✅ Completed |
| **Phase 1** | Interactive UI/UX Prototype Development | ✅ Completed |
| **Phase 1** | 100m Extrapolation Math Engine (Simulated) | ✅ Completed |
| **Phase 2** | Live Gemini API Integration | 🔄 In Progress |
| **Phase 2** | Live OpenWeatherMap API Integration | ⏳ To Do |
| **Phase 3** | Google Health Connect Data Sync | 🔮 Future Scope |
| **Phase 3** | Native Wear OS Companion App | 🔮 Future Scope |
