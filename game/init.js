import { Player } from "./Models/Player.js";

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

const back = new Image();
back.src = "../img/Background/background.png";

const player = new Player(ctx);
window.player = player; /* FOR DEBUG */

canvas.width = innerWidth;
canvas.height = innerHeight - 5;


(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        window.mousePosX = event.clientX;
        window.mousePosY = event.clientY;
    }
})();

const $healthPanel = document.querySelector("#healthPanel");
const $deathPanel = document.querySelector("#deathPanel");
const $restartButton = document.querySelector("#restartButton");

const updateInterface = () => {
    $healthPanel.innerHTML = "";

    for (let i = 0; i < player.getHPMax(); i++) {
        $healthPanel.insertAdjacentHTML("beforeend", `
            <div class='${player.getHP() > i ? "heart heart_red" : "heart heart_empty"}'></div>
        `);
    }

    if(!player.getIsAlive()){
        $deathPanel.classList.add("active");

        $restartButton.onclick = () => {
            window.setTimeout(() => {
                $deathPanel.classList.remove("active");
                restartGame();
            }, 300)
        }
    }
}

back.onload = () => startGame();

const startGame = () => {
    startAnimation(12);
    player.init();
}

const restartGame = () => {
    player.reset();
    startGame();
};

let enemies = [
    {
        posX: 500,
        posY: 500,
        width: 60,
        height: 60,
        health: 2
    },
    {
        posX: 800,
        posY: 300,
        width: 60,
        height: 60,
        health: 2
    }
];

let FPS, FPSInterval, startTime, now, then, elapsed;

const startAnimation = (FPS) => {
    FPSInterval = 1000/FPS;
    then = Date.now();
    startTime = then;
    animation();
};

const animation = () => {
    if(!player.getIsAlive()){
        updateInterface();
        return;
    }

    requestAnimationFrame(animation);
    now = Date.now();
    elapsed = now - then;

    if(elapsed > FPSInterval){
        then = now - (elapsed % FPSInterval);

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(back, 0, 0, window.innerWidth, window.innerHeight);

        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];

            ctx.fillRect(enemy.posX, enemy.posY, enemy.width, enemy.height);

            console.log(player.xPos, enemy.posX);
            if( player.xPos + player.frameWidth/2 > enemy.posX &&
                player.xPos + player.frameWidth/2 < enemy.posX + enemy.width / 2 &&

                player.yPos + player.frameHeight/2 > enemy.posY &&
                player.yPos + player.frameHeight/2 < enemy.posY + enemy.height / 2
            ){
                enemy.health -= 1;
            }

            if(enemy.health == 0){
                enemies.splice(i, 1);
            }
        }
    
        player.update();

        updateInterface();
    }
}