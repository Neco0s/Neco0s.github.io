//INITMODEL
var fps = 60;
const w = innerWidth;
const h = innerHeight;

var player = {
    x : innerWidth / 2,
    y : innerHeight / 2,
    size : 84,
    orientation : 0,
    interact: {
        able: false,
        range: 100,
        using: false
    },
    speed : {
        x : 0,
        y : 0,
        max : 8,
        accel : 0.1,
    },
    scan : {
        active : false,
        length : 400,
        angle : Math.PI*4/7
    },
    move : {
        up : false,
        left : false,
        down : false,
        right : false
    }
};

document.addEventListener("keydown", keydownHandler);
document.addEventListener("keyup", keyupHandler);
document.addEventListener("mousemove", mousemoveHandler);
document.addEventListener("click", clickHandler);
var projets = document.getElementsByClassName("projet");

//INITVIEW
var view = document.getElementById("PlayerCanvas");
var PlayerImage = document.getElementById("PlayerImage")
var ctxView = view.getContext("2d");

game = setInterval(update, 1000/fps);
function update() {
    if (!player.interact.using) {
        updateModel();
        updateView();
    }
}

//INPUTS
function keydownHandler(e) {
    switch (e.code) {
        case "KeyW": case "ArrowUp": player.move.up = true; break;
        case "KeyA": case "ArrowLeft": player.move.left = true; break;
        case "KeyS": case "ArrowDown": player.move.down = true; break;
        case "KeyD": case "ArrowRight": player.move.right = true; break;
        case "Space": player.scan.active = true; break;
        default: break;
    }
}

function keyupHandler(e) {
    switch (e.code) {
        case "KeyW": case "ArrowUp": player.move.up = false; break;
        case "KeyA": case "ArrowLeft": player.move.left = false; break;
        case "KeyS": case "ArrowDown": player.move.down = false; break;
        case "KeyD": case "ArrowRight": player.move.right = false; break;
        case "Space": player.scan.active = false; break;
        case "KeyE":
            if (player.interact.able) {
                player.interact.using = true;
                for (let i = 0; i < projets.length; i++) {
                    projet = projets[i];
                    let projet_x = parseInt(projet.style.right) + 100;
                    let projet_y = parseInt(projet.style.bottom) + 100;
                    distG = Math.sqrt(Math.pow(projet_x - player.x, 2) + Math.pow(projet_y - player.y, 2));
                    if (distG <= player.interact.range) {
                        setChildHidden(document.body, false, projet.id);
                        setChildHidden(projet, true, 'proj_desc');
                    }
                }
            }
            break;
        case "Escape":
            var pages = document.getElementsByClassName('proj_page');
            for (let i = 0; i < pages.length; i++) {
                if (!pages[i].classList.contains('hidden')) {
                    pages[i].classList.add('hidden');
                }
                player.interact.using = false;
            }
        default: break;
    }
}

function mousemoveHandler(e) {
    let distX = player.x - e.pageX;
    let distY = player.y - e.pageY;
    if (distX != 0) {
        player.orientation = (distX < 0) ? Math.atan(distY/distX) + Math.PI * 1 / 2 : Math.atan(distY/distX) + Math.PI * 3 / 2;
    } else {
        if (distY != 0) {
            player.orientation = Math.acos(Math.sign(distY))
        } else {
            player.orientation = 0;
        }
    }
}

function clickHandler(e) {
    if (e.target.classList.contains('cross')) {
        player.interact.using = false;
        e.target.parentElement.classList.add('hidden');
    }
}

//GAMEMODEL
function updateModel() {
    player.x = innerWidth/2;
    player.y = innerHeight/2;
    setPlayerSpeed();
    placeProjects();
}

function setPlayerSpeed() {
    if (player.move.up) {
        player.speed.y -= (player.speed.max + player.speed.y) * player.speed.accel;
    }
    if (player.move.down) {
        player.speed.y += (player.speed.max - player.speed.y) * player.speed.accel;
    }
    if (player.move.right) {
        player.speed.x += (player.speed.max - player.speed.x) * player.speed.accel;
    }
    if (player.move.left) {
        player.speed.x -= (player.speed.max + player.speed.x) * player.speed.accel;
    }
    if (!player.move.down && !player.move.up) {
        player.speed.y -= player.speed.y * player.speed.accel;
    }
    if (!player.move.left && !player.move.right) {
        player.speed.x -= player.speed.x * player.speed.accel;
    }

    player_speed = Math.sqrt(Math.pow(player.speed.x, 2) + Math.pow(player.speed.y, 2));
    if (player_speed >= player.speed.max) {
        player.speed.x *= player.speed.max / player_speed;
        player.speed.y *= player.speed.max / player_speed;
    }
    roundSpeed();
}

function roundSpeed() {
    if (player.speed.y > -player.speed.max * 3 / 40 && player.speed.y < player.speed.max * 3 / 40) {
        player.speed.y = 0;
    } else if (player.speed.y > player.speed.max * 37 / 40) {
        player.speed.y = player.speed.max;
    } else if (player.speed.y < -player.speed.max * 37 / 40) {
        player.speed.y = -player.speed.max;
    }
    if (player.speed.x > -player.speed.max * 3 / 40 && player.speed.x < player.speed.max * 3 / 40) {
        player.speed.x = 0;
    } else if (player.speed.x > player.speed.max * 37 / 40) {
        player.speed.x = player.speed.max;
    } else if (player.speed.x < -player.speed.max * 37 / 40) {
        player.speed.x = -player.speed.max;
    }
}

function placeProjects() {
    for (let i = 0; i < projets.length; i++) {
        let projet = projets[i];
        projet.style.bottom = (parseFloat(projet.style.bottom) + player.speed.y) + "px";
        projet.style.right = (parseFloat(projet.style.right) + player.speed.x) + "px";
    }
}

//GAMEVIEW
function updateView() {
    drawPlayer();
    document.body.style.backgroundPositionX = (parseInt(document.body.style.backgroundPositionX) - player.speed.x * 4 / player.speed.max) + "px";
    document.body.style.backgroundPositionY = (parseInt(document.body.style.backgroundPositionY) - player.speed.y * 4 / player.speed.max) + "px";
    placeProjects();
    for (let i = 0; i < projets.length; i++) {
        let projet = projets[i];
        showFeatures(projet);
    }
}

function drawPlayer() {
    view.width = w;
    view.height = h;
    ctxView.clearRect(0, 0, w, h);
    ctxView.save();
    ctxView.translate(player.x, player.y);
    ctxView.rotate(player.orientation);

    if (player.scan.active) {
        ctxView.beginPath();
        ctxView.moveTo(0, 0);
        ctxView.arc(0, 0, player.scan.length, Math.PI * 3 / 2 - player.scan.angle / 2, Math.PI * 3 / 2 + player.scan.angle / 2);
        ctxView.fillStyle = "rgba(0, 127, 0, 0.2)";
        ctxView.fill();
        ctxView.closePath();
    }

    ctxView.drawImage(PlayerImage, - player.size / 2, - player.size / 2, player.size, player.size);
    ctxView.restore();
}

function showFeatures(projet) {
    let hide = true;
    let projet_x = parseInt(projet.style.right) + 100;
    let projet_y = parseInt(projet.style.bottom) + 100;
    distG = Math.sqrt(Math.pow(projet_x - player.x, 2) + Math.pow(projet_y - player.y, 2));
    if (distG <= player.scan.length) {
        if (distG <= player.interact.range) {
            player.interact.able = true;
        } else {
            player.interact.able = false;
        }
        if (player.scan.active) {
            let DistAngle = null;
            let distX = projet_x - player.x;
            let distY = projet_y - player.y;
            let scanBegin = player.orientation - player.scan.angle / 2;
            let scanEnd = player.orientation + player.scan.angle / 2;
            if (distX == 0) {
                if (distY != 0) {
                    DistAngle = Math.acos(Math.sign(distY));
                } else {
                    hide = false;
                }
            }
            else {
                DistAngle = (distX < 0) ? Math.atan(distY/distX) + Math.PI / 2 : Math.atan(distY/distX) + Math.PI * 3 / 2;
            }
            if (DistAngle < scanEnd && DistAngle > scanBegin
                || DistAngle - 2 * Math.PI < scanEnd && DistAngle - 2 * Math.PI > scanBegin
                || DistAngle + 2 * Math.PI < scanEnd && DistAngle + 2 * Math.PI > scanBegin) {
                hide = false;
            }
        }
    }
    setChildHidden(projet, hide, 'proj_desc');
}

function setChildHidden(projet, hide, childDistinctClass) {
    for (let i = 0; i < projet.children.length; i++) {
        child = projet.children[i];
        if (child.classList.contains(childDistinctClass)) {
            if (hide) {
                if (!child.classList.contains('hidden')) {
                    child.classList.add('hidden');
                }
            } else if (child.classList.contains('hidden')) {
                child.classList.remove('hidden');
            }
        }
    }
}