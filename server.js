const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const app = express();
const port = process.env.PORT || 8080;

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.listen(port, function(){
    console.log(`Server running on port: ${port}`);
});

app.get("/highscore.json", function(req,res) {
    res.send(fs.readFileSync("highscore.json"));
});

app.post("/highscore.json", function(req, res){                                                                             
    let highscore = JSON.parse(fs.readFileSync("highscore.json"));
    let username = req.body.username;
    let score = Number(req.body.score);
    let guest = false;
    if(username === "Guest" || username === "null"){
        guest = true;
        let found = false;
        do {
            found = false;
            let rand = Math.floor(Math.random()*1000 + 1);
            if(rand < 100){
                if(rand < 10){
                    rand = "00" + rand;
                } else {
                    rand = "0" + rand;
                }
            }
            username = "Guest" + rand;
            for(let i = 0; i < highscore.length; i++){
                if(username === highscore[i].username){
                    found = true;
                    break;
                }
            }
        } while(found);
    }

    let currentHighscore = false;
    if(!guest){
        for(let i = 0; i < highscore.length; i++){
            if(highscore[i].username === username){
                currentHighscore = true;
                if(highscore[i].score < score){
                    highscore[i].score = score;
                }
                break;
            }
        }
    }   
    let newHighscore = false;
    if(!currentHighscore){
        if(highscore.length < 10){
            newHighscore = true;
        } else if(score > Number(highscore[highscore.length-1].score)){
            highscore.pop();
            newHighscore = true;
        }                                                               
        if(newHighscore){
            highscore.push({
                "username": username,
                "score": score
            });
        }
    }
    if(highscore.length > 1){
        let i = highscore.length-1;
        let temp = highscore[i];
        while(i > 0 && Number(temp.score) > Number(highscore[i-1].score)){
            highscore[i] = highscore[i-1];
            i--;
        }
        highscore[i] = temp;
    }
    console.log(`username: "${username}", score: ${score}, newHighscore: ${newHighscore}`);
    highscore = JSON.stringify(highscore, null, 4);
    fs.writeFileSync("highscore.json", highscore);
    res.send(highscore);
});