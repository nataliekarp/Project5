const QUESTIONS = [
    {
        question: "When is Harry Potter's birthday?",
        answers: ["30 July 1980", "31 July 1980", "31 July 1980", "31 July 1981"],
        correctAnswer: 2
    },
    {
        question: "What is Harry's middle name?",
        answers: ["Albus", "Peter", "James", "Sirius"],
        correctAnswer: 2
    },
    {
        question: "Which Muggle school was Harry supposed to attend before getting his Hogwarts letter?",
        answers: ["St Brutus's", "Stonewall High", "Smeltings", "Cokeworth High"],
        correctAnswer: 1
    },
    {
        question: "In which book does Harry find the name for his pet owl, Hedwig?",
        answers: ["The dark forces", "Hogwarts: History", "Fantastic Beasts", "A History of Magic"],
        correctAnswer: 3
    },
    {
        question: "How many birthday cakes did Harry receive when he turned 14?",
        answers: ["3", "5", "4", "2"],
        correctAnswer: 3
    },
    {
        question: "Which grade is Harry awarded for his History of Magic O.W.L. exam?",
        answers: ["A", "D", "P", "E"],
        correctAnswer: 1
    },
]

const STATE = {
    START: 1,
    QUESTION: 2,
    CORRECT_ANSWER: 3,
    INCORRECT_ANSWER: 4,
    TIMEOUT: 5,
    END: 6,
    sections: ["", "start_section", "question_section", "correct_answer_section", "incorrect_answer_section", "timeout_section", "end_section",],
}

const SEC_PER_QUESTION = 30;
const SEC_AFTER_ANSWER = 3;

function Game(questions) {
    this.questions = questions;
    this.refresh(STATE.START);

    for (var i = 0; i < 4; i++) {
        document.getElementById("answer_" + i).onclick = (function(self, ii) {
            return function(event) {
                self.answer(ii);
            }    
        })(this, i);
    }    
    document.getElementById("start").onclick = (function(self) {
        return function(event) {
            self.start();
        }    
    })(this);
    document.getElementById("start_over").onclick = (function(self) {
        return function(event) {
            self.start();
        }    
    })(this);
};

Game.prototype.start = function() {
    this.question = 0;
    this.correct = 0;
    this.incorrect = 0;
    this.timedout = 0;
    this.refresh(STATE.QUESTION);
};

Game.prototype.answer = function(a) {
    clearInterval(this.interval);
    if (a == this.questions[this.question].correctAnswer) {
        this.correct += 1;
        this.refresh(STATE.CORRECT_ANSWER);
    } else {
        this.incorrect += 1;
        this.refresh(STATE.INCORRECT_ANSWER);
    }
};

Game.prototype.refresh = function(state) {
    var currentQuestion = this.questions[this.question];
    if (this.state) document.getElementById(STATE.sections[this.state]).style = "display: none";
    switch (state) {
        case STATE.QUESTION:
            document.getElementById("remaining_time").innerText = "Remaining time: " + SEC_PER_QUESTION;
            document.getElementById("question").innerText = currentQuestion.question;
            for (var i = 0; i < 4; i++) {
                document.getElementById("answer_" + i).innerText = currentQuestion.answers[i];
            }
            this.startTimeout();
            break;
        case STATE.CORRECT_ANSWER:
            this.nextQuestion();
            break;
        case STATE.INCORRECT_ANSWER:
            document.getElementById("correct_answer_incorrect").innerText = "The correct answer is: " + currentQuestion.answers[currentQuestion.correctAnswer];    
            this.nextQuestion();
            break;
        case STATE.TIMEOUT:
            document.getElementById("correct_answer_timeout").innerText = "The correct answer is: " + currentQuestion.answers[currentQuestion.correctAnswer];    
            this.nextQuestion();
            break;
        case STATE.END:
            document.getElementById("result").innerText = "Answers correct: " + this.correct + " incorrect: " + this.incorrect + " unanswered: " + this.timedout;    
    }
    this.state = state;
    document.getElementById(STATE.sections[this.state]).style = "display: block";
};

Game.prototype.nextQuestion = function() {
    setTimeout(function(self) {
        self.question += 1;
        if (self.question == self.questions.length) {
            self.refresh(STATE.END);
        } else {
            self.refresh(STATE.QUESTION);
        }
    }, SEC_AFTER_ANSWER * 1000, this);
};

Game.prototype.startTimeout = function() {
    this.remainingTime = SEC_PER_QUESTION;
    this.interval = setInterval(function(self) {
        self.remainingTime -= 1;
        if (self.remainingTime == 0) {
            clearInterval(self.interval);
            self.refresh(STATE.TIMEOUT);
        } else {
            document.getElementById("remaining_time").innerText = "Remaining time: " + self.remainingTime;
        }    
    }, 1000, this);
};

function startGame () {
    var game = new Game(QUESTIONS);
    game.refresh(STATE.START);
};
