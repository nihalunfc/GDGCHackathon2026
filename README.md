# The Wildfire Suppressor: Multi-Agent Drone Swarm

**Build with AI: Innovation Challenge 2026**
*GDG on Campus – University of Niagara Falls Canada*

## Overview
The Wildfire Suppressor is a decentralized, Multi-Agent Reinforcement Learning (MARL) drone swarm designed to autonomously contain and manage extreme wildfires. By treating the spread of a wildfire as a dynamic mathematical curve, our AI swarm learns to route autonomous drones to drop fire retardant at highly optimized "choke points," effectively flattening the curve of the fire's growth.

This project tackles a critical Canadian and global crisis—underfunded and inefficient wildfire management—by replacing reactive human coordination with proactive, autonomous swarm intelligence.

## Repository Structure
```
GDGCHackathon2026/
├── src/                # Core Python source code for the Swarm RL Environment
├── notebooks/          # Jupyter notebooks for training the Deep Q-Network and visualizing convergence
├── web/                # Firebase front-end (HTML/JS) and Google Maps UI Dashboard
├── docs/               # Project documentation, architecture diagrams, and submission assets
└── README.md           # Project overview and setup instructions
```

## Technologies Used
- **Google Cloud Platform:** For robust backend hosting and simulation scaling.
- **Firebase:** For real-time database management and high-performance Web App hosting.
- **Google Maps Platform:** To render the live Canadian forest map and visualize the drone swarm routing over active fire zones.
- **Google Gemini API:** An interactive "Swarm Commander" chatbot that allows users to query the AI (e.g., "Why did the swarm route North?") and receive plain-English explanations of the Swarm's mathematical logic.
- **PyTorch (Gymnasium):** Custom Deep Q-Network for the Multi-Agent Reinforcement Learning engine.

## The GDG Innovation Challenge Roadmap
- [x] **Phase 1:** Project Pitch, Repository Setup, and Architecture Mapping.
- [ ] **Phase 2:** Developing the Core RL Swarm Engine in Python.
- [ ] **Phase 3:** Building the Firebase & Google Maps Web Dashboard.
- [ ] **Phase 4:** Integrating the Gemini Chatbot Commander.
- [ ] **Phase 5:** Final Polish and Demo Video recording.

---
*Developed for the GDG Innovation Challenge 2026.*
