MicroModal.init();

const FLASHCARD_KEY = "FLASHCARDS";

const front_textarea = document.getElementById("front");
const back_textarea = document.getElementById("back");
const cardWrapper = document.getElementById("cards-root");

var flashcards = JSON.parse(localStorage.getItem(FLASHCARD_KEY) ?? "[]");
var score = 0;

var testing = false;
var testArray = [];
var currentlyReviewing = null;
var keepReviewingArray = [];

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

function totalCards() {
    return JSON.parse(localStorage.getItem("flashcards")).length;
}

function increaseScore() {
    score++;
}

function resetScore() {
    score = 0;
    localStorage.setItem("score", JSON.stringify(score));
}

function shuffleCards() {
    flashcards = shuffleArray(flashcards);
    saveCards();
    updateCardList();
}

function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;
      
    // While there remain elements to shuffle.
    while (currentIndex > 0) {
      
        // Pick a remaining element.
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
      
        // And swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }

    return array;
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
        deleteButton.className = "right-button";

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

function getReviewFlashcardElement(fc) {
    var front;
    {
        const innerDiv = document.createElement("div");
        innerDiv.textContent = fc.term;

        front = document.createElement("div");
        front.className = "front";
        front.replaceChildren(innerDiv);
    }

    var back;
    {
        const innerDiv = document.createElement("div");
        innerDiv.textContent = fc.answer;

        const learnedButton = document.createElement("button");
        learnedButton.textContent = "Learned";
        learnedButton.addEventListener("click", e => {
            endCard(true);
            e.stopPropagation();
        });
        learnedButton.className = "left-button";

        const reviewButton = document.createElement("button");
        reviewButton.textContent = "Keep Reviewing";
        reviewButton.addEventListener("click", e => {
            endCard(false);
            e.stopPropagation();
        });
        reviewButton.className = "right-button";

        back = document.createElement("div");
        back.className = "back";
        back.replaceChildren(innerDiv, learnedButton, reviewButton);
    }

    const flashcard_div = document.createElement("div");
    flashcard_div.className = "flashcard";
    flashcard_div.replaceChildren(front, back);

    flashcard_div.addEventListener("click", () => {
        flashcard_div.classList.toggle("flipped");
    });

    return flashcard_div;
}

function startTest() {
    testArray = shuffleArray([...flashcards]);
    testing = true;
    document.getElementById("main-button-box").classList.add("hidden");
    document.getElementById("test-button-box").classList.remove("hidden");

    loadNextReviewCard();
}

function loadNextReviewCard() {
    if (testArray.length == 0) {
        if (keepReviewingArray.length > 0) {
            testArray.splice(0, keepReviewingArray.length, ...shuffleArray(keepReviewingArray));
            keepReviewingArray = [];
        }
        else {
            quitTest();
            return;
        }
    }

    currentlyReviewing = testArray.pop();

    cardWrapper.replaceChildren(getReviewFlashcardElement(currentlyReviewing));

    console.log(testArray, keepReviewingArray, currentlyReviewing)
}

function endCard(learned) {
    if (!learned) {
        keepReviewingArray.push(currentlyReviewing);
    }

    loadNextReviewCard();
}

function quitTest() {
    testing = false;
    document.getElementById("main-button-box").classList.remove("hidden");
    document.getElementById("test-button-box").classList.add("hidden");
    updateCardList();
}

updateCardList();

function getPercentRight() {
    return totalCards() / getScore();
}

MicroModal.init();