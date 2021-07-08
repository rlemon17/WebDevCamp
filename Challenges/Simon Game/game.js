var buttonColors = ["red", "blue", "green", "yellow"];
var gamePattern = [];
var level = 0;
var gameStarted = false;
var playerIndex = 0;

//Check for A key, and only if game hasn't started
$("body").on("keypress", (e) => {
    if (e.key === 'a' && gameStarted == false) {
        gameStarted = true;
        gamePattern = [];
        playerIndex = 0;
        level = 0;
        $("h1").text(`Level ${level}`);
        nextSequence();
    }
});

function nextSequence() {

    //Determine new color
    var randomNum = Math.floor(Math.random()*4);
    gamePattern.push(buttonColors[randomNum]);

    level++;
    $("h1").text(`Level ${level}`);

    //Play through current sequence
    for (var i = 0; i < gamePattern.length; i++) {
        var currColor = gamePattern[i];
        cpuPress(currColor, i);
    }

    //Reset player counter and pass to player
    playerIndex = 0;
}

//Needed to modify in order to add delay in between loop iterations
function cpuPress(color, index) {
    setTimeout( () => {
        $(`#${color}`).fadeOut(100).fadeIn(100);
        playSound(color);        
    }, 500*index);
}

function playSound(file) {
    var sound = new Audio(`sounds/${file}.mp3`);
    sound.play();
}


//Check for user keypresses
$(".btn").on("click", function() {

    //Get player's choice data
    var pressedColor = this.id;
    playSound(pressedColor);

    //Animate Press
    $(`.btn#${pressedColor}`).addClass("pressed");
    setTimeout( () => $(`.btn#${pressedColor}`).removeClass("pressed"), 100);

    //Determine if incorrect
    //Allow to press even if game hasn't started
    if (gameStarted) {
        if (pressedColor !== gamePattern[playerIndex]) {
            gameStarted = false;
            playSound("wrong");

            //Red screen effect
            $("body").addClass("game-over");
            setTimeout( () => $("body").removeClass("game-over"), 200);

            $("h1").text("Game Over! (Press A to restart)");
        }
        else {
            playerIndex++;

            //Check if end of current round
            if (playerIndex === gamePattern.length) {
                setTimeout(nextSequence, 1000);
            }
        }        
    }
}); 