import { Player } from "./Models/Player.js";

const canvas = document.querySelector("#scene");
const ctx = canvas.getContext("2d");

const back = new Image();
back.src = "../img/Background/background.png";

const player = new Player(ctx);
window.player = player; /* FOR DEBUG */

canvas.width = document.body.clientWidth;
canvas.height = document.body.clientHeight;

/**
 * Mouse position
 */
(function() {
    document.onmousemove = handleMouseMove;
    function handleMouseMove(event) {
        var eventDoc, doc, body;

        event = event || window.event; // IE-ism

        window.mousePosX = event.clientX;
        window.mousePosY = event.clientY;
    }
})();

const $interface = document.querySelector("#interface");

const $menuPanel = document.querySelector("#menuPanel");
const $startButton = document.querySelector("#startButton");

const $healthPanel = document.querySelector("#healthPanel");
const $deathPanel = document.querySelector("#deathPanel");
const $restartButton = document.querySelector("#restartButton");

/**
 * Parallax menu effect 
 */
(function() {
    document.addEventListener("mousemove", parallax);
    const elem = document.querySelector(".parallax");

    function parallax(e) {
        let _w = window.innerWidth/2;
        let _h = window.innerHeight/2;

        let _mouseX = e.clientX;
        let _mouseY = e.clientY;
        
        let _depth1 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth2 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth3 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let x = `${_depth3}, ${_depth2}, ${_depth1}`;

        elem.style.backgroundPosition = x;
    }

})();

$startButton.onclick = () => {
    startGame();
    $menuPanel.classList.add("hidden")
    $interface.classList.add("hidden")
};

const startGame = () => {
    startAnimation(12);
    player.init();
}

const restartGame = () => {
    player.reset();
    startGame();
};

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