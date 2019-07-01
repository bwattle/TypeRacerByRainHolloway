'use strict';

// DOM elements
var userIn;
var wordTable;
var timer_span;
var timer_text;
var score_span;
var highscoreTable;
var startButton;

// Global variables
var wordList = [];

// List of words used in the word bank
var words = [
    "time", "person", "year", "thing", "world", "life", "hand",
    "part", "child", "woman", "place", "work", "week", "point",
    "government", "company", "number", "group", "problem", "fact",
    "good", "first", "last", "long", "great", "little", "other",
    "right", "high", "different", "small", "large", "next", "early",
    "young", "important", "public", "private", "same", "able",
    "ability", "academic", "beginning", "beside",
    "bomb", "bike", "come", "comedy", "community", "compare", "corn",
    "rain", "genevieve", "every", "exactly"
];
var nextWord = 0;
var score = 0;
var maxTime = 60;
var time = maxTime;
var timer;

// Class to hold the data of each word: elem (td element), string(the word), stringArr(array of characters), span[](array of span elements)
class Word {
    constructor(element, string){
        this.elem = element;
        this.string = string;
        this.stringArr = string.split("");
        this.span = [];

        for(let i = 0; i < this.stringArr.length; i++){
            let newSpan = document.createElement("span");
            newSpan.innerHTML = this.stringArr[i];
            this.span.push(newSpan);
            this.elem.appendChild(this.span[i]);
        }
    }
}

// Function triggered when window finishes loading -----------------------------
// Caches the elements in the DOM into variables
window.onload = function(){
    userIn = document.getElementById("user-in");
    wordTable = document.getElementById("word-bank");
    timer_span = document.getElementById("timer");
    timer_text = document.getElementById("timer-text");
    score_span = document.getElementById("score");
    startButton = document.getElementById("start-button");
    highscoreTable = document.getElementById("highscore-table")

    // Create event listeners
    startButton.addEventListener('click', startGame);

    // Had to change the timing of this function to 1ms to cater for firefox speed
    userIn.addEventListener('keydown', (e) => {
        setTimeout(() => {
            updateText(e);
        }, 1); // 0ms only works on
    });

    document.addEventListener("click", function(event){
        if(!(event.target === document.querySelector(".info") || event.path.includes(document.querySelector(".modal-content")))){
            if(document.querySelector(".modal").style.display === "block"){
                $(".modal").fadeOut(); // jQuery
            }
        }
    });

    document.querySelector(".info").onclick = function(){
        // document.querySelector(".modal").style.display = "block"; // JavaScript
        $(".modal").fadeIn(); // jQuery
    }
    document.querySelector("#close-icon").onclick = function(){
        // document.querySelector(".modal").style.display = "none"; // JavaScript
        $(".modal").fadeOut(); // jQuery
    }
    document.querySelector("#close-button").onclick = function(){
        // document.querySelector(".modal").style.display = "none"; // JavaScript
        $(".modal").fadeOut(); // jQuery
    }

    getHighscoreTable();
}

// Functions triggered by onclick event ----------------------------------------
function startGame(){
    score = 0;
    score_span.textContent = score;
    userIn.value = "";
    userIn.disabled = false;
    userIn.focus();
    resetTimer();
    removeChildren(wordTable);
    setupWordBank();
}

// Resets the timer
function resetTimer(){
    clearInterval(timer);
    timer_span.classList.remove("red-text");
    time = maxTime;
    timer_text.textContent = "Time: ";
    timer_span.textContent = time;
    timer = setInterval(timing, 1000);
}

// Removes all the child elements within a parent element
function removeChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

// Configures the word bank
function setupWordBank(){

     randomizeWords();

     wordList = [];

     let tableRow = document.createElement("tr");
     for(let i = 0; i < 3; i++){
         if(i === 0){
             wordList.push(new Word(document.createElement("td"), ""));
         }else{
             wordList.push(new Word(document.createElement("td"), words[i]));
         }
         tableRow.appendChild(wordList[i].elem);
     }
     wordTable.appendChild(tableRow);
     nextWord = 2;
}

// Randomizes the list of words by using an altered selection sort
function randomizeWords(){
    nextWord = 0;
    for(let i = 0; i < words.length-1; i++){
        let rand = Math.floor(Math.random() * (words.length - i) + i);
        let temp = words[i];
        words[i] = words[rand];
        words[rand] = temp;
    }
}

// The function that is executed every second while the timer function is active
function timing(){
    time--;
    timer_span.textContent = time;
    if(time <= 10){
        timer_span.classList.add("red-text");
    }
    if(time === 0){
        clearInterval(timer);
        timer_span.classList.remove("red-text");
        timer_text.textContent = "Time's up!";
        timer_span.textContent = "";
        userIn.disabled = true;
        userIn.value = "";
        removeChildren(wordTable);
        setTimeout(function(){
            handleEndGame();
        }, 0);
    }

}

// Functions triggered by onkeypress event ---------------------------------------
// Finds the current key being pressed and updates the word highlighting and
// appends a new word to the word list
function updateText(e){
    let input = userIn.value.trim().toLowerCase().split("");
    // Microsoft edge, firefoz, and opera use keyCode method for keyboard events: returns a number
    // Google Chrome uses 'code' and 'keyCode' method for keyboard events: returns a string
    let key = e.keyCode;
    if(key === 32){
        userIn.value = "";
        let correct = updateScore(input.join(""));
        updateWordList(correct);
    }else{
        updateHighlight(input);
    }
}

// Updates the highlighted letters of the current word
function updateHighlight(input){
    let word = wordList[1].string.split("");
    if(input.length <= wordList[1].string.length){
        for(let i = input.length; i < word.length; i++){
            wordList[1].span[i].classList.remove("red");
            wordList[1].span[i].classList.remove("green");
        }

        let correct = true;
        for(let i = 0; i < input.length; i++){
            if(input[i] === word[i] && correct){
                wordList[1].span[i].classList.remove("red");
                wordList[1].span[i].classList.add("green");
            }else{
                wordList[1].span[i].classList.remove("green");
                wordList[1].span[i].classList.add("red");
                correct = false;
            }
        }
    } else {
        for(let i = 0; i < word.length; i++){
            wordList[1].span[i].classList.remove("green");
            wordList[1].span[i].classList.add("red");
        }
    }
}

// Updates the internal score variable and the visible DOM score value
function updateScore(input){
    if(input === wordList[1].string){
        score++;
        score_span.textContent = score;
        return true;
    }else{
        return false;
    }
}

// Moves each element one position to the left and highlights the word either
// green or red depending if the user got it correct
// Appends a new word to the end of the word bank
function updateWordList(correct){
    for(let i = 0; i < wordList.length-1; i++){
        removeChildren(wordList[i].elem);
        wordList[i] = new Word(wordList[i].elem, wordList[i+1].string);
    }

    if(correct){
        wordList[0].span.forEach(x => x.classList.add("green"));
    }else{
        wordList[0].span.forEach(x => x.classList.add("red"));
    }

    if(nextWord < words.length-1){
        nextWord++;
    }else{
        randomizeWords();
    }

    removeChildren(wordList[2].elem);
    wordList[2] = new Word(wordList[2].elem, words[nextWord]);
}

// After game is complete ------------------------------------------------------
async function handleEndGame(){
    let username = prompt("Enter your name:", "Guest") || "Guest";
    postHighscore(username, score);
}

function postHighscore(username, user_score){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            updateTable(JSON.parse(this.responseText));
        }
    }
    xhttp.open("POST", "highscore.json", true);
    xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
    xhttp.send(`username=${username}&score=${user_score}`);
}

function getHighscoreTable(){
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function(){
        if(this.readyState === 4 && this.status === 200){
            updateTable(JSON.parse(this.responseText));
        }
    }
    xhttp.open("GET", "highscore.json", true);
    xhttp.send();
}

// Update the highscore table in the DOM so the user can see the highscore changes
function updateTable(highscore){
    removeChildren(highscoreTable);
    highscoreTable.innerHTML += "<th>Username</th><th>Score</th>";
    highscore.forEach(highscore => {
        let row = document.createElement("tr");
        let td1 = document.createElement("td");
        td1.textContent = highscore.username;
        let td2 = document.createElement("td");
        td2.textContent = highscore.score;
        row.appendChild(td1);
        row.appendChild(td2);
        highscoreTable.appendChild(row);
    });
}
//------------------------------------------------------------------------------
