const song = require('./song.js').song;

const width = 400;
const height = 600;
const barWidth = 30;
const barColor = "black";
const scoreColor = "blue";
const scoreSize = "50px";
const scorePos = { x:width *1/2, y:height *1/10}
const bgColor = "white";
const lookAhead = 10;
const hSep = "lightgrey"; //horizontal separator
const hSepHeight = 8;
const loop=4; //loop every 20 ticks, 0 to disable
const buttons = [ "red", "blue", "green", "orange"];
//let track = [[true, false, false ,true], [1, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true], [true, false, false ,true]]; //array containing arrays of bool (track[x][y] = press y.th button at x.th tick?
let track = song;
//TODO:
// parser for files that looks like this : (x : do nothing, o = press)
// xxox
// xoox
// oxxo
let bpm = 120; //bpm
let takt = 60000 / bpm;
let currTick = 0; //current tik
let score = 0; //print score *100 to make it look cooler
let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");


const start = () => {
    canvas.width = width;
    canvas.height = height;
    canvas.addEventListener('click', clickListener);
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    setInterval(update, takt);
}

const getValueAtTick = (i,j,t) => {
    if (loop > 0) {
        return track[mod(lookAhead - 1 + t - j, loop)][i];
    } else {
        return track[lookAhead - 1 + t - j][i];
    }
}
const getValueAt = (i,j) => getValueAtTick(i,j,currTick);
const clickListener = (event) => {
    let t = currTick;
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    y = canvas.width - y;

    if (y < height / lookAhead) {
        if (x < width / 4) {
            if (getValueAt(0, lookAhead) > 0) {
                score++;
            } else {
                score--;
            }
        } else if (x < 2*width / 4) {
            if (getValueAt(1, lookAhead) > 0) {
                score++;
            } else {
                score--;
            }
        } else if (x < 3*width / 4) {
            if (getValueAt(2, lookAhead) > 0) {
                score++;
            } else {
                score--;
            }
        } else {
            if (getValueAt(3, lookAhead) > 0) {
                score++;
            } else {
                score--;
            }
        }
    }
}
const clear = () => {
    context.fillStyle = bgColor;
    context.fillRect(0, 0, width, height);
}
const mod = (a,b) => {
    while(a > b) {
        a-=b;
    }
    while (a < 0) {
        a+=b;
    }
    return a;
}
const mod4 = (a) => mod(a,4);
const drawColors = () => {
    let x = width/4;
    let y = height/lookAhead;
    for (i=0; i<4; i++) {
        context.fillStyle = buttons[i];
        for (j=0; j<lookAhead;j++) {
            if (getValueAt(i,j))
                context.fillRect(i*x, j*y, x, y);
        }
    }
}
const drawScore = () => {
    context.fillStyle = scoreColor;
    context.font = scoreSize + " Consolas";
    context.fillText(100*score, scorePos.x, scorePos.y);
}

const drawBars = () => {
    let a = height / lookAhead;
    context.fillStyle = hSep;
    for(i=1; i<lookAhead;i++) {
        context.fillRect(0, i*a - (hSepHeight/2), width, hSepHeight);
    }

    let x = [ width / 4 - (barWidth / 2), (width -barWidth) /2, (width * 3 /4)- (barWidth / 2)];
    context.fillStyle = barColor;
    for (bar of x) {
        context.fillRect(bar, 0, barWidth, height);
    }
}

const update = () => {
    clear();
    drawColors();
    drawBars();
    currTick++;
    drawScore();
}

window.addEventListener('load', () => {
    start();
});