//Get variables for elements on screen

var showOnStart = document.querySelectorAll(".displayOnStart");
var showOnEnd = document.querySelectorAll(".displayOnEnd");
var hideOnStart = document.querySelectorAll(".hideOnStart");
var choiceButtons = document.querySelectorAll(".choice");
var startButton = document.querySelector("#startButton");
var restartButton = document.querySelector("#restart");
var submitButton = document.querySelector("#submit");
var closeHighScores = document.querySelector(".close")
var timerEl = document.querySelector("#timer");
var highScoreButton = document.querySelector("#highScoreButton");
var questionText = document.querySelector("#question");
var scoreText = document.querySelector("#score");
var nameInput = document.querySelector("#score-text");
var popup = document.querySelector('#myPopup');
var popupScoreList = document.querySelector('.scoreList')

//Make variables for score, timer, answers, choices and questions #
var countDown = 60;
var score = 0;
var questionCount = 0;
var questions = [
    "Commonly used data types DO NOT include:",
    "Arrays in JavaScript can be used to store _____.",
    "A very useful tool used during development and debugging for printing content to the debugger is:",
    "Which of the following is NOT a javascript library?"
]
var choices = [
    ["strings", "booleans", "alerts", "numbers"],
    ["numbers and strings", "other arrays", "booleans", "all of the above"],
    ["javascript", "terminal/bash", "for loops", "console log"],
    ["CSS", "React", "jQuery", "Bootstrap"]
]
var answers = [2, 3, 3, 0]

//Make function for countdown timer

function startTimer() {
    countDown = 60;
    timerEl.textContent = "Timer: " + countDown;
    var timer = setInterval(function () {
        countDown--;
        timerEl.textContent = "Timer: " + countDown;
        if (countDown <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

//Make function to display necessary elements, hide unnecessary, and
//start timer on click of the start button

function startGame() {
    score = 0;
    for (i = 0; i < showOnStart.length; i++) {
        showOnStart[i].setAttribute("style", "display:block");
    }
    for (i = 0; i < hideOnStart.length; i++) {
        hideOnStart[i].setAttribute("style", "display:none");
    }
    for (i = 0; i < showOnEnd.length; i++) {
        showOnEnd[i].setAttribute("style", "display:none");
    }
    questionCount = 0;
    startTimer();
    refreshDisplay();
}


//Make function to display current question and choices

function refreshDisplay() {
    questionText.textContent = questions[questionCount]
    for (i = 0; i < choices[questionCount].length; i++) {
        var buttonText = choiceButtons[i]
        buttonText.textContent = (i + 1) + ". " + choices[questionCount][i]
    }
    scoreText.textContent = "Score: " + score;
}

//Make function for Game Over

function gameOver() {
    for (i = 0; i < showOnStart.length; i++) {
        showOnStart[i].setAttribute("style", "display:none");
    }
    countDown = 0;
    for (i = 0; i < showOnEnd.length; i++) {
        showOnEnd[i].setAttribute("style", "display:block");
    }
    submitButton.disabled = false;
    submitButton.textContent = "Submit"
}

// Make function to push score info

function pushScore() {
    var scoreInfo = {
        name: nameInput.value.trim(),
        score: score
    }

    // Saves only the 10 highest scores, in order, to local storage

    var unparsedScoreList = localStorage.getItem("highScores")
    if(unparsedScoreList === ''){
        var scoreList = [];
        scoreList.push(scoreInfo);
        localStorage.setItem("highScores", JSON.stringify(scoreList))
    }
    else {
        var scoreList = JSON.parse(localStorage.getItem("highScores"))
        scoreList.push(scoreInfo);
        var newScoreList = [];
        scoreList.sort((a, b) => (a.score < b.score) ? 1 : -1)
        for(i = 0; i < scoreList.length; i++){
            newScoreList[i] = scoreList[i];
        }
        localStorage.setItem("highScores", JSON.stringify(newScoreList))
    }
    submitButton.disabled = true;
    submitButton.textContent = "Score Submitted!";
    nameInput.value = '';
}

// Function to show and populate highscore list

function populateScore() {
    popupScoreList.innerHTML = '';
    var unparsedHighScoreList = localStorage.getItem('highScores');
    if(unparsedHighScoreList === '') {
        var message = document.createElement("LI");
        message.textContent = 'No scores have been submitted yet!'
        popupScoreList.appendChild(message)
    }
    else {
        var highScoreList = JSON.parse(localStorage.getItem('highScores'));
        for(i = 0; i < highScoreList.length; i++){
            var scoreItem = document.createElement("LI");
            var scoreChoice = highScoreList[i]
            var scoreCount = i + 1
            scoreItem.textContent = scoreCount + ". " + scoreChoice.name + " Score: " + scoreChoice.score;
            popupScoreList.appendChild(scoreItem);
    }
    }
    popup.setAttribute('style', 'visibility: visible');
}

// Function to run on start of page

function init() {

    //Use a for loop to add an event listener to each button, checking
    //if it is the right answer on click

    for (i = 0; i < choiceButtons.length; i++) {
        choiceButtons[i].addEventListener("click", function (event) {
            var choice = event.target
            var choiceNumber = 0
            for (i = 0; i < choiceButtons.length; i++) {
                if (choice === choiceButtons[i]) {
                    choiceNumber = i;
                }
            }
            if (choiceNumber === answers[questionCount]) {
                score = score + 10;
                if (questionCount < questions.length - 1) {
                    questionCount++;
                    refreshDisplay();
                }
                else {
                    gameOver();
                    refreshDisplay();
                }
            }
            else {
                countDown = countDown - 5;
                if (score > 0) {
                    score = score - 5;
                    refreshDisplay();
                }
            }
        })
    }

    // Add Event Listener to Start Button and Restart Button

    startButton.addEventListener("click", function (event) {
        startGame();
    });
    restartButton.addEventListener("click", function (event) {
        startGame();
    });
    submitButton.addEventListener("click", function (event) {
        pushScore();
    });
    highScoreButton.addEventListener("click", function (event) {
        populateScore();
    });
    closeHighScores.addEventListener("click", function (event) {
        popup.setAttribute('style', 'visibility: hidden');
    });
    submitButton.disabled = false;
    localStorage.setItem('highScores', '')
}

init();

// function populateScore() {
//     var scoreLength = document.getElementById("popupList").getElementsByTagName("li").length;
//     if(scoreLength > 0){
//         for(i = 0; i < scoreLength; i++){
//             scoreList.removeChild(scoreList.childNodes[i])
//         }
//     }
//     var scorez = JSON.parse(localStorage.getItem("highScores"));
//     for(i = 1; i < 10 ; i++){
//         if(i < scorez.length){
//             var listItem = document.createElement("LI")
//             listItem.classList.add("scoreText")
//             var scoreToPush = scorez[i]
//             listItem.textContent = [i] + ". " + scoreToPush.name + "   Score: " + scoreToPush.score
//             scoreList.appendChild(listItem);

//         }
//     }
//     var allText = document.querySelectorAll(".scoreText")
//     for(i = 0; i < allText.length; i++){
//             allText[i].classList.toggle("show");
//     }
// }
