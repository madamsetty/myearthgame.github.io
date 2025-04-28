import { loadHTML } from './utils.js';
    
export function showQuiz(id, url, city, callback) {
    console.log("In showQuiz, city: '", city, "'");
    loadHTML(id, url, function () {
        loadQuestion(city, 0);
        
        if (callback) callback();
    });
}

// Make globally accessible
window.showQuiz = showQuiz;

let currentQuestionIndex = 0;
    let score = 0;
    let userAnswers;
    
    let selectedCityQuestions;

const questions = [
    { loc: "New York", title: "New York", question: "Is there a park in city?", options: ["Central Park", "Madrid", "Paris", "Rome"], correct: 0 },
    { loc: "New York", title: "New York", question: "What is 5 × 6?", options: ["30", "25", "35", "36"], correct: 0 },
    { loc: "New Delhi", title: "New Delhi", question: "What is the host country?", options: ["India", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 0 },
    { loc: "New Delhi", title: "New Delhi", question: "Who was the first President of the India?", options: ["John Adams", "Nehru", "George Washington", "Abraham Lincoln"], correct: 1 },
    { loc: "New Delhi", title: "New Delhi", question: "What is nearest city?", options: ["Hamlet", "Shakespeare", "Austen", "Noida"], correct: 3 },
    { loc: "Sudan", title: "Clean Water Truck", question: "* With access to a tanker truck filled with disease free drinking water, the health, sanitation and well being of a whole community improves especially for the children.\r\nTo deliver one truck per year how much per month?", image: "sudanWaterTruck.png", options: ["100€", "200€", "300€", "500€"], correct: 0 }
];

//function showQuickScreen() {
//    document.getElementById('submit').addEventListener('click', QuizApp.getNextQuestion);//
//}

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
    
    userAnswers = Array(questions.length).fill(null)
    selectedCityQuestions = questions.filter(item => item.loc === city)
console.log("Location:", city, ", array:", selectedCityQuestions);
    
    gameTotal.textContent = selectedCityQuestions.length;
    const q = selectedCityQuestions[index];

    gameTitle.textContent = q.title;
    gameQuestion.textContent = q.question;
    gameImage.style.backgroundImage = `url(img/${q.image})`; 

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
    
    submitButton.textContent = index === questions.length - 1 ? "Finish" : "Submit";
    submitButton.style.marginLeft = "10px";
    submitButton.onclick = () => {
        const selected = document.querySelector('input[name="gameOptions"]:checked');
        if (!selected) 
            return alert("Please select an answer.");

        const ans = parseInt(selected.value);
console.log("Ans: ", ans, ", correct ans:", selectedCityQuestions[index].correct);
        if (userAnswers[index] !== null && userAnswers[index] === selectedCityQuestions[index].correct) 
            score--;
        userAnswers[index] = ans;
        if (ans === selectedCityQuestions[index].correct) 
            score++;

        gameScore.textContent = score;
console.log("selectedCityQuestions: ", selectedCityQuestions);
        if (currentQuestionIndex < selectedCityQuestions.length - 1) {
            
          currentQuestionIndex++;
          loadQuestion(city, currentQuestionIndex);
        } else {
          showResult(gameQuestionArea, gameProgressBar);
        }
        updateProgress(gameProgressBar);
    };

    //questionArea.appendChild(wrapper);
}

function updateProgress(progressBar) {
    console.log("currentQuestionIndex:", currentQuestionIndex, ", selectedCityQuestions len:", selectedCityQuestions.length, ", progress: ", ((currentQuestionIndex + 1) / selectedCityQuestions.length) * 100 + "%");
    progressBar.style.width = ((currentQuestionIndex) / selectedCityQuestions.length) * 80 + "%";
}

function showResult(questionArea, progressBar) {
    questionArea.innerHTML = `<h2 class="quiz-title">Quiz Completed</h2><p class="quiz-question">You scored ${score} out of ${selectedCityQuestions.length}</p>`;
    progressBar.style.width = '100%';
    currentQuestionIndex = 0;
    selectedCityQuestions = null;
    score = 0;
    userAnswers = null;
}
