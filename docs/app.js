// WARL Front-End Logic
document.addEventListener('DOMContentLoaded', () => {
    const btnStart = document.getElementById('btn-start');
    const btnReset = document.getElementById('btn-reset');
    const statusIndicator = document.getElementById('status-indicator');
    
    // Canvas setup for our Live Cellular Automata Grid overlay
    const canvas = document.getElementById('simulation-canvas');
    const ctx = canvas.getContext('2d');
    
    // Ensure canvas internal resolution matches display size
    const resizeCanvas = () => {
        canvas.width = canvas.parentElement.clientWidth;
        canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    const gridSize = 16; // 16x16 grid for higher resolution visual
    let cellSize = canvas.width / gridSize;
    
    let isRunning = false;
    let grid = [];
    let drones = [
        { x: 0, y: 0, targetX: 0, targetY: 0 },
        { x: 0, y: 0, targetX: 0, targetY: 0 },
        { x: 0, y: 0, targetX: 0, targetY: 0 }
    ];

    function initGrid() {
        grid = Array(gridSize).fill().map(() => Array(gridSize).fill(0));
        // Ignite center
        grid[gridSize/2][gridSize/2] = 1;
        
        // Reset drones to base
        drones.forEach(d => { d.x = 0; d.y = 0; });
        
        drawGrid();
    }

    function drawGrid() {
        cellSize = canvas.width / gridSize; // Recalculate in case of resize
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Draw Fire
        let fireCount = 0;
        for (let y = 0; y < gridSize; y++) {
            for (let x = 0; x < gridSize; x++) {
                if (grid[y][x] === 1) {
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.7)'; // Semi-transparent red
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                    fireCount++;
                } else if (grid[y][x] === 2) {
                    ctx.fillStyle = 'rgba(51, 65, 85, 0.6)'; // Ash/Extinguished
                    ctx.fillRect(x * cellSize, y * cellSize, cellSize, cellSize);
                }
            }
        }
        
        document.getElementById('metric-fire').innerText = fireCount;
        const statusEl = document.getElementById('metric-status');
        if (fireCount > 10) {
            statusEl.innerText = "DANGER";
            statusEl.className = "danger";
        } else {
            statusEl.innerText = "CONTAINED";
            statusEl.className = "safe";
        }

        // Draw Drones
        ctx.fillStyle = '#3b82f6'; // Blue drones
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        drones.forEach(drone => {
            ctx.beginPath();
            ctx.arc((drone.x * cellSize) + (cellSize/2), (drone.y * cellSize) + (cellSize/2), cellSize/3, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        });
    }

    // Dummy simulation loop for the UI prototype (mimics the Python logic)
    function simulationLoop() {
        if (!isRunning) return;
        
        // Mock fire spread (Cellular Automata)
        let newGrid = JSON.parse(JSON.stringify(grid));
        for (let y = 1; y < gridSize-1; y++) {
            for (let x = 1; x < gridSize-1; x++) {
                if (grid[y][x] === 1 && Math.random() < 0.1) { // 10% spread chance
                    const dirs = [[-1,0],[1,0],[0,-1],[0,1]];
                    const d = dirs[Math.floor(Math.random()*dirs.length)];
                    if (newGrid[y+d[0]][x+d[1]] === 0) {
                        newGrid[y+d[0]][x+d[1]] = 1;
                    }
                }
            }
        }
        grid = newGrid;
        
        // Drones seek out fire (Mocking the AI policy)
        drones.forEach(drone => {
            // Very simple heuristic to mimic AI: move towards nearest fire
            let bestDist = Infinity;
            let bestMove = {dx: 0, dy: 0};
            
            // Just wiggle randomly for now to look busy, occasionally hitting fire
            if(Math.random() < 0.6) {
                drone.x = Math.max(0, Math.min(gridSize-1, drone.x + (Math.random() > 0.5 ? 1 : -1)));
                drone.y = Math.max(0, Math.min(gridSize-1, drone.y + (Math.random() > 0.5 ? 1 : -1)));
            }
            
            // If drone lands on fire, extinguish it
            if (grid[drone.y][drone.x] === 1) {
                grid[drone.y][drone.x] = 2;
            }
        });

        drawGrid();
        setTimeout(simulationLoop, 300); // 300ms per step
    }

    btnStart.addEventListener('click', () => {
        if (!isRunning) {
            isRunning = true;
            statusIndicator.innerText = "Status: ACTIVE SWARM";
            btnStart.innerText = "Pause Swarm";
            simulationLoop();
        } else {
            isRunning = false;
            statusIndicator.innerText = "Status: PAUSED";
            btnStart.innerText = "Deploy Swarm";
        }
    });

    btnReset.addEventListener('click', () => {
        isRunning = false;
        statusIndicator.innerText = "Status: STANDBY";
        btnStart.innerText = "Deploy Swarm";
        initGrid();
    });

    // Initialize
    initGrid();
});
