MicroModal.init();

const front_textarea = document.getElementById("front");
const back_textarea = document.getElementById("back");

function submitCard() {
    front_textarea.value = "";
    back_textarea.value = "";
}

var flashcards = [];
var score = 0;

const cardWrapper = document.getElementById("cards-root");

function updateCardList() {
    cardWrapper.children = flashcards.map(fc => {
        const flashcard_div = new HTMLDivElement();
        flashcard_div.textContent = fc.term + " " + fc.answer;
        return flashcard_div;
    });
}

flashcards = localStorage.getItem("flashcards") | [];

function addCard(term, answer) {
    tempObj = {"term": term, "answer": answer};
    flashcards.push(term, answer);

    console.log(flashcards);
    
    localStorage.setItem("flashcards", JSON.stringify(flashcards));
}

function increaseScore() {
    score++;
}

function resetScore() {
    score = 0;
}
