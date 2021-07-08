// Clicking button
var buttonArray = document.querySelectorAll(".drum");

for (var i = 0; i < buttonArray.length; i++) {
    buttonArray[i].addEventListener("click", function() {
        playSound(this.textContent);
        buttonAnimation(this.textContent);
    });
}

// Pressing Key
document.addEventListener("keydown", function(event) {
    playSound(event.key);
    buttonAnimation(event.key);
});

// Mapping a char to a sound
function playSound(key) {
    switch (key) {
        case "w":
            var crash = new Audio('sounds/crash.mp3');
            crash.play();
            break;
        case "a":
            var kick = new Audio('sounds/kick-bass.mp3');
            kick.play();
            break;
        case "s":
            var snare = new Audio('sounds/snare.mp3');
            snare.play();
            break;
        case "d":
            var tom1 = new Audio('sounds/tom-1.mp3');
            tom1.play();
            break;
        case "j":
            var tom2 = new Audio('sounds/tom-2.mp3');
            tom2.play();
            break;
        case "k":
            var tom3 = new Audio('sounds/tom-3.mp3');
            tom3.play();
            break;
        case "l":
            var tom4 = new Audio('sounds/tom-4.mp3');
            tom4.play();
            break;
        default:
            break;
    }
}

//To animate button press
function buttonAnimation(key) {
    var activeButton = document.querySelector(`.${key}`);
    activeButton.classList.add("pressed");
    setTimeout(() => activeButton.classList.remove("pressed"), 100);
}