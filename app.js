MicroModal.init();

const FLASHCARD_KEY = "FLASHCARDS";

const front_textarea = document.getElementById("front");
const back_textarea = document.getElementById("back");
const cardWrapper = document.getElementById("cards-root");

var flashcards = JSON.parse(localStorage.getItem(FLASHCARD_KEY) ?? "[]");
var score = 0;

function saveCards() {
    localStorage.setItem(FLASHCARD_KEY, JSON.stringify(flashcards));
}

function submitCard() {
    addCard(front_textarea.value, back_textarea.value);
    front_textarea.value = "";
    back_textarea.value = "";
}

function addCard(term, answer) {
    flashcards.push({term: term, answer: answer});
    saveCards();
    updateCardList();
}

function removeCard(fc) {
    flashcards = flashcards.filter(f => f !== fc);
    saveCards();
    updateCardList();
}

function updateCardList() {
    cardWrapper.replaceChildren(...flashcards.map(getFlashcardElement));
}

function increaseScore() {
    score++;
}

function resetScore() {
    score = 0;
}

function shuffleCards() {
    let currentIndex = flashcards.length,  randomIndex;
      
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
      
        // And swap it with the current element.
        [flashcards[currentIndex], flashcards[randomIndex]] = [flashcards[randomIndex], flashcards[currentIndex]];
    }

    saveCards();
    updateCardList();
}

function getFlashcardElement(fc) {
    function createFace(className, content) {
        const innerDiv = document.createElement("div");
        innerDiv.textContent = content

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "delete";
        deleteButton.addEventListener("click", e => {
            removeCard(fc);
            e.stopPropagation();
        });
        deleteButton.className = "delete-button";

        const div = document.createElement("div");
        div.className = className;
        div.replaceChildren(innerDiv, deleteButton);

        return div;
    }

    const back_div = createFace("back", fc.answer);
    const front_div = createFace("front", fc.term);

    const flashcard_div = document.createElement("div");
    flashcard_div.className = "flashcard";
    flashcard_div.replaceChildren(front_div, back_div);

    flashcard_div.addEventListener("click", () => {
        flashcard_div.classList.toggle("flipped");
    });

    return flashcard_div;
}

updateCardList();