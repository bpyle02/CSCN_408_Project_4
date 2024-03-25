var flashcards = [];
var score = 0;

localStorage.setItem("flashcards", JSON.stringify(flashcards));
localStorage.setItem("score", JSON.stringify(score));

function addCard(term, answer) {
    tempObj = {"term": term, "answer": answer};
    flashcards.push(term, answer);

    console.log(flashcards);
    
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function totalCards() {
    return JSON.parse(localStorage.getItem("flashcards")).length;
}

function increaseScore() {
    newScore = JSON.parse(localStorage.getItem("score"));
    newScore++;
    localStorage.setItem("score", JSON.stringify(newScore));
}

function getScore() {
    return JSON.parse(localStorage.getItem("score"));
}

function resetScore() {
    score = 0;
    localStorage.setItem("score", JSON.stringify(score));
}

function getPercentRight() {
    return totalCards() / getScore();
}

MicroModal.init();