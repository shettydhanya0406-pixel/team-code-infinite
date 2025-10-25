// Quiz Questions Data
const questions = [
    {
        q: "What is the capital of France?",
        opts: ["Berlin", "Paris", "Rome", "Madrid"],
        ans: 1,
        hint: "City of Love ❤️"
    },
    {
        q: "Who wrote the national anthem of India?",
        opts: ["Rabindranath Tagore", "Mahatma Gandhi", "Subhash Chandra Bose", "Nehru"],
        ans: 0,
        hint: "Nobel laureate 🏅"
    },
    {
        q: "Which planet is known as the Red Planet?",
        opts: ["Venus", "Earth", "Mars", "Jupiter"],
        ans: 2,
        hint: "Roman god of war ⚔️"
    },
    {
        q: "Who was the first President of India?",
        opts: ["Dr. Rajendra Prasad", "Sardar Patel", "Nehru", "Dr. Radhakrishnan"],
        ans: 0,
        hint: "Served 1950–1962 🇮🇳"
    },
    {
        q: "What is the largest ocean in the world?",
        opts: ["Atlantic", "Pacific", "Indian", "Arctic"],
        ans: 1,
        hint: "Covers one-third of Earth 🌊"
    },
    {
        q: "Which is the national animal of India?",
        opts: ["Elephant", "Tiger", "Lion", "Peacock"],
        ans: 1,
        hint: "Royal Bengal 🐯"
    },
    {
        q: "Who discovered gravity?",
        opts: ["Isaac Newton", "Einstein", "Galileo", "Tesla"],
        ans: 0,
        hint: "Apple fall 🍎"
    },
    {
        q: "Which is the smallest continent?",
        opts: ["Europe", "Australia", "Antarctica", "South America"],
        ans: 1,
        hint: "Also a country 🌏"
    },
    {
        q: "Which gas do plants absorb?",
        opts: ["Oxygen", "Carbon dioxide", "Nitrogen", "Helium"],
        ans: 1,
        hint: "Humans exhale it 🌿"
    },
    {
        q: "Which country is called Land of Rising Sun?",
        opts: ["China", "Japan", "Korea", "Thailand"],
        ans: 1,
        hint: "Cherry blossoms 🌸"
    }
];

// Game State
const gameState = {
    currentQuestionIndex: 0,
    coins: 0,
    timeLeft: 45,
    timer: null,
    currentStreak: 0,
    maxStreak: 0,
    powerups: {
        fiftyFifty: 2,
        skip: 1,
        freeze: 1
    }
};

// Timer Functions
function startTimer() {
    clearInterval(gameState.timer);
    const selectedTime = parseInt(document.querySelector(".diff-btn.active")?.dataset.time) || 45;
    gameState.timeLeft = selectedTime;
    updateTimerDisplay();
    
    gameState.timer = setInterval(() => {
        gameState.timeLeft--;
        updateTimerDisplay();
        
        if (gameState.timeLeft <= 0) {
            clearInterval(gameState.timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const timerEl = document.getElementById("time");
    const progress = document.getElementById("timerProgress");
    const totalTime = parseInt(document.querySelector(".diff-btn.active")?.dataset.time) || 45;
    
    timerEl.textContent = gameState.timeLeft;
    
    // Update circular progress
    const dashArray = 283;
    const dashOffset = dashArray * (1 - gameState.timeLeft / totalTime);
    progress.style.strokeDasharray = dashArray;
    progress.style.strokeDashoffset = dashOffset;
    
    // Update color based on time
    if (gameState.timeLeft <= 10) {
        progress.style.stroke = "#ef4444";
    } else if (gameState.timeLeft <= 20) {
        progress.style.stroke = "#f59e0b";
    } else {
        progress.style.stroke = "#00d4ff";
    }
}

// Question Functions
function loadQuestion() {
    const feedbackModal = document.getElementById("feedbackModal");
    const nextBtn = document.getElementById("nextBtn");
    
    feedbackModal.classList.add("hidden");
    nextBtn.style.display = "none";
    
    const question = questions[gameState.currentQuestionIndex];
    
    // Update question number and category
    document.getElementById("questionNumber").textContent = `Q${gameState.currentQuestionIndex + 1}/10`;
    document.getElementById("category").textContent = "GENERAL";
    
    // Update question text
    document.getElementById("question").textContent = question.q;
    
    // Reset hint
    document.getElementById("hint").classList.add("hidden");
    document.getElementById("hintBtn").disabled = false;
    
    // Create option buttons
    const optionsContainer = document.getElementById("options");
    optionsContainer.innerHTML = "";
    question.opts.forEach((option, index) => {
        const btn = document.createElement("button");
        btn.className = "option-btn";
        btn.textContent = option;
        btn.onclick = () => checkAnswer(index, btn);
        optionsContainer.appendChild(btn);
    });
    
    // Update displays
    document.getElementById("score").textContent = gameState.coins;
    document.getElementById("streak").textContent = gameState.currentStreak;
    
    // Update progress
    document.getElementById("progress").style.width = 
        `${(gameState.currentQuestionIndex / questions.length) * 100}%`;
    document.getElementById("progressText").textContent = 
        `${gameState.currentQuestionIndex + 1}/10`;
    
    startTimer();
    updatePowerups();
}

function checkAnswer(selectedIndex, selectedBtn) {
    clearInterval(gameState.timer);
    disableOptions();
    
    const correctIndex = questions[gameState.currentQuestionIndex].ans;
    const feedbackModal = document.getElementById("feedbackModal");
    const feedbackContent = document.getElementById("feedbackContent");
    
    if (selectedIndex === correctIndex) {
        selectedBtn.classList.add("correct");
        gameState.currentStreak++;
        gameState.maxStreak = Math.max(gameState.maxStreak, gameState.currentStreak);
        gameState.coins += 10;
        
        feedbackContent.textContent = "🎉 Congratulations! You got it right! 😎";
        document.getElementById("correctSound").play();
    } else {
        selectedBtn.classList.add("wrong");
        document.querySelectorAll(".option-btn")[correctIndex].classList.add("correct");
        gameState.currentStreak = 0;
        
        feedbackContent.textContent = "😢 Oops! Better luck next time!";
        document.getElementById("wrongSound").play();
    }
    
    // Show feedback and update scores
    feedbackModal.classList.remove("hidden");
    document.getElementById("score").textContent = gameState.coins;
    document.getElementById("streak").textContent = gameState.currentStreak;
    
    // Show and position the next button
    const nextBtn = document.getElementById("nextBtn");
    nextBtn.style.display = "flex";
    nextBtn.classList.remove("hidden");
}

// Power-up Functions
function updatePowerups() {
    Object.entries(gameState.powerups).forEach(([type, count]) => {
        const btn = document.getElementById(type);
        if (btn) {
            btn.querySelector(".powerup-count").textContent = count;
            btn.disabled = count === 0;
        }
    });
}

// Helper Functions
function disableOptions() {
    document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
}

function handleTimeout() {
    gameState.currentStreak = 0;
    document.getElementById("streak").textContent = gameState.currentStreak;
    
    const feedbackModal = document.getElementById("feedbackModal");
    const feedbackContent = document.getElementById("feedbackContent");
    feedbackContent.textContent = "⏰ Time's up! Better luck next time! 😢";
    feedbackModal.classList.remove("hidden");
    
    document.getElementById("wrongSound").play();
    showCorrectAnswer();
    document.getElementById("nextBtn").style.display = "flex";
}

function showCorrectAnswer() {
    const correctIndex = questions[gameState.currentQuestionIndex].ans;
    document.querySelectorAll(".option-btn")[correctIndex].classList.add("correct");
}

// Game Flow Functions
function initQuiz() {
    Object.assign(gameState, {
        currentQuestionIndex: 0,
        coins: 0,
        currentStreak: 0,
        maxStreak: 0,
        powerups: {
            fiftyFifty: 2,
            skip: 1,
            freeze: 1
        }
    });
    
    document.getElementById("startScreen").classList.add("hidden");
    document.getElementById("quizScreen").classList.remove("hidden");
    document.getElementById("resultsScreen").classList.add("hidden");
    document.getElementById("leaderboardScreen").classList.add("hidden");
    
    loadQuestion();
}

function endQuiz() {
    clearInterval(gameState.timer);
    
    document.getElementById("quizScreen").classList.add("hidden");
    document.getElementById("resultsScreen").classList.remove("hidden");
    
    document.getElementById("finalScore").textContent = gameState.coins;
    document.getElementById("correctAnswers").textContent = gameState.coins / 10;
    document.getElementById("wrongAnswers").textContent = questions.length - (gameState.coins / 10);
    document.getElementById("maxStreak").textContent = gameState.maxStreak;
    document.getElementById("accuracy").textContent = 
        Math.round((gameState.coins / 10 / questions.length) * 100) + "%";
}

// Leaderboard Functions
function updateLeaderboardPreview() {
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
    const topScores = document.getElementById("topScores");
    
    topScores.innerHTML = scores.slice(0, 3).map((score, index) => `
        <div class="score-item">
            <span class="score-rank">#${index + 1}</span>
            <span class="score-name">${score.name}</span>
            <span class="score-coins">💎 ${score.score}</span>
        </div>
    `).join("");
}

function updateLeaderboard() {
    const scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
    const leaderboardList = document.getElementById("leaderboardList");
    
    leaderboardList.innerHTML = scores.map((score, index) => `
        <div class="score-item">
            <span class="score-rank">#${index + 1}</span>
            <span class="score-name">${score.name}</span>
            <span class="score-coins">💎 ${score.score}</span>
        </div>
    `).join("");
}

// Event Listeners
document.addEventListener("DOMContentLoaded", () => {
    // Difficulty Selection
    document.querySelectorAll(".diff-btn").forEach(btn => {
        btn.onclick = () => {
            document.querySelector(".diff-btn.active")?.classList.remove("active");
            btn.classList.add("active");
        };
    });
    
    // Start Button
    document.getElementById("startBtn").onclick = initQuiz;
    
    // Next Button
    document.getElementById("nextBtn").onclick = () => {
        document.getElementById("feedbackModal").classList.add("hidden");
        gameState.currentQuestionIndex++;
        
        if (gameState.currentQuestionIndex < questions.length) {
            loadQuestion();
        } else {
            endQuiz();
        }
    };
    
    // Power-up: 50/50
    document.getElementById("fiftyFifty").onclick = () => {
        if (gameState.powerups.fiftyFifty > 0) {
            gameState.powerups.fiftyFifty--;
            const correctAnswer = questions[gameState.currentQuestionIndex].ans;
            const options = [...document.querySelectorAll(".option-btn")];
            const wrongAnswers = options.filter((_, index) => index !== correctAnswer);
            
            for (let i = 0; i < 2; i++) {
                const randomIndex = Math.floor(Math.random() * wrongAnswers.length);
                wrongAnswers[randomIndex].classList.add("eliminated");
                wrongAnswers.splice(randomIndex, 1);
            }
            
            document.getElementById("powerupSound").play();
            updatePowerups();
        }
    };
    
    // Power-up: Skip
    document.getElementById("skipQuestion").onclick = () => {
        if (gameState.powerups.skip > 0) {
            gameState.powerups.skip--;
            document.getElementById("powerupSound").play();
            gameState.currentQuestionIndex++;
            
            if (gameState.currentQuestionIndex < questions.length) {
                loadQuestion();
            } else {
                endQuiz();
            }
            updatePowerups();
        }
    };
    
    // Power-up: Freeze
    document.getElementById("freezeTime").onclick = () => {
        if (gameState.powerups.freeze > 0) {
            gameState.powerups.freeze--;
            gameState.timeLeft += 15;
            updateTimerDisplay();
            document.getElementById("powerupSound").play();
            updatePowerups();
        }
    };
    
    // Hint Button
    document.getElementById("hintBtn").onclick = () => {
        if (gameState.coins >= 5) {
            gameState.coins -= 5;
            document.getElementById("score").textContent = gameState.coins;
            const hintContent = document.getElementById("hint");
            hintContent.textContent = questions[gameState.currentQuestionIndex].hint;
            hintContent.classList.remove("hidden");
            document.getElementById("hintBtn").disabled = true;
        }
    };
    
    // Play Again Button
    document.getElementById("playAgainBtn").onclick = () => {
        document.getElementById("resultsScreen").classList.add("hidden");
        document.getElementById("quizScreen").classList.remove("hidden");
        initQuiz();
    };
    
    // Save Score Button
    document.getElementById("saveScoreBtn").onclick = () => {
        const playerName = document.getElementById("playerName").value;
        if (playerName) {
            const scores = JSON.parse(localStorage.getItem("quizScores") || "[]");
            scores.push({ name: playerName, score: gameState.coins });
            scores.sort((a, b) => b.score - a.score);
            localStorage.setItem("quizScores", JSON.stringify(scores.slice(0, 10)));
            
            document.getElementById("resultsScreen").classList.add("hidden");
            document.getElementById("leaderboardScreen").classList.remove("hidden");
            updateLeaderboard();
        }
    };
    
    // Back to Results Button
    document.getElementById("backToResultsBtn").onclick = () => {
        document.getElementById("leaderboardScreen").classList.add("hidden");
        document.getElementById("resultsScreen").classList.remove("hidden");
    };
    
    // Initialize leaderboard
    updateLeaderboardPreview();
});