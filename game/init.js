import {
    Player
} from "./Models/Player.js";

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
(function () {
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

const $playerStat = document.querySelector("#playerStat");
const $levelPanel = document.querySelector("#levelPanel");
const $healthPanel = document.querySelector("#healthPanel");
const $expPanel = document.querySelector("#expPanel");

const $deathPanel = document.querySelector("#deathPanel");
const $restartButton = document.querySelector("#restartButton");

/**
 * Parallax effect 
 */
(function () {
    document.addEventListener("mousemove", parallax);
    const elems = document.querySelectorAll(".parallax");

    function parallax(e) {
        let _w = window.innerWidth / 2;
        let _h = window.innerHeight / 2;

        let _mouseX = e.clientX;
        let _mouseY = e.clientY;

        let _depth1 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth2 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let _depth3 = `${50 - (_mouseX - _w) * 0.03}% ${50 - (_mouseY - _h) * 0.01}%`;
        let x = `${_depth3}, ${_depth2}, ${_depth1}`;

        for (const el of elems) {
            el.style.backgroundPosition = x;
        }
    }

})();

$startButton.onclick = () => {
    startGame();
    $menuPanel.classList.add("hidden")
    $interface.classList.add("hidden")
};

const startGame = () => {
    enemies = {};
    startAnimation(12);
    player.init();
}

const restartGame = () => {
    player.reset();
    startGame();
};

const updateInterface = () => {
    $playerStat.classList.add("active");

    $healthPanel.innerHTML = "";

    for (let i = 0; i < player.getHPMax(); i++) {
        $healthPanel.insertAdjacentHTML("beforeend", `
            <div class='${player.getHP() > i ? "heart heart_red" : "heart heart_empty"}'></div>
        `);
    }

    $levelPanel.innerHTML = `<span>${player.getLvl()} lvl</span>`;

    const expProcent = (player.getExp() * 100) / player.getExpNeedToLvlUp();
    $expPanel.style.background = `linear-gradient(to right, green ${expProcent}%, transparent ${expProcent}%, transparent ${100 - expProcent}%)`;

    if (!player.getIsAlive()) {
        $deathPanel.classList.add("active");

        $restartButton.onclick = () => {
            window.setTimeout(() => {
                $deathPanel.classList.remove("active");
                restartGame();
            }, 300)
        }
    }
}

const drawEnemies = () => {
    if (!Object.keys(enemies).length) {
        spawnEnemies(5);
    }

    for (const id in enemies) {
        const enemy = enemies[id];

        ctx.fillRect(enemy.posX, enemy.posY, enemy.width, enemy.height);
    }
}

let enemies = {};
let enemiesCount = 0;
let retry = true;

const spawnEnemies = (count) => {
    for(var i = 0; i < count; i++){
        while (retry) {
            const id = Date.now();
    
            enemies[id] = {
                posX: Math.random() * (canvas.width - 200) + 100,
                posY: Math.random() * (canvas.height - 200) + 100,
                width: 60,
                height: 60,
                health: 1,
                getCenter: function() {
                    return {
                        x: this.posX + this.width/2,
                        y: this.posY + this.height/2
                    }
                }
            }

            retry = ctx.getImageData(enemies[id].posX, enemies[id].posY, 1, 1).data[0] !== 0;
            console.log(retry);
    
            if ((enemiesCount + 1) < count) {
                enemiesCount += 1;
            }
            else {
                enemiesCount = 0;
                break;
            }
        }
    }
}

const checkEnemiesCollision = () => {
    for (const id in enemies) {
        const enemy = enemies[id];

        if (
            player.getCenter().x > enemy.posX &&
            player.getCenter().x < enemy.posX + enemy.width &&

            player.getCenter().y > enemy.posY &&
            player.getCenter().y < enemy.posY + enemy.height
        ) {
            if(player.isAttacking()){
                enemy.health -= 1;
            }
            else{
                player.dealDamage();
            }
        }

        if (enemy.health == 0) {
            delete enemies[id];
            player.giveExp();
        }
    }
}

const moveEnemiesToPlayer = () => {
    for (const id in enemies) {
        const enemy = enemies[id];

        if(enemy.getCenter().x != player.getCenter().x) {
            if(enemy.getCenter().x < player.getCenter().x) {
                enemy.posX += 1.5;
            }
            else{
                enemy.posX -= 1.5;
            }
        }

        if(enemy.getCenter().y != player.getCenter().y) {
            if(enemy.getCenter().y < player.getCenter().y) {
                enemy.posY += 1.5;
            }
            else{
                enemy.posY -= 1.5;
            }
        }
    }
}

let FPS, FPSInterval, startTime, now, then, elapsed;

const startAnimation = (FPS) => {
    FPSInterval = 1000 / FPS;
    then = Date.now();
    startTime = then;
    animation();
};

const animation = () => {
    if (!player.getIsAlive()) {
        updateInterface();
        return;
    }

    requestAnimationFrame(animation);
    now = Date.now();
    elapsed = now - then;

    moveEnemiesToPlayer()
    checkEnemiesCollision()

    if (elapsed > FPSInterval) {
        then = now - (elapsed % FPSInterval);

        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
        ctx.drawImage(back, 0, 0, window.innerWidth, window.innerHeight);

        drawEnemies();
        player.update();

        updateInterface();
    }
}