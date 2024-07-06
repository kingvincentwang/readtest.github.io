function loadCSV(callback) {
        fetch('/var/file/63/1063/img/question1.csv')
            .then(response => response.text())
            .then(csv => {
                const lines = csv.split('\n');
                const questions = [];
                for (let i = 1; i < lines.length; i++) {
                    const [question, option1, option2, option3, option4, correct] = lines[i].split(',');
                    questions.push({
                        question,
                        options: [option1, option2, option3, option4],
                        correct: correct ? correct.trim() : null // Check if correct exists before trimming
                    });
                }
                const randomQuestions = getRandomQuestions(questions, 10);
                callback(randomQuestions);
            });
    }

    // Get a random subset of questions
    function getRandomQuestions(questions, count) {
        const shuffledQuestions = questions.sort(() => Math.random() - 0.5);
        return shuffledQuestions.slice(0, count);
    }

    let questions;
    let selectedAnswers = [];
    let correctCount = 0;

    // Initialize the quiz
    function initializeQuiz() {
        loadCSV(data => {
            questions = data;
            displayQuestions();
        });
    }

    // Display all questions
    function displayQuestions() {
        const questionsContainer = document.getElementById('questions-container');
        
        questions.forEach((question, questionIndex) => {
            const questionDiv = document.createElement('div');
            questionDiv.classList.add('question');
            questionDiv.textContent = `${questionIndex + 1}. ${question.question}`;
            questionsContainer.appendChild(questionDiv);

            const optionsContainer = document.createElement('div');
            optionsContainer.classList.add('options');

            question.options.forEach((option, index) => {
                const optionElement = document.createElement('div');
                optionElement.classList.add('option');

                const radioInput = document.createElement('input');
                radioInput.type = 'radio';
                radioInput.name = `question${questionIndex}`;
                radioInput.value = index;
                radioInput.id = `q${questionIndex}option${index}`;
                radioInput.addEventListener('change', () => selectAnswer(questionIndex, index));

                const label = document.createElement('label');
                label.textContent = option;
                label.setAttribute('for', `q${questionIndex}option${index}`);

                optionElement.appendChild(radioInput);
                optionElement.appendChild(label);
                optionsContainer.appendChild(optionElement);
            });

            questionsContainer.appendChild(optionsContainer);
        });
    }

    // Select an answer for a specific question
    function selectAnswer(questionIndex, selectedIndex) {
        selectedAnswers[questionIndex] = selectedIndex;
    }

    // Submit the quiz and check all answers
    function submitQuiz() {
        correctCount = 0;

        questions.forEach((question, questionIndex) => {
            const selectedIndex = selectedAnswers[questionIndex];

            if (selectedIndex === undefined) {
                //alert(`Please answer Question ${questionIndex + 1}`);
            } else {
                checkAnswer(questionIndex, selectedIndex);
            }
        });

        const resultElement = document.getElementById('result');
		const sscore = correctCount * 10;
        resultElement.textContent = `你的分數是： ${sscore} 分!!`;
		const submitButton = document.querySelector('.submit-button');
        submitButton.style.display = 'none';
		send(sscore);      
        
	}
	//送至google sheets
	function send(sscore) {
			let sclass = document.querySelector('#classInput').value;
			let sname = document.querySelector('#nameInput').value;
            console.log(sscore);
		$.ajax({
          url: "https://script.google.com/macros/s/AKfycbwcFoaaL5p-nWAvk_CwtJ7x886eioPgijY3amP1kDaURQq01DgHwSs1NpO5DtgnI-Io_w/exec",
          data: {
           "sclass": sclass,
           "sname": sname,
           "sscore": sscore
            },
           success: function(response) {
             if(response == "成功"){
                alert("寫入成績成功");
		        alert("成績："+sscore+"分");
              }
            },
         });
    	}
	
	
    // Check the selected answer for a specific question
    function checkAnswer(questionIndex, selectedIndex) {
        const currentQuestion = questions[questionIndex];
        const correctAnswer = currentQuestion.correct ? currentQuestion.correct.replace(/\s/g, '') : null; // Remove spaces if correct exists
        const selectedAnswer = currentQuestion.options[selectedIndex].replace(/\s/g, ''); // Remove spaces

        if (selectedAnswer === correctAnswer) {
            correctCount++;
        }
    }

    // Initialize the quiz when the page loads
    window.onload = initializeQuiz;