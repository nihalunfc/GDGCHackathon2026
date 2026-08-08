// State
let state = {
    environment: 'outdoor', // outdoor, park, indoor
    activity: 'walking', // walking, standing, sitting
    duration: 45, // minutes
    hasWearOS: false
};

// Simulated Data Directory (Dynamic Weather Conditions)
const weatherDatabase = [
    { name: "Summer Heatwave", temp: 35.0, humidity: 65, wind: 5, aqi: 85, uv: 10, alert: "⚠️ WARNING: Extreme Heat Advisory Active" },
    { name: "Approaching Thunderstorm", temp: 24.0, humidity: 85, wind: 40, aqi: 30, uv: 2, alert: "⚡ SEVERE: Thunderstorm Warning Active" },
    { name: "Winter Blizzard", temp: -8.0, humidity: 90, wind: 55, aqi: 15, uv: 1, alert: "❄️ CRITICAL: Blizzard Warning Active" },
    { name: "Clear Autumn Day", temp: 18.0, humidity: 45, wind: 10, aqi: 20, uv: 5, alert: "🌪️ Severe Weather: None Detected." },
    { name: "Tornado Watch", temp: 28.0, humidity: 80, wind: 65, aqi: 40, uv: 3, alert: "🌪️ CRITICAL: Tornado Watch in Effect for 10km Grid" }
];
let currentConditionIndex = 0;
let macroWeather = weatherDatabase[0];

// DOM Elements
const envButtons = {
    outdoor: document.getElementById('env-outdoor'),
    park: document.getElementById('env-park'),
    indoor: document.getElementById('env-indoor')
};

const macro = {
    temp: document.getElementById('macro-temp'),
    humidity: document.getElementById('macro-humidity'),
    aqi: document.getElementById('macro-aqi'),
    uv: document.getElementById('macro-uv')
};

const micro = {
    temp: document.getElementById('micro-temp'),
    humidity: document.getElementById('micro-humidity'),
    wind: document.getElementById('micro-wind'),
    aqi: document.getElementById('micro-aqi'),
    uv: document.getElementById('micro-uv')
};

const locDisplay = document.getElementById('current-location');
const formulaDisplay = document.getElementById('math-formula');
const alertBox = document.getElementById('ai-alert');
const hydrationBox = document.getElementById('hydration-alert');
const upsellBox = document.getElementById('ai-upsell');
const confidenceBadge = document.getElementById('confidence-score');
const severeWeather = document.getElementById('severe-weather');
const displayActivity = document.getElementById('display-activity');
const displayDuration = document.getElementById('display-duration');

// Threshold UI
const thresholdPercent = document.getElementById('threshold-percent');
const thresholdBar = document.getElementById('threshold-bar');
const thresholdHint = document.getElementById('threshold-hint');

// Wear OS Toggle
function toggleWearOS() {
    state.hasWearOS = !state.hasWearOS;
    const card = document.getElementById('device-wearos');
    if (state.hasWearOS) {
        card.classList.remove('inactive'); card.classList.add('active');
        card.innerHTML = '<span class="device-icon">⌚</span> Wear OS Connected';
    } else {
        card.classList.remove('active'); card.classList.add('inactive');
        card.innerHTML = '<span class="device-icon">⌚</span> Wear OS (Click)';
    }
    runExtrapolation();
}

// Environment Toggle
function setEnvironment(env) {
    state.environment = env;
    Object.values(envButtons).forEach(btn => btn.classList.remove('active'));
    envButtons[env].classList.add('active');
    runExtrapolation();
}

// Activity & Duration Updates
function updateDuration(val) {
    state.duration = parseInt(val);
    runExtrapolation();
}

document.getElementById('activity-select').addEventListener('change', (e) => {
    state.activity = e.target.value;
    runExtrapolation();
});

// The Extrapolation Engine Logic
function runExtrapolation() {
    let mTemp = macroWeather.temp;
    let mHum = macroWeather.humidity;
    let mWind = macroWeather.wind;
    let mAqi = macroWeather.aqi;
    let mUv = macroWeather.uv;
    
    let mathText = "";

    // Update Macro Display
    macro.temp.innerText = `${mTemp.toFixed(1)}°C`;
    macro.humidity.innerText = `${mHum}%`;
    macro.aqi.innerText = `${mAqi}`;
    macro.uv.innerText = `${mUv}`;

    severeWeather.innerText = macroWeather.alert;
    severeWeather.className = macroWeather.alert.includes("None Detected") ? "severe-weather safe" : "severe-weather danger";

    // 100m Extrapolation Math based on Environment
    if (state.environment === 'outdoor') {
        locDisplay.innerText = "Location: Sector 4 - Downtown Asphalt";
        
        mTemp += 2.5; 
        mWind -= 5;
        mAqi = 120; // Near traffic
        mUv = 8; // Full reflection
        mathText = "Albedo:+2.5°C | Traffic AQI:120";
    } else if (state.environment === 'park') {
        locDisplay.innerText = "Location: Sector 7 - Urban Park Canopy";
        
        mTemp -= 1.5;
        mHum += 15;
        mAqi = 35; // Trees filter air
        mUv = 3; // Canopy shade
        mathText = "Canopy:-1.5°C | Bio-AQI:35";
    } else if (state.environment === 'indoor') {
        locDisplay.innerText = "Location: Sector 2 - Indoor Factory Zone";
        if (!macroWeather.alert.includes("None Detected")) {
             severeWeather.innerText = macroWeather.alert + " (Ignored due to Indoor inference)";
        }
        
        mTemp = 26.0; // HVAC
        mHum = 30; // Dry air
        mWind = 0;
        mAqi = 85; // Indoor dust/machinery
        mUv = 0;
        mathText = "Indoor HVAC & Concrete Insulation Override";
    }

    // Update display pills
    displayActivity.innerText = state.activity.toUpperCase();
    let hours = Math.floor(state.duration / 60);
    let mins = state.duration % 60;
    displayDuration.innerText = hours > 0 ? `${hours}h ${mins}m` : `${mins} MINS`;

    // Update UI
    micro.temp.innerText = `${mTemp.toFixed(1)}°C`;
    micro.humidity.innerText = `${mHum}%`;
    micro.wind.innerText = `${mWind} km/h`;
    micro.aqi.innerText = `${mAqi}`;
    micro.uv.innerText = `${mUv}`;
    formulaDisplay.innerHTML = mathText;
    
    // Style AQI based on value
    micro.aqi.style.color = mAqi > 100 ? "var(--alert-orange)" : "var(--accent-green)";

    // Run AI and Threshold Logic
    calculateThresholds(mTemp, mHum);
}

function calculateThresholds(temp, humidity) {
    let strain = 0;
    
    // Base strain from activity
    if (state.activity === 'walking') strain += (state.duration / 120) * 100; // 2 hours = 100%
    if (state.activity === 'standing') strain += (state.duration / 360) * 100; // 6 hours = 100%
    if (state.activity === 'sitting') strain += (state.duration / 720) * 100; // 12 hours = 100%

    // Multipliers based on micro-climate
    if (temp > 29) strain *= 1.3;
    if (humidity > 55) strain *= 1.1;

    // Cap at 100%
    strain = Math.min(Math.round(strain), 100);

    // Update Threshold UI
    thresholdPercent.innerText = `${strain}%`;
    thresholdBar.style.width = `${strain}%`;
    
    if (strain < 50) {
        thresholdBar.className = "progress-bar-fill safe-bar";
        thresholdHint.innerText = "Safe to continue activity.";
    } else if (strain < 85) {
        thresholdBar.className = "progress-bar-fill warning-bar";
        thresholdHint.innerText = "Approaching limits. Plan a break soon.";
    } else {
        thresholdBar.className = "progress-bar-fill danger-bar";
        thresholdHint.innerText = "EXHAUSTION VERGE: Stop activity immediately.";
    }

    generateAIResponse(temp, strain);
}

function generateAIResponse(temp, strain) {
    let alertHtml = "";
    let boxClass = "alert-box safe";
    let waterMl = 0;

    // Hydration Math: 50ml per 15 mins of activity if temp > 20
    if (state.activity !== 'sitting') {
        waterMl = Math.floor(state.duration / 15) * 50;
        if (temp > 28) waterMl += 100; // Heat bonus
    }

    // AI Logic Cases (Addressing user concerns)
    let extremeWeather = !macroWeather.alert.includes("None Detected") && state.environment !== 'indoor';
    
    if (extremeWeather && macroWeather.alert.includes("Tornado")) {
        boxClass = "alert-box danger";
        alertHtml = `<strong>🌪️ IMMEDIATE SHELTER REQUIRED</strong><br>
        Tornado Watch in effect. Your 100m radius contains no adequate cover.<br>
        <strong>Action: STOP WALKING. Proceed immediately to underground shelter.</strong>`;
    }
    else if (extremeWeather && macroWeather.alert.includes("Blizzard")) {
        boxClass = "alert-box danger";
        alertHtml = `<strong>❄️ EXTREME COLD EXPOSURE</strong><br>
        Local temp is ${temp.toFixed(1)}°C with high windchill. High risk of hypothermia.<br>
        <strong>Action: Proceed indoors immediately.</strong>`;
    }
    else if (extremeWeather && macroWeather.alert.includes("Thunderstorm")) {
         boxClass = "alert-box danger";
         alertHtml = `<strong>⚡ LIGHTNING RISK</strong><br>
         Your position in an open asphalt grid increases lightning strike probability.<br>
         <strong>Action: Seek indoor shelter immediately.</strong>`;
    }
    else if (strain >= 85) {
        boxClass = "alert-box danger";
        let issue = state.activity === 'standing' ? "Vascular failure and deep vein thrombosis" : "Heat exhaustion and muscular failure";
        alertHtml = `<strong>🚨 CRITICAL INTERVENTION REQUIRED</strong><br>
        You have reached ${strain}% physical capacity. Continuing to ${state.activity} under current micro-climate conditions highly risks ${issue}.<br>
        <strong>Action: STOP IMMEDIATELY. Sit down and elevate legs.</strong>`;
    }
    else if (state.environment === 'indoor' && state.activity === 'standing' && state.duration > 180) {
        boxClass = "alert-box warning";
        alertHtml = `<strong>⚠️ Ergonomic & Vascular Risk</strong><br>
        Stationary standing indoors for ${state.duration} mins increases venous pressure in the lower extremities.<br>
        <strong>Action:</strong> Sit down for 10 minutes and perform calf raises.`;
    }
    else if (state.environment === 'outdoor' && state.activity === 'walking' && temp > 29) {
        boxClass = "alert-box warning";
        alertHtml = `<strong>⚠️ Micro-Climate Heat Stress</strong><br>
        Walking on asphalt drastically increases heat absorption (Current: ${temp.toFixed(1)}°C).<br>
        <strong>Action:</strong> Shift your route to a park canopy to lower ambient temperature by ~3°C.`;
    }
    else {
        boxClass = "alert-box safe";
        alertHtml = `<strong>✅ Status Optimal</strong><br>
        Your physical strain is low (${strain}%). The Ora AI detects no immediate threats in your 100m radius.`;
    }

    // Hydration Output
    if (waterMl > 0) {
        hydrationBox.style.display = 'block';
        hydrationBox.innerHTML = `💧 <strong>Hydration Protocol:</strong> You have lost significant fluids. Consume <strong>${waterMl}ml</strong> of water immediately.`;
    } else {
        hydrationBox.style.display = 'none';
    }

    // Adjust confidence based on Wear OS
    let confidence = state.hasWearOS ? 99 : 82;
    if (state.hasWearOS) {
        upsellBox.style.display = 'none';
        alertHtml += `<br><br><small><em>*Verified with live heart rate variance from Wear OS.</em></small>`;
    } else {
        upsellBox.style.display = 'block';
        upsellBox.innerHTML = `<strong>Data Gap:</strong> Lacking live cardiovascular variance.<br>Connect a Wear OS smartwatch to unlock 99% probabilistic confidence.`;
    }

    // Apply to DOM
    alertBox.className = boxClass;
    alertBox.innerHTML = alertHtml;
    
    let confColor = confidence > 90 ? "rgba(52, 211, 153, 0.1)" : "rgba(251, 191, 36, 0.1)";
    let confTextColor = confidence > 90 ? "var(--accent-green)" : "var(--alert-orange)";
    confidenceBadge.innerHTML = `Confidence: ${confidence}%`;
    confidenceBadge.style.background = confColor;
    confidenceBadge.style.color = confTextColor;
    confidenceBadge.style.borderColor = confTextColor;
}

// Data Pipeline Terminal Simulator
const terminal = document.getElementById('data-terminal');
const logs = [
    "Fetching Google Fit API... [OK]",
    "Parsing 12 hours of step data... [OK]",
    "Polling OpenWeatherMap for 10km grid... [OK]",
    "Resolving Google Maps Places API... [INDOOR FACTORY DETECTED]",
    "Normalizing raw JSON payloads...",
    "Applying Deductive Math Extrapolation...",
    "Sending Unified Dataset to Gemini Core...",
    "Awaiting probabilistic output..."
];

function simulateTerminal() {
    let i = 0;
    setInterval(() => {
        const p = document.createElement('p');
        p.innerText = `> ${new Date().toISOString().split('T')[1].slice(0,-1)}: ${logs[i % logs.length]}`;
        terminal.appendChild(p);
        if(terminal.childElementCount > 10) terminal.removeChild(terminal.firstChild);
        i++;
    }, 1500);
}

// Weather Cycler
function cycleWeather() {
    currentConditionIndex = (currentConditionIndex + 1) % weatherDatabase.length;
    macroWeather = weatherDatabase[currentConditionIndex];
    runExtrapolation();
}

// Automatically shift weather every 60 seconds
setInterval(() => {
    cycleWeather();
}, 60000);

// Initial Run
runExtrapolation();
simulateTerminal();
