// DOM elements
var userIn;
var wordTable;
var timer_span;
var score_span;
var wordList = [];

// List of words used in the word bank
var words = [
    "time", "person", "year", "thing", "world", "life", "hand",
     "part", "child", "woman", "place", "work", "week", "point",
     "government", "company", "number", "group", "problem", "fact",
     "good", "first", "last", "long", "great", "little", "other",
     "right", "high", "different", "small", "large", "next", "early",
     "young", "important", "public", "private", "same", "able", "abandon",
     "ability", "abortion", "academic", "beginning", "beside", "bible",
     "bomb", "bike", "come", "comedy", "community", "compare", "corn",
     "dead", "rain", "genevieve", "every", "exactly"
];

var nextWord = 0;
var score = 0;
const maxTime = 60;
var time = maxTime;
var timer;

// Runs when the web page is completely loaded
window.onload = function(){
    userIn = document.getElementById("user-in");
    wordTable = document.getElementById("word-bank");
    for(let i = 0; i < 3; i++){
        wordList.push(document.getElementById("word" + (i+1)));
    }
    /* I dont like writing the same line three times:
    wordList[0] = document.getElementById("word1");
    wordList[1] = document.getElementById("word2");
    wordList[2] = document.getElementById("word3");
    */
    timer_span = document.getElementById("timer");
    score_span = document.getElementById("score");

    userIn.addEventListener("keydown", function(event){
        checkString(event);
    });
}

// Runs when the "Start" button is clicked
function startGame(){
    time = maxTime;
    timer_span.innerHTML = time;
    score = 0;
    score_span.innerHTML = score;
    userIn.disabled = false;
    userIn.value = "";
    userIn.focus();
    clearInterval(timer);
    timer = setInterval(timing, 1000);
    setupWordBank();
}

// Function that repeats every second to represent timer
function timing(){
    time--;
    timer_span.innerHTML = time;
    if(time <= 0){
        stopGame();
    }
}

// After the timer equals 0, this function is called
function stopGame(){
    userIn.disabled = true;
    userIn.value = "";
    clearInterval(timer);
    prompt("Enter your username:", "John Doe");
}

// Randomizes the array of words and sets up the word bank
function setupWordBank(){
    words = randomizeArray(words);
    wordList[0].innerHTML = "";
    wordList[1].innerHTML = words[nextWord];
    wordList[2].innerHTML = words[nextWord + 1];
    nextWord = 2;
}

// Personalized random assortment
function randomizeArray(arr){
    nextWord = 0;
    for(let i = 0; i < arr.length; i++){
        let rand = Math.floor(Math.random() * (arr.length - i) + i);
        let temp = arr[i];
        arr[i] = arr[rand];
        arr[rand] = temp;
    }
    return arr;
}

// If the user presses spacebar, this function checks the strings and 
// updates the word list
function checkString(event){
    let key = event.key;
    if(key === " "){
        if(userIn.value.trim() === wordList[1].innerHTML){
            score++;
            score_span.innerHTML = score;
        }
        updateWordList();
        userIn.value = "";
    }
}

function updateWordList(){
    wordList[0].innerHTML = wordList[1].innerHTML;
    wordList[1].innerHTML = wordList[2].innerHTML;
    wordList[2].innerHTML = words[nextWord];
    if(nextWord === words.length-1){
        words = randomizeArray(words);
    } else {
        nextWord++;
    }
}