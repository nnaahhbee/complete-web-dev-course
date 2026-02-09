document.addEventListener('DOMContentLoaded', () => {

    const startBtn = document.getElementById('start-btn');
    const nexttBtn = document.getElementById('next-btn');
    const restartBtn = document.getElementById('restart-btn');
    const questionContainer = document.getElementById('question-container');
    const questionText = document.getElementById('question-text');
    const choicesList = document.getElementById('choices-list');
    const resultContainer = document.getElementById('result-container');
    const scoreDispaly = document.getElementById('score');

  
  // Sample questions for the quiz
    const questions = [
    {
      question: "What is the capital of France?",
      choices: ["Paris", "London", "Berlin", "Madrid"],
      answer: "Paris",
    },
    {
      question: "Which planet is known as the Red Planet?",
      choices: ["Mars", "Venus", "Jupiter", "Saturn"],
      answer: "Mars",
    },
    {
      question: "Who wrote 'Hamlet'?",
      choices: [
        "Charles Dickens",
        "Jane Austen",
        "William Shakespeare",
        "Mark Twain",
      ],
      answer: "William Shakespeare",
    },
  ];


  // Quiz state variables
  let currentQuestionIndex = 0;
  let score = 0;


  // Event listeners for buttons
  startBtn.addEventListener('click', startQuiz);
  
  nexttBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if(currentQuestionIndex < questions.length){
      showQuestion();
    }else{
      showResult();
    }
  });

  restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    resultContainer.classList.add('hidden');
    startQuiz();
  });



  // Function to start the quiz
  function startQuiz(){
    startBtn.classList.add('hidden');
    resultContainer.classList.add('hidden');
    questionContainer.classList.remove('hidden');
    showQuestion();
  }


  // Function to display the current question and choices
  function showQuestion(){
    nexttBtn.classList.add('hidden');
    questionText.textContent = questions[currentQuestionIndex].question;
    choicesList.innerHTML = ""; //clear previous choices
    questions[currentQuestionIndex].choices.forEach(choice => {
        const li = document.createElement('li');
        li.textContent = choice;
        li.addEventListener('click', (e) => selectAnswer(choice, e.target));
        choicesList.appendChild(li);
    });
  }



  // Function to handle answer selection
  function selectAnswer(choice, element){
    const allChoices = document.querySelectorAll('#choices-list li');
    allChoices.forEach(li => li.classList.remove('selected'));

    element.classList.add('selected');

    const correctAnswer = questions[currentQuestionIndex].answer;
    if(choice === correctAnswer){
      score++;
    }
    nexttBtn.classList.remove('hidden');
  }


  // Function to display the final result
  function showResult(){
    questionContainer.classList.add('hidden');
    resultContainer.classList.remove('hidden');
    scoreDispaly.textContent = `Your Score: ${score} out of ${questions.length}`;
  }
});

