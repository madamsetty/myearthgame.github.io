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
      { title: "New York", question: "Is there a park in city?", options: ["Central Park", "Madrid", "Paris", "Rome"], correct: 0 },
      { title: "New York", question: "What is 5 × 6?", options: ["30", "25", "35", "36"], correct: 0 },
      { title: "New Delhi", question: "What is the host country?", options: ["India", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 0 },
      { title: "New Delhi", question: "Who was the first President of the India?", options: ["John Adams", "Nehru", "George Washington", "Abraham Lincoln"], correct: 1 },
      { title: "New Delhi", question: "What is nearest city?", options: ["Hamlet", "Shakespeare", "Austen", "Noida"], correct: 3 }
];

//function showQuickScreen() {
//    document.getElementById('submit').addEventListener('click', QuizApp.getNextQuestion);//
//}

function loadQuestion(city, index) {
    const container = document.getElementById("quiz-container");
    const questionArea = document.getElementById("question-area");
    const scoreEl = document.getElementById("score");
    const totalEl = document.getElementById("total");
    const progressBar = document.getElementById("progress-bar");
    questionArea.innerHTML = "";
    
    userAnswers = Array(questions.length).fill(null)
    selectedCityQuestions = questions.filter(item => item.title === city)
    
    totalEl.textContent = selectedCityQuestions.length;
    const q = selectedCityQuestions[index];
    console.log(selectedCityQuestions);

    const wrapper = document.createElement("div");
    wrapper.classList.add("quiz-question");

    const title = document.createElement("h2");
    title.classList.add("quiz-title");
    title.textContent = q.title;
    wrapper.appendChild(title);

    const question = document.createElement("p");
    question.textContent = q.question;
    wrapper.appendChild(question);

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
        radio.name = "quiz";
        radio.value = i;
        if (userAnswers[index] === i) radio.checked = true;

        tdBtn.appendChild(radio);
        tr.appendChild(tdText);
        tr.appendChild(tdBtn);
        table.appendChild(tr);
    });

    wrapper.appendChild(table);

    const nav = document.createElement("div");
    nav.style.marginTop = "20px";

    const back = document.createElement("button");
    back.className = "submit-btn";
    back.textContent = "Back";
    back.disabled = index === 0;
    back.onclick = () => {
        currentQuestionIndex--;
        loadQuestion(city, currentQuestionIndex);
        updateProgress();
    };

    const next = document.createElement("button");
    next.className = "submit-btn";
    next.textContent = index === questions.length - 1 ? "Finish" : "Next";
    next.style.marginLeft = "10px";
    next.onclick = () => {
        const selected = document.querySelector('input[name="quiz"]:checked');
        if (!selected) 
            return alert("Please select an answer.");

        const ans = parseInt(selected.value);
        console.log("Ans: ", ans, ", correct ans:", selectedCityQuestions[index].correct);
        if (userAnswers[index] !== null && userAnswers[index] === selectedCityQuestions[index].correct) 
            score--;
        userAnswers[index] = ans;
        if (ans === selectedCityQuestions[index].correct) 
            score++;

        scoreEl.textContent = score;
        console.log("selectedCityQuestions: ", selectedCityQuestions);
        if (currentQuestionIndex < selectedCityQuestions.length - 1) {
            
          currentQuestionIndex++;
          loadQuestion(city, currentQuestionIndex);
        } else {
          showResult(questionArea, progressBar);
        }
        updateProgress(progressBar);
    };

    nav.appendChild(back);
    nav.appendChild(next);
    wrapper.appendChild(nav);
    questionArea.appendChild(wrapper);
}

function updateProgress(progressBar) {
    console.log("currentQuestionIndex:", currentQuestionIndex, ", selectedCityQuestions len:", selectedCityQuestions.length, ", progress: ", ((currentQuestionIndex + 1) / selectedCityQuestions.length) * 100 + "%");
    progressBar.style.width = ((currentQuestionIndex) / selectedCityQuestions.length) * 100 + "%";
}

function showResult(questionArea, progressBar) {
    questionArea.innerHTML = `<h2 class="quiz-title">Quiz Completed</h2><p class="quiz-question">You scored ${score} out of ${selectedCityQuestions.length}</p>`;
    progressBar.style.width = '100%';
    currentQuestionIndex = 0;
    selectedCityQuestions = null;
    score = 0;
    userAnswers = null;
}
