import { loadHTML } from './utils.js';
    
export function showQuiz(id, url, city, callback) {
    loadHTML(id, url, function () {
        loadQuestion(city, 0);
        
        if (callback) callback();
    });
}

window.showQuiz = showQuiz;

let stopTimer = false;
let currentQuestionIndex = 0;
let score = 0;
let userAnswers;

let selectedCityQuestions;
let finishButtonText = "Finish";
let subitButtonText = "Submit";

const questions = [
    { loc: "Bolivia", title: "Bolivia - Water Filter Plant", detail: "City in the southern highlands.", question: "Find captial city?", options: ["Sucre", "Bangalore", "Chennai", "Mumbai"], correct: 0 },
    { loc: "Sudan", title: "Sudan - Clean Water Truck", detail: "With access to a tanker truck filled with disease-free drinking water, the health, sanitation and well being of a whole community improves especially for the children.", question: "To deliver one truck per year how much per month?", image: "sudanWaterTruck.png", options: ["100€", "200€", "300€", "500€"], timeout: 25, correct: 0 },
    { loc: "Gaza", title: "Gaza - Food For A Day", detail: "1 full meal a day", question: "Find captial city?", options: ["New Delhi", "Gaza City", "Chennai", "Mumbai"], correct: 1 },
    { loc: "Ukraine", title: "Ukraine - Humanitarian And Medical Aid", detail: "Join to make difference", question: "Find captial city?", options: ["New Delhi", "Bangalore", "Kviv", "Mumbai"], correct: 2 },
    { loc: "Kenya", title: "Kenya - Drinking Water Plant", detail: "Clean driniking water", question: "Find captial city?", options: ["Nairobi", "Bangalore", "Chennai", "Mumbai"], correct: 0 },
    { loc: "Bangladesh", title: "Bangladesh - Water Filter Plant", detail: "Help Bangladesh children", question: "Find captial city?", options: ["New Delhi", "Bangalore", "Chennai", "Dhaka"], correct: 3 },
    { loc: "Afghanistan", title: "Afghanistan - Water Filter Plant", detail: "2.6 million registered Afghan refugees in the world.", question: "Find captial city?", options: ["New Delhi", "Kabul", "Chennai", "Mumbai"], correct: 1 },
    { loc: "Mexico", title: "Mexico - Donate for children healthcare.", detail: "Provide education, healthcare, and protection to vulnerable children", question: "Find captial city?", options: ["New Delhi", "Bangalore", "Chennai", "Mexico City"], correct: 3 }
];

function loadQuestion(city, index) {
    const container = document.getElementById("gameContainer");
    const gameQuestionArea = document.getElementById("gameQuestionArea");
    const gameTitle = document.getElementById("gameTitle");
    const gameQuestion = document.getElementById("gameQuestion");
    const gameImage = document.getElementById("gameImage");
    const backButton = document.getElementById("backButton");
    const submitButton = document.getElementById("submitButton");
    const gameScore = document.getElementById("score");
    const gameTotal = document.getElementById("total");
    const gameProgressBar = document.getElementById("progress-bar");
    gameQuestion.innerHTML = "";
    
    userAnswers = Array(questions.length).fill(null);
    selectedCityQuestions = questions.filter(item => item.loc === city);
    
    gameTotal.textContent = selectedCityQuestions.length;
    const q = selectedCityQuestions[index];

    gameTitle.textContent = q.title;
    
    const qDetail = document.createElement('p');
    qDetail.classList.add('question-content');
    qDetail.textContent = q.detail;
    gameQuestion.appendChild(qDetail);
    
    const qQuestion = document.createElement('p');
    qQuestion.classList.add('question-content');
    qQuestion.textContent = q.question
    
    gameQuestion.appendChild(qQuestion);
    
    if(!q.image) {
        q.image = "stc-logo.png";
    }
    
    gameImage.src = `img/${q.image}`; 

    const table = document.createElement("table");

    q.options.forEach((opt, i) => {
        const tr = document.createElement("tr");

        const tdText = document.createElement("td");
        tdText.textContent = opt;
        tdText.className = "option-text-cell";

        const tdBtn = document.createElement("td");
        tdBtn.className = "option-btn-cell";

        const radio = document.createElement("input");
        radio.type = "radio";
        radio.name = "gameOptions";
        radio.value = i;
        if (userAnswers[index] === i) radio.checked = true;

        tdBtn.appendChild(radio);
        tr.appendChild(tdText);
        tr.appendChild(tdBtn);
        table.appendChild(tr);
    });

    gameQuestion.appendChild(table);
    
    if(index > 0)
    {
        backButton.onclick = () => {
            currentQuestionIndex--;
            loadQuestion(city, currentQuestionIndex);
            updateProgress();
        };
        backButton.style.display = "block";
    }
    else {
        backButton.style.display = "none";
    }
    
    submitButton.textContent = index === questions.length - 1 ? finishButtonText : subitButtonText;
    submitButton.style.marginLeft = "10px";
    submitButton.onclick = () => {
        if(submitButton.textContent === finishButtonText) {
            document.getElementById('gameCloseBtn').click();
            return;
        }
        
        stopTimer = true;
        const selected = document.querySelector('input[name="gameOptions"]:checked');
        if (!selected) 
            return alert("Please select an answer.");

        const ans = parseInt(selected.value);
        if (userAnswers[index] !== null && userAnswers[index] === selectedCityQuestions[index].correct) 
            score--;
        userAnswers[index] = ans;
        if (ans === selectedCityQuestions[index].correct) 
            score++;

        gameScore.textContent = score;
        if (currentQuestionIndex < selectedCityQuestions.length - 1) {
            
          currentQuestionIndex++;
          loadQuestion(city, currentQuestionIndex);
        } else {
          showResult(gameQuestionArea, gameProgressBar);
        }
        updateProgress(gameProgressBar);
    };

    startTimer(q.timeout, 0);
}

function updateProgress(progressBar) {
    if(selectedCityQuestions && progressBar) {
        progressBar.style.width = (currentQuestionIndex / selectedCityQuestions.length) * 80 + "%";
    }
}

function showResult(questionArea, progressBar) {
    questionArea.innerHTML = `<h2 class="quiz-title">Quiz Completed</h2><p class="quiz-question">You scored ${score} out of ${selectedCityQuestions.length}</p>`;
    progressBar.style.width = '100%';
    currentQuestionIndex = 0;
    selectedCityQuestions = null;
    score = 0;
    userAnswers = null;
    const submitButton = document.getElementById("submitButton");
    submitButton.textContent = finishButtonText;
    document.getElementById("backButton").style.display = "none";
    
}

function startTimer(timeoutSecs) {
    let pageTimeoutSecs = 30;
    let timerStarted = false;
    const button = document.getElementById('submitButton');
    const buttonText = button.textContent;
    
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !timerStarted) {
            timerStarted = true;

            const countdown = setInterval(() => {
                pageTimeoutSecs--;
                if (pageTimeoutSecs > 0 && !stopTimer) {
                    if(pageTimeoutSecs <= timeoutSecs) {
                        button.style.fontWeight = "bold";
                        button.textContent =  buttonText + ` ${pageTimeoutSecs}`;
                        
                        const ripple = document.createElement('span');
                        ripple.classList.add('ripple');
                        ripple.style.left = button.style.left;
                        ripple.style.top = button.style.top;
                        ripple.style.width = button.style.width;
                        ripple.style.height = button.style.height;
                        button.appendChild(ripple);

                        ripple.addEventListener('animationend', () => {
                            ripple.remove();
                            });
                    }
                } else {
                    clearInterval(countdown);
                    if(!selectedCityQuestions) {
                        button.textContent =  finishButtonText;    
                    }
                    else {
                        button.textContent =  buttonText;
                    }
                    button.style.fontWeight = "";
                }
            }, 1000);
        }
      });
    });
    
    observer.observe(button);
}
