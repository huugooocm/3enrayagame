window.addEventListener('DOMContentLoaded', () => {
    const timerElement = document.getElementById('timer');
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetBtn = document.getElementById('reset-btn');

    let currentPlayer = 'X';
    let cells = Array(9).fill(null);
    let seconds = 0;
    let timerInterval = null;
    let winner = null;
    let timerRunning = false;

    function updateTimerDisplay() {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startTimer() {
        if (timerInterval !== null || winner !== null || timerRunning) return;
        timerRunning = true;
        timerInterval = setInterval(() => {
            if (winner) {
                clearInterval(timerInterval);
                timerInterval = null;
                timerRunning = false;
                return;
            }
            seconds++;
            timerElement.textContent = updateTimerDisplay();
        }, 1000);
    }

    function handleClick(i) {
        if (cells[i] || winner !== null) return;

        // Inicia el timer en el primer movimiento
        if (!timerRunning && !timerInterval) {
            startTimer();
        }

        cells[i] = currentPlayer;
        renderBoard();

        const result = checkWinner();
        if (result) {
            winner = result;
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerElement.textContent = updateTimerDisplay();
            status.textContent = `¡Ganó ${winner} a los ${updateTimerDisplay()} minutos!`;
            return;
        }

        if (cells.every(cell => cell !== null)) {
            winner = 'Empate';
            clearInterval(timerInterval);
            timerInterval = null;
            timerRunning = false;
            timerElement.textContent = updateTimerDisplay();
            status.textContent = `¡Empate a los ${updateTimerDisplay()} minutos!`;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    }

    function renderBoard() {
        board.innerHTML = '';
        for (let i = 0; i < 9; i++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.textContent = cells[i] || '';
            if (!cells[i] && winner === null) {
                cell.addEventListener('click', () => handleClick(i));
            }
            board.appendChild(cell);
        }
    }

    function checkWinner() {
        const wins = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];
        for (const [a, b, c] of wins) {
            if (cells[a] && cells[a] === cells[b] && cells[a] === cells[c]) {
                return cells[a];
            }
        }
        return null;
    }

    function resetGame() {
        cells = Array(9).fill(null);
        currentPlayer = 'X';
        winner = null;
        seconds = 0;
        timerElement.textContent = '00:00';
        status.textContent = '';
        clearInterval(timerInterval);
        timerInterval = null;
        timerRunning = false;
        renderBoard();

    }

    resetBtn.addEventListener('click', resetGame);

    timerElement.textContent = '00:00';
    renderBoard();
});
