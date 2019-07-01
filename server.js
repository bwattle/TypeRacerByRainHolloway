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
    let newHighscore = false;
    if(highscore.length < 10){
        newHighscore = true;
    } else if(Number(req.body.score) > Number(highscore[highscore.length-1].score)){
        highscore.pop();
        newHighscore = true;
    }                                                               
    if(newHighscore){
        highscore.push({
            username: req.body.username,
            score: req.body.score
        });
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
    console.log(`username: "${req.body.username}", score: ${req.body.score}, newHighscore: ${newHighscore}`);
    highscore = JSON.stringify(highscore, null, 4);
    fs.writeFileSync("highscore.json", highscore);
    res.send(highscore);
});