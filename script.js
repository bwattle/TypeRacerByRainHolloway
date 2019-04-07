// DOM elements
var userIn;
var wordTable;
var timer_span;
var score_span;
var highscoreTable;

// Global variables
var wordList = [];
var highscores = [];
words = [
    "time", "person", "year", "thing", "world", "life", "hand",
     "part", "child", "woman", "place", "work", "week", "point",
     "government", "company", "number", "group", "problem", "fact",
     "good", "first", "last", "long", "great", "little", "other",
     "right", "high", "different", "small", "large", "next", "early",
     "young", "important", "public", "private", "same", "able"
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

class Highscore {
    constructor(username, userScore){
        this.user = username;
        this.score = userScore;
        this.elem = document.createElement("tr");
        this.data = [];
        for(let i = 0; i < 2; i++){
            this.data.push(document.createElement("td"));
            this.data[i].innerHTML = i === 0 ? this.user : this.score;
            this.elem.appendChild(this.data[i]);
        }
        highscoreTable.appendChild(this.elem);
    }
}

// Function triggered when window finishes loading -----------------------------
window.onload = function(){
    userIn = document.getElementById("user-in");
    wordTable = document.getElementById("word-bank");
    timer_span = document.getElementById("timer");
    score_span = document.getElementById("score");
    startButton = document.getElementById("start-button");
    highscoreTable = document.getElementById("highscore")

    startButton.addEventListener('click', startGame);

    userIn.addEventListener('keyup', updateText);
}

// Functions triggered by onclick event ----------------------------------------
function startGame(){
    score = 0;
    score_span.innerHTML = score;
    userIn.value = "";
    userIn.disabled = false;
    userIn.focus();
    resetTimer();
    removeChildren(wordTable);
    setupWordBank();
}

function resetTimer(){
    clearInterval(timer);
    time = maxTime;
    timer_span.innerHTML = time;
    timer = setInterval(timing, 1000);
}

function removeChildren(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

function setupWordBank(){

     randomizeWords();

     wordList = [];

     let tableRow = document.createElement("tr");
     for(let i = 0; i < 3; i++){
         wordList.push(new Word(document.createElement("td"), words[i]));
         tableRow.appendChild(wordList[i].elem);
     }
     wordTable.appendChild(tableRow);
     nextWord = 3;
}

function randomizeWords(){
    nextWord = 0;
    for(let i = 0; i < words.length-1; i++){
        let rand = Math.floor(Math.random() * (words.length - i) + i);
        let temp = words[i];
        words[i] = words[rand];
        words[rand] = temp;
    }
}

function timing(){
    time--;
    timer_span.innerHTML = time;
    if(time === 0){
        timer_span.innerHTML = "Time's up!";
        userIn.disabled = true;
        userIn.value = "";
        clearInterval(timer);
        updateHighscore();
    }
}

// Functions triggered by onkeypup event ---------------------------------------
function updateText(){
    let input = userIn.value.trim().toLowerCase().split("");
    let key = window.event.keyCode;
    if(!(key === 32 || key === 13)){
        updateHighlight(input);
    }else{
        userIn.value = "";
        let correct = updateScore(input.join(""));
        updateWordList(correct);
    }
}

function updateHighlight(input){
    if(input.length <= wordList[1].string.length){
        let word = wordList[1].string.split("");

        for(let i = input.length; i < word.length; i++){
            wordList[1].span[i].classList.remove("red");
            wordList[1].span[i].classList.remove("green");
        }

        for(let i = 0; i < input.length; i++){
            if(input[i] === word[i]){
                wordList[1].span[i].classList.add("green");
            }else{
                wordList[1].span[i].classList.add("red");
            }
        }
    }
}

function updateScore(input){
    if(input === wordList[1].string){
        score++;
        score_span.innerHTML = score;
        return true;
    }else{
        return false;
    }
}

function updateWordList(correct){
    for(let i = 0; i < wordList.length-1; i++){
        removeChildren(wordList[i].elem);
        wordList[i] = new Word(wordList[i].elem, wordList[i+1].string);
    }

    if(correct){
        wordList[0].span.forEach(x => x.classList.add("green"));
        wordList[0].elem.classList.remove("red");
        wordList[0].elem.classList.add("green");
    }else{
        wordList[0].span.forEach(x => x.classList.add("red"));
        wordList[0].elem.classList.remove("green");
        wordList[0].elem.classList.add("red");
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
function updateHighscore(){
    let username = getUsername();
    let newHighscore = false;
    if(highscores.length < 10){
        highscores.push(new Highscore(username, score));
        newHighscore = true;
    }else{
        if(score > highscores[highscores.length-1].score){
            highscores.pop();
            console.log("testing");
            highscores.push(new Highscore(username, score));
            newHighscore = true;
        }
    }
    if(newHighscore && highscores.length > 1){
        sortScores();
        updateTable();
    }
}

function getUsername(){
    return prompt("Enter your name:", "Guest");
}

function sortScores(){
    let j = highscores.length-1;
    let temp = highscores[j];
    while(j > 0 && temp.score > highscores[j-1].score){
        highscores[j] = highscores[j-1];
        j--;
    }
    highscores[j] = temp;
}

function updateTable(){
    removeChildren(highscoreTable);
    let tableRow = document.createElement("tr");
    let th = [];
    for(let j = 0; j < 2; j++){
        th.push(document.createElement("th"));
        th[j].innerHTML = j === 0 ? "Player" : "Score";
        tableRow.appendChild(th[j]);
    }
    highscoreTable.appendChild(tableRow);
    for(let i = 0; i < highscores.length; i++){
        highscores[i].data[0].innerHTML = highscores[i].user;
        highscores[i].data[1].innerHTML = highscores[i].score;
        highscoreTable.appendChild(highscores[i].elem);

    }
}
//------------------------------------------------------------------------------
