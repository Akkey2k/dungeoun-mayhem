import { Player } from "./Models/Player.js";

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

const back = new Image();
back.src = "../img/Background/background.png";

const player = new Player(ctx);

canvas.width = innerWidth;
canvas.height = innerHeight - 5;


const $healthPanel = document.querySelector("#healthPanel");

const updateInterface = () => {
    $healthPanel.innerHTML = "";

    for (let i = 0; i < player.getHPMax(); i++) {
        $healthPanel.insertAdjacentHTML("beforeend", `
            <div class='${player.getHP() > i ? "heart heart_red" : "heart heart_empty"}'></div>
        `);
    }
}

back.onload = () => {
    startAnimation(10);
    player.init();
    player.initMoveHandler();
};

let FPS, FPSInterval, startTime, now, then, elapsed;

const startAnimation = (FPS) => {
    FPSInterval = 1000/FPS;
    then = Date.now();
    startTime = then;
    animation();
};

const animation = () => {
    requestAnimationFrame(animation);
    now = Date.now();
    elapsed = now - then;

    if(elapsed > FPSInterval){
        then = now - (elapsed % FPSInterval);

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(back, 0, 0, window.innerWidth, window.innerHeight);
    
        player.update();

        updateInterface()
    }
}