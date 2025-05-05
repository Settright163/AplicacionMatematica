// Variables globales para el juego
let currentLevel = '';
let score = 0;
let currentProblem = {};
let timeLeft = 30;
let timerInterval;

// Referencias a elementos DOM comunes
const mainMenuElement = document.getElementById('main-menu');
const menuElement = document.getElementById('menu');
const gameElement = document.getElementById('game');
const gameOverElement = document.getElementById('game-over');
const matrixCalculatorElement = document.getElementById('matrix-calculator');

// Referencias a elementos DOM del juego
const problemElement = document.getElementById('problem');
const answerInput = document.getElementById('answer');
const scoreDisplay = document.getElementById('score-display');
const levelDisplay = document.getElementById('level-display');
const feedbackElement = document.getElementById('feedback');
const finalScoreElement = document.getElementById('final-score');
const timerDisplay = document.getElementById('timer-display');

// Botones del menú principal
const gameOptionButton = document.getElementById('game-option');
const matrixOptionButton = document.getElementById('matrix-option');

// Botones del juego
const easyButton = document.getElementById('easy');
const mediumButton = document.getElementById('medium');
const hardButton = document.getElementById('hard');
const submitButton = document.getElementById('submit');
const quitButton = document.getElementById('quit');
const playAgainButton = document.getElementById('play-again');
const backToMainButton = document.getElementById('back-to-main');

// Botones de la calculadora de matrices
const addMatricesButton = document.getElementById('add-matrices');
const subtractMatricesButton = document.getElementById('subtract-matrices');
const multiplyMatricesButton = document.getElementById('multiply-matrices');
const inverseMatrixAButton = document.getElementById('inverse-matrix-a');
const inverseMatrixBButton = document.getElementById('inverse-matrix-b');
const backFromCalculatorButton = document.getElementById('back-from-calculator');
const matrixMessageElement = document.getElementById('matrix-message');

// Event Listeners para el menú principal
gameOptionButton.addEventListener('click', showGameMenu);
matrixOptionButton.addEventListener('click', showMatrixCalculator);

// Event Listeners para el menú del juego
easyButton.addEventListener('click', () => startGame('easy'));
mediumButton.addEventListener('click', () => startGame('medium'));
hardButton.addEventListener('click', () => startGame('hard'));
backToMainButton.addEventListener('click', showMainMenu);

// Event Listeners para el juego
submitButton.addEventListener('click', checkAnswer);
quitButton.addEventListener('click', showMainMenu);
playAgainButton.addEventListener('click', showGameMenu);

// Event Listeners para la calculadora de matrices
addMatricesButton.addEventListener('click', addMatrices);
subtractMatricesButton.addEventListener('click', subtractMatrices);
multiplyMatricesButton.addEventListener('click', multiplyMatrices);
inverseMatrixAButton.addEventListener('click', () => calculateInverse('a'));
inverseMatrixBButton.addEventListener('click', () => calculateInverse('b'));
backFromCalculatorButton.addEventListener('click', showMainMenu);

// Permitir envío con Enter en el juego
answerInput.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        checkAnswer();
    }
});

// Mostrar el menú principal al cargar la página
window.onload = showMainMenu;

// Funciones para mostrar diferentes secciones
function showMainMenu() {
    clearInterval(timerInterval);
    mainMenuElement.style.display = 'flex';
    menuElement.style.display = 'none';
    gameElement.style.display = 'none';
    gameOverElement.style.display = 'none';
    matrixCalculatorElement.style.display = 'none';
}

function showGameMenu() {
    mainMenuElement.style.display = 'none';
    menuElement.style.display = 'flex';
    gameElement.style.display = 'none';
    gameOverElement.style.display = 'none';
    matrixCalculatorElement.style.display = 'none';
}

function showMatrixCalculator() {
    mainMenuElement.style.display = 'none';
    menuElement.style.display = 'none';
    gameElement.style.display = 'none';
    gameOverElement.style.display = 'none';
    matrixCalculatorElement.style.display = 'flex';
    clearMatrixMessage();
}

// ---- FUNCIONES DEL JUEGO MATEMÁTICO ----

// Iniciar juego
function startGame(level) {
    currentLevel = level;
    score = 0;
    updateScore();
    resetTimer();
    
    // Actualizar indicador de nivel
    switch(level) {
        case 'easy':
            levelDisplay.textContent = 'Nivel: Fácil';
            break;
        case 'medium':
            levelDisplay.textContent = 'Nivel: Medio';
            break;
        case 'hard':
            levelDisplay.textContent = 'Nivel: Difícil';
            break;
    }
    
    // Ocultar menú y mostrar juego
    menuElement.style.display = 'none';
    gameElement.style.display = 'flex';
    gameOverElement.style.display = 'none';
    
    // Generar primer problema
    generateProblem();
    
    // Iniciar temporizador
    startTimer();
    
    // Enfocar el campo de respuesta
    answerInput.focus();
}

// Generar problema según el nivel
function generateProblem() {
    hideFeedback();
    let problema = "";
    let answer = 0;
    
    switch(currentLevel) {
        case 'easy':
            // Suma o resta con números del 1 al 20
            const operacion = Math.random() < 0.5 ? '+' : '-';
            let a = Math.floor(Math.random() * 20) + 1;
            let b = Math.floor(Math.random() * 20) + 1;
            
            // Asegurar que la resta no dé un resultado negativo
            if (operacion === '-' && b > a) {
                [a, b] = [b, a];
            }
            
            problema = `${a} ${operacion} ${b} = ?`;
            answer = operacion === '+' ? a + b : a - b;
            break;
        
        case 'medium':
            // Suma, resta, multiplicación o división simple
            const opIndex = Math.floor(Math.random() * 4);
            const operaciones = ['+', '-', '×', '÷'];
            const op = operaciones[opIndex];
            
            if (op === '+' || op === '-') {
                // Suma o resta con números más grandes
                a = Math.floor(Math.random() * 100) + 1;
                b = Math.floor(Math.random() * 100) + 1;
                
                // Asegurar que la resta no dé un resultado negativo
                if (op === '-' && b > a) {
                    [a, b] = [b, a];
                }
                
                problema = `${a} ${op} ${b} = ?`;
                answer = op === '+' ? a + b : a - b;
            } else if (op === '×') {
                // Multiplicación
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 10) + 1;
                problema = `${a} ${op} ${b} = ?`;
                answer = a * b;
            } else {
                // División (asegurar resultados enteros)
                b = Math.floor(Math.random() * 10) + 1;
                answer = Math.floor(Math.random() * 10) + 1;
                a = b * answer;
                problema = `${a} ${op} ${b} = ?`;
            }
            break;
        
        case 'hard':
            // 40% chance de ecuación simple, 60% chance de operaciones complejas
            const isEquation = Math.random() < 0.4;
            
            if (isEquation) {
                // Ecuación simple del tipo ax + b = c
                const x = Math.floor(Math.random() * 10) + 1;
                const a = Math.floor(Math.random() * 5) + 1;
                const b = Math.floor(Math.random() * 20) + 1;
                const c = a * x + b;
                
                problema = `${a}x + ${b} = ${c}, x = ?`;
                answer = x;
            } else {
                // Operaciones mixtas
                const type = Math.floor(Math.random() * 3);
                
                if (type === 0) {
                    // (a + b) × c
                    a = Math.floor(Math.random() * 20) + 1;
                    b = Math.floor(Math.random() * 20) + 1;
                    const c = Math.floor(Math.random() * 10) + 1;
                    problema = `(${a} + ${b}) × ${c} = ?`;
                    answer = (a + b) * c;
                } else if (type === 1) {
                    // a × b + c
                    a = Math.floor(Math.random() * 10) + 1;
                    b = Math.floor(Math.random() * 10) + 1;
                    const c = Math.floor(Math.random() * 50) + 1;
                    problema = `${a} × ${b} + ${c} = ?`;
                    answer = a * b + c;
                } else {
                    // a² + b
                    a = Math.floor(Math.random() * 12) + 1;
                    b = Math.floor(Math.random() * 30) + 1;
                    problema = `${a}² + ${b} = ?`;
                    answer = a * a + b;
                }
            }
            break;
    }
    
    problemElement.textContent = problema;
    answerInput.value = '';
    currentProblem = { problem: problema, answer };
}

// Verificar respuesta
function checkAnswer() {
    const userAnswer = parseFloat(answerInput.value.trim());
    
    if (isNaN(userAnswer)) {
        showFeedback("Por favor ingresa un número válido.", false);
        return;
    }
    
    if (userAnswer === currentProblem.answer) {
        // Respuesta correcta
        score += getPointsForLevel();
        updateScore();
        showFeedback("¡Correcto!", true);
        resetTimer();
        setTimeout(() => {
            generateProblem();
        }, 1000);
    } else {
        // Respuesta incorrecta
        showFeedback("Incorrecto. La respuesta correcta era " + currentProblem.answer, false);
        setTimeout(() => {
            endGame();
        }, 1500);
    }
}

// Mostrar feedback
function showFeedback(message, isCorrect) {
    feedbackElement.textContent = message;
    feedbackElement.className = isCorrect ? 'feedback correct' : 'feedback incorrect';
    feedbackElement.style.display = 'block';
}

// Ocultar feedback
function hideFeedback() {
    feedbackElement.style.display = 'none';
}

// Actualizar puntuación
function updateScore() {
    scoreDisplay.textContent = `Puntos: ${score}`;
    finalScoreElement.textContent = score;
}

// Obtener puntos según el nivel
function getPointsForLevel() {
    switch(currentLevel) {
        case 'easy': return 1;
        case 'medium': return 2;
        case 'hard': return 5;
        default: return 1;
    }
}

// Terminar juego
function endGame() {
    clearInterval(timerInterval);
    gameElement.style.display = 'none';
    gameOverElement.style.display = 'flex';
}

// Funciones de temporizador
function startTimer() {
    clearInterval(timerInterval);
    timeLeft = getTimeForLevel();
    updateTimerDisplay();
    
    timerInterval = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timerInterval);
            showFeedback("¡Se acabó el tiempo!", false);
            setTimeout(() => {
                endGame();
            }, 1500);
        }
    }, 1000);
}

function resetTimer() {
    clearInterval(timerInterval);
    timeLeft = getTimeForLevel();
    updateTimerDisplay();
    startTimer();
}

function updateTimerDisplay() {
    timerDisplay.textContent = `Tiempo: ${timeLeft}s`;
    
    // Cambiar color cuando queda poco tiempo
    if (timeLeft <= 5) {
        timerDisplay.style.color = 'var(--danger-color)';
    } else if (timeLeft <= 10) {
        timerDisplay.style.color = 'var(--warning-color)';
    } else {
        timerDisplay.style.color = 'var(--secondary-color)';
    }
}

function getTimeForLevel() {
    switch(currentLevel) {
        case 'easy': return 30;
        case 'medium': return 25;
        case 'hard': return 40;
        default: return 30;
    }
}

// ---- FUNCIONES DE LA CALCULADORA DE MATRICES ----

// Operaciones con matrices
function addMatrices() {
    clearMatrixMessage();
    try {
        const matrixA = getMatrix('a');
        const matrixB = getMatrix('b');
        const result = [];
        
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(matrixA[i][j] + matrixB[i][j]);
            }
            result.push(row);
        }
        
        displayResult(result);
        showMatrixMessage("Suma de matrices A + B completada");
    } catch (error) {
        showMatrixMessage("Error al sumar matrices: " + error.message, true);
    }
}

function subtractMatrices() {
    clearMatrixMessage();
    try {
        const matrixA = getMatrix('a');
        const matrixB = getMatrix('b');
        const result = [];
        
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(matrixA[i][j] - matrixB[i][j]);
            }
            result.push(row);
        }
        
        displayResult(result);
        showMatrixMessage("Resta de matrices A - B completada");
    } catch (error) {
        showMatrixMessage("Error al restar matrices: " + error.message, true);
    }
}

function multiplyMatrices() {
    clearMatrixMessage();
    try {
        const matrixA = getMatrix('a');
        const matrixB = getMatrix('b');
        const result = [];
        
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                let sum = 0;
                for (let k = 0; k < 3; k++) {
                    sum += matrixA[i][k] * matrixB[k][j];
                }
                row.push(sum);
            }
            result.push(row);
        }
        
        displayResult(result);
        showMatrixMessage("Multiplicación de matrices A × B completada");
    } catch (error) {
        showMatrixMessage("Error al multiplicar matrices: " + error.message, true);
    }
}

function calculateInverse(matrixId) {
    clearMatrixMessage();
    try {
        const matrix = getMatrix(matrixId);
        
        // Calcular determinante
        const det = calculateDeterminant(matrix);
        
        if (Math.abs(det) < 0.0001) {
            showMatrixMessage(`La matriz ${matrixId.toUpperCase()} no tiene inversa (determinante = 0)`, true);
            return;
        }
        
        // Calcular matriz de cofactores
        const cofactorMatrix = calculateCofactorMatrix(matrix);
        
        // Calcular matriz adjunta (transpuesta de la matriz de cofactores)
        const adjMatrix = transposeMatrix(cofactorMatrix);
        
        // Multiplicar por 1/determinante
        const result = [];
        for (let i = 0; i < 3; i++) {
            const row = [];
            for (let j = 0; j < 3; j++) {
                row.push(adjMatrix[i][j] / det);
            }
            result.push(row);
        }
        
        displayResult(result);
        showMatrixMessage(`Matriz inversa de ${matrixId.toUpperCase()} calculada con éxito`);
    } catch (error) {
        showMatrixMessage(`Error al calcular la inversa de la matriz ${matrixId.toUpperCase()}: ${error.message}`, true);
    }
}

// Función para calcular el determinante de una matriz 3x3
function calculateDeterminant(matrix) {
    const a = matrix[0][0];
    const b = matrix[0][1];
    const c = matrix[0][2];
    const d = matrix[1][0];
    const e = matrix[1][1];
    const f = matrix[1][2];
    const g = matrix[2][0];
    const h = matrix[2][1];
    const i = matrix[2][2];
    
    return a * (e * i - f * h) - b * (d * i - f * g) + c * (d * h - e * g);
}

// Función para calcular la matriz de cofactores
function calculateCofactorMatrix(matrix) {
    const cofactorMatrix = [];
    
    for (let i = 0; i < 3; i++) {
        const cofactorRow = [];
        for (let j = 0; j < 3; j++) {
            // Calcular el menor eliminando la fila i y columna j
            const minor = calculateMinor(matrix, i, j);
            // Aplicar el signo (-1)^(i+j)
            const cofactor = Math.pow(-1, i + j) * minor;
            cofactorRow.push(cofactor);
        }
        cofactorMatrix.push(cofactorRow);
    }
    
    return cofactorMatrix;
}

// Función para calcular el menor de una matriz eliminando una fila y columna
function calculateMinor(matrix, row, col) {
    const subMatrix = [];
    
    for (let i = 0; i < 3; i++) {
        if (i === row) continue;
        
        const subRow = [];
        for (let j = 0; j < 3; j++) {
            if (j === col) continue;
            subRow.push(matrix[i][j]);
        }
        
        subMatrix.push(subRow);
    }
    
    // Calcular el determinante de la submatriz 2x2
    return subMatrix[0][0] * subMatrix[1][1] - subMatrix[0][1] * subMatrix[1][0];
}

// Función para transponer una matriz
function transposeMatrix(matrix) {
    const transposed = [];
    
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            row.push(matrix[j][i]);
        }
        transposed.push(row);
    }
    
    return transposed;
}

// Obtener matriz de los inputs
function getMatrix(matrixId) {
    const matrix = [];
    
    for (let i = 0; i < 3; i++) {
        const row = [];
        for (let j = 0; j < 3; j++) {
            const cellValue = parseFloat(document.getElementById(`${matrixId}-${i}-${j}`).value);
            row.push(isNaN(cellValue) ? 0 : cellValue);
        }
        matrix.push(row);
    }
    
    return matrix;
}

// Mostrar mensaje de operación
function showMatrixMessage(message, isError = false) {
    matrixMessageElement.textContent = message;
    matrixMessageElement.className = isError ? 'matrix-message error-message' : 'matrix-message success-message';
    matrixMessageElement.style.display = 'block';
}

// Limpiar mensaje
function clearMatrixMessage() {
    matrixMessageElement.textContent = '';
    matrixMessageElement.className = 'matrix-message';
    matrixMessageElement.style.display = 'none';
}

// Mostrar matriz en el resultado
function displayResult(resultMatrix) {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
            const cell = document.getElementById(`result-${i}-${j}`);
            cell.textContent = resultMatrix[i][j].toFixed(2).replace(/\.00$/, '');
        }
    }
}