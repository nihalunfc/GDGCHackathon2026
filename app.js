// State
let state = {
    environment: 'outdoor',
    activity: 'walking',
    duration: 45,
    hasWearOS: false
};

// Location State
let realLocation = "LOC: AWAITING GPS...";
if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        (position) => {
            const lat = position.coords.latitude.toFixed(4);
            const lon = position.coords.longitude.toFixed(4);
            realLocation = `LOC: [${lat}, ${lon}]`;
            fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.coords.latitude}&lon=${position.coords.longitude}`)
                .then(res => res.json())
                .then(data => {
                    const city = data.address.city || data.address.town || data.address.village || data.address.county || "";
                    if (city) realLocation = `LOC: ${city.toUpperCase()} [${lat}, ${lon}]`;
                    runExtrapolation();
                }).catch(() => runExtrapolation());
        },
        (error) => { realLocation = "LOC: GPS DENIED"; runExtrapolation(); }
    );
}

// Weather Database
const weatherDatabase = [
    { name: "Summer Heatwave", temp: 35.0, humidity: 65, wind: 5, aqi: 85, uv: 10, alert: "WARNING: HEAT ADVISORY IN EFFECT" },
    { name: "Approaching Thunderstorm", temp: 24.0, humidity: 85, wind: 40, aqi: 30, uv: 2, alert: "SEVERE: THUNDERSTORM WARNING" },
    { name: "Winter Blizzard", temp: -8.0, humidity: 90, wind: 55, aqi: 15, uv: 1, alert: "CRITICAL: BLIZZARD WARNING" },
    { name: "Clear Autumn Day", temp: 18.0, humidity: 45, wind: 10, aqi: 20, uv: 5, alert: "NORMAL: NO ALERTS" },
    { name: "Tornado Watch", temp: 28.0, humidity: 80, wind: 65, aqi: 40, uv: 3, alert: "CRITICAL: TORNADO WATCH (10KM GRID)" }
];
let currentConditionIndex = 0;
let macroWeather = weatherDatabase[0];

// DOM Elements
const envButtons = { outdoor: document.getElementById('env-outdoor'), park: document.getElementById('env-park'), indoor: document.getElementById('env-indoor') };

const ui = {
    macroTemp: document.getElementById('macro-temp'), macroHum: document.getElementById('macro-humidity'),
    macroWind: document.getElementById('macro-wind'), macroAqi: document.getElementById('macro-aqi'), macroUv: document.getElementById('macro-uv'),
    microTemp: document.getElementById('micro-temp'), microAqi: document.getElementById('micro-aqi'), microWind: document.getElementById('micro-wind'),
    deltaTemp: document.getElementById('delta-temp'), deltaAqi: document.getElementById('delta-aqi'), deltaWind: document.getElementById('delta-wind'),
    locDisplay: document.getElementById('current-location'), tickerAlert: document.getElementById('ticker-alert'),
    aiAlert: document.getElementById('ai-alert'), hydrationBox: document.getElementById('hydration-alert'),
    confScore: document.getElementById('confidence-score'), actDisplay: document.getElementById('display-activity'),
    durDisplay: document.getElementById('display-duration'),
    strainPercent: document.getElementById('threshold-percent'), strainBar: document.getElementById('threshold-bar'),
    countdown: document.getElementById('countdown-timer')
};

// Toggle logic
function setEnvironment(env) {
    state.environment = env;
    Object.values(envButtons).forEach(btn => btn.classList.remove('active'));
    envButtons[env].classList.add('active');
    runExtrapolation();
}

function toggleWearOS() {
    state.hasWearOS = !state.hasWearOS;
    const btn = document.getElementById('device-wearos');
    btn.classList.toggle('active', state.hasWearOS);
    runExtrapolation();
}

function updateDuration(val) {
    state.duration = parseInt(val);
    runExtrapolation();
}
document.getElementById('activity-select').addEventListener('change', (e) => { state.activity = e.target.value; runExtrapolation(); });

// Math engine
function runExtrapolation() {
    let mTemp = macroWeather.temp; let mWind = macroWeather.wind; let mAqi = macroWeather.aqi;
    let microTemp = mTemp; let microWind = mWind; let microAqi = mAqi;

    ui.macroTemp.innerText = mTemp.toFixed(1); ui.macroHum.innerText = macroWeather.humidity;
    ui.macroWind.innerText = mWind; ui.macroAqi.innerText = mAqi; ui.macroUv.innerText = macroWeather.uv;
    
    let tickerMsg = macroWeather.alert;
    ui.tickerAlert.className = tickerMsg.includes("NORMAL") ? "text-green" : "text-red";

    if (state.environment === 'outdoor') {
        microTemp += 2.5; microWind -= 5; microAqi = 120;
    } else if (state.environment === 'park') {
        microTemp -= 1.5; microWind -= 10; microAqi = 35;
    } else if (state.environment === 'indoor') {
        microTemp = 26.0; microWind = 0; microAqi = 85;
        if(!tickerMsg.includes("NORMAL")) tickerMsg += " (ISOLATED: INDOOR)";
    }
    ui.locDisplay.innerText = `${realLocation} | ZONE: ${state.environment.toUpperCase()}`;
    
    ui.tickerAlert.innerText = tickerMsg;

    // Update Delta Grid
    ui.microTemp.innerText = microTemp.toFixed(1);
    updateDelta(ui.deltaTemp, microTemp - mTemp, "°C");
    
    ui.microAqi.innerText = microAqi;
    updateDelta(ui.deltaAqi, microAqi - mAqi, " AQI");
    
    ui.microWind.innerText = microWind;
    updateDelta(ui.deltaWind, microWind - mWind, " KM/H");

    ui.actDisplay.innerText = state.activity.toUpperCase();
    let hours = Math.floor(state.duration / 60); let mins = state.duration % 60;
    ui.durDisplay.innerText = hours > 0 ? `${hours}H ${mins}M` : `${mins}M`;

    calculateThresholds(microTemp);
}

function updateDelta(element, diff, suffix) {
    if (diff > 0) { element.innerText = `▲ +${diff.toFixed(1)}${suffix}`; element.className = "delta-change up"; }
    else if (diff < 0) { element.innerText = `▼ ${diff.toFixed(1)}${suffix}`; element.className = "delta-change down"; }
    else { element.innerText = `— 0.0${suffix}`; element.className = "delta-change neutral"; }
}

function calculateThresholds(temp) {
    let strain = 0;
    if (state.activity === 'walking') strain += (state.duration / 120) * 100;
    if (state.activity === 'standing') strain += (state.duration / 360) * 100;
    if (state.activity === 'sitting') strain += (state.duration / 720) * 100;

    if (temp > 29) strain *= 1.3;
    strain = Math.min(Math.round(strain), 100);

    ui.strainPercent.innerText = `${strain}%`;
    ui.strainBar.style.width = `${strain}%`;
    
    if (strain < 50) { ui.strainBar.className = "gauge-bar-fill safe-bar"; ui.strainPercent.className = "text-green"; }
    else if (strain < 85) { ui.strainBar.className = "gauge-bar-fill warning-bar"; ui.strainPercent.className = "text-orange"; }
    else { ui.strainBar.className = "gauge-bar-fill danger-bar"; ui.strainPercent.className = "text-red"; }

    generateAIResponse(temp, strain);
}

function generateAIResponse(temp, strain) {
    let statusText = "STATUS: SAFE"; let actionText = "ACTION: NONE REQUIRED"; let boxClass = "trading-alert safe";
    let extremeWeather = !macroWeather.alert.includes("NORMAL") && state.environment !== 'indoor';
    
    if (extremeWeather && macroWeather.alert.includes("TORNADO")) {
        boxClass = "trading-alert danger"; statusText = "STATUS: TORNADO PROXIMITY"; actionText = "ACTION: SEEK UNDERGROUND SHELTER NOW";
    } else if (extremeWeather && macroWeather.alert.includes("BLIZZARD")) {
        boxClass = "trading-alert danger"; statusText = "STATUS: HYPOTHERMIA RISK"; actionText = "ACTION: MOVE INDOORS NOW";
    } else if (extremeWeather && macroWeather.alert.includes("THUNDERSTORM")) {
        boxClass = "trading-alert danger"; statusText = "STATUS: LIGHTNING RISK"; actionText = "ACTION: SEEK INDOOR SHELTER";
    } else if (strain >= 85) {
        boxClass = "trading-alert danger"; statusText = "STATUS: CRITICAL STRAIN"; actionText = "ACTION: CEASE ACTIVITY IMMEDIATELY";
    } else if (state.environment === 'indoor' && state.activity === 'standing' && state.duration > 180) {
        boxClass = "trading-alert warning"; statusText = "STATUS: VASCULAR STRESS"; actionText = "ACTION: SIT FOR 10 MINS";
    } else if (state.environment === 'outdoor' && state.activity === 'walking' && temp > 29) {
        boxClass = "trading-alert warning"; statusText = "STATUS: HEAT STRESS"; actionText = "ACTION: REROUTE TO PARK CANOPY";
    }

    ui.aiAlert.className = boxClass;
    ui.aiAlert.innerHTML = `<div class="alert-status">${statusText}</div><div class="alert-action">${actionText}</div>`;
    
    let waterMl = (state.activity !== 'sitting') ? Math.floor(state.duration / 15) * 50 : 0;
    if (temp > 28 && waterMl > 0) waterMl += 100;
    
    if (waterMl > 0) {
        ui.hydrationBox.style.display = 'block';
        ui.hydrationBox.innerHTML = `<div class="alert-status">HYDRATION PROTOCOL</div><div class="alert-action">ACTION: DRINK ${waterMl}ML NOW</div>`;
    } else ui.hydrationBox.style.display = 'none';

    let confidence = state.hasWearOS ? 99 : 82;
    ui.confScore.innerText = `CONF: ${confidence}%`;
    ui.confScore.className = confidence > 90 ? "badge text-green" : "badge text-orange";
}

// 60-second Timer & Weather Cycler
let timerSeconds = 60;
setInterval(() => {
    timerSeconds--;
    if(timerSeconds < 0) {
        timerSeconds = 60;
        cycleWeather();
    }
    ui.countdown.innerText = `00:${timerSeconds.toString().padStart(2, '0')}`;
}, 1000);

function cycleWeather() {
    currentConditionIndex = (currentConditionIndex + 1) % weatherDatabase.length;
    macroWeather = weatherDatabase[currentConditionIndex];
    timerSeconds = 60; // Reset timer if forced
    runExtrapolation();
}

// Terminal Logging
const terminal = document.getElementById('data-terminal');
const logs = ["FETCHING FIT API...", "PARSING HR VARIANCE...", "OPENWEATHER SYNC...", "NORMALIZING JSON...", "CALCULATING DELTAS..."];
let i = 0;
setInterval(() => {
    const p = document.createElement('div');
    p.innerText = `[${new Date().toISOString().split('T')[1].slice(0,-1)}] ${logs[i % logs.length]}`;
    terminal.appendChild(p);
    if(terminal.childElementCount > 6) terminal.removeChild(terminal.firstChild);
    i++;
}, 1200);

// Init
runExtrapolation();
