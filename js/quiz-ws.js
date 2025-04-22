const questions = [
      { title: "Geography", question: "What is the capital of France?", options: ["Berlin", "Madrid", "Paris", "Rome"], correct: 2 },
      { title: "Math", question: "What is 5 × 6?", options: ["30", "25", "35", "36"], correct: 0 },
      { title: "Science", question: "Which gas do plants breathe in?", options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"], correct: 1 },
      { title: "History", question: "Who was the first President of the USA?", options: ["John Adams", "Thomas Jefferson", "George Washington", "Abraham Lincoln"], correct: 2 },
      { title: "Literature", question: "Who wrote Hamlet?", options: ["Hemingway", "Shakespeare", "Austen", "Orwell"], correct: 1 }
];

let currentQuestionIndex = 0;
let score = 0;
const userAnswers = Array(questions.length).fill(null);

const container = document.getElementById("quiz-container");
const questionArea = document.getElementById("question-area");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const progressBar = document.getElementById("progress-bar");
totalEl.textContent = questions.length;

function showQuickScreen() {
    document.getElementById('submit').addEventListener('click', QuizApp.getNextQuestion);
}

function updateProgress() {
  progressBar.style.width = ((currentQuestionIndex + 1) / questions.length) * 100 + "%";
}

function loadQuestion(index) {
  const q = questions[index];
  questionArea.innerHTML = "";

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
    loadQuestion(currentQuestionIndex);
    updateProgress();
  };

  const next = document.createElement("button");
  next.className = "submit-btn";
  next.textContent = index === questions.length - 1 ? "Finish" : "Next";
  next.style.marginLeft = "10px";
  next.onclick = () => {
    const selected = document.querySelector('input[name="quiz"]:checked');
    if (!selected) return alert("Please select an answer.");

    const ans = parseInt(selected.value);
    if (userAnswers[index] !== null && userAnswers[index] === questions[index].correct) score--;
    userAnswers[index] = ans;
    if (ans === questions[index].correct) score++;

    scoreEl.textContent = score;

    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      loadQuestion(currentQuestionIndex);
    } else {
      showResult();
    }
    updateProgress();
  };

  nav.appendChild(back);
  nav.appendChild(next);
  wrapper.appendChild(nav);
  questionArea.appendChild(wrapper);
}

function showResult() {
  questionArea.innerHTML = `<h2 class="quiz-title">Quiz Completed</h2><p class="quiz-question">You scored ${score} out of ${questions.length}</p>`;
  progressBar.style.width = '100%';
}

function closeQuiz() {
  container.style.transform = `translate(500px, -300px) scale(0)`;
  container.style.opacity = "0";
  setTimeout(() => container.style.display = "none", 800);
}