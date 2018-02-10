let track  = require('./song.js').song;

const color = {
    bar: 'black',
    score: 'blue',
    background: 'white',
    horizontalSeparator: 'lightgrey',
    buttons: ['red', 'blue', 'green', 'orange'],
};

const dimension = {
    width: 400,
    height: 600,
};

const score = {
    value: 0,
    old: 0,
    combo: 0,
    position: {
        x: dimension.width * 1 / 2,
        y: dimension.height * 1 / 10,
    },
    size: '50px',
};

let canvas = document.createElement("canvas");
let context = canvas.getContext("2d");

const barWidth = 10;
const lookAhead = 10;
const hSepHeight = 8;
const loop = 4; //loop every 20 ticks, 0 to disable


// definition of game variable
let bpm = 120; //bpm
let takt = 60000 / bpm;
let currTick = 0; //current tik
let offset = 0;
let speedScare = 4;

const start = () => {
    canvas.width = dimension.width;
    canvas.height = dimension.height;
    canvas.addEventListener('click', clickListener);
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    countDown();
    setInterval(update, 60); //TODO: recheck if this is running asynchron (it should wait for the countdown)
}

const countDown = () => {
    for (i=3; i > 0; i--) {
        //TODO: print a big (value of i) on screen for countdown
        //TODO: add countdown sounds
    }
}

const clickListener = (event) => {
    let t = currTick;
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    y = canvas.width - y;

    //TODO: add animation (when getting negative points)
    if (y < dimension.height / lookAhead) {
        if (x < dimension.width / 4) {
            if (getValueAt(0, lookAhead) > 0) {
                score.value++;
            } else {
                score.value--;
            }
        } else if (x < 2 * dimension.width / 4) {
            if (getValueAt(1, lookAhead) > 0) {
                score.value++;
            } else {
                score.value--;
            }
        } else if (x < 3 * dimension.width / 4) {
            if (getValueAt(2, lookAhead) > 0) {
                score.value++;
            } else {
                score.value--;
            }
        } else {
            if (getValueAt(3, lookAhead) > 0) {
                score.value++;
            } else {
                score.value--;
            }
        }
    }
}

const clear = () => {
    context.fillStyle = color.background;
    context.fillRect(0, 0, dimension.width, dimension.height);
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

const checkCombo = () => {
    let sum = 0;
    for (i=0; i<4; i++) {
        sum += getValueAt(i, lookAhead);
    }
    if (score.value - score.old == sum) {
        //COMBO!!!
        //TODO : add some cool animation
        score.combo++;
    } else {
        //bonus points
        //TODO : add some cool animation
        if (score.combo > 3)
            score.value += score.combo / 2; //half point for everycombo
        score.combo = 0;
    }
}


const getValueAtTick = (i,j,t) => {
    if (loop > 0) {
        return track[mod(lookAhead - 1 + t - j, loop)][i];
    } else {
        return track[lookAhead - 1 + t - j][i];
    }
}

const getValueAt = (i,j) => getValueAtTick(i,j,currTick);

/**
 * Print scare
 */
const drawColors = () => {
    let x = dimension.width / 4;
    let y = dimension.height / lookAhead;
    for (i = 0; i < 4; i++) {
        context.fillStyle = color.buttons[i]; // TODO make it random
        for (j = 0; j < lookAhead; j++) {
            if (getValueAt(i,j))
                context.fillRect(i * x, j * y + offset, x, y);
        }
    }
}

/**
 * Print the actual score
 */
const drawScore = () => {
    context.fillStyle = color.score;
    context.font = score.size + " Consolas";
    context.fillText(100 * score.value, score.position.x, score.position.y);
}

/**
 * Print separator between square
 */
const drawBars = () => {
    let a = dimension.height / lookAhead;

    // print horizontal separator
    context.fillStyle = color.horizontalSeparator;
    for(i = 1; i < lookAhead; i++) {
        context.fillRect(0, i * a - (hSepHeight / 2) + offset, dimension.width, hSepHeight);
    }

    // print vertical separator
    let x = [
        dimension.width / 4 - (barWidth / 2),
        (dimension.width - barWidth) / 2,
        (dimension.width * 3 / 4) - (barWidth / 2)
    ];

    context.fillStyle = color.bar;
    for (bar of x) {
        context.fillRect(bar, 0, barWidth, dimension.height);
    }
}

/**
 * Update screen
 */
const update = () => {
    clear();
    drawColors();
    drawBars();
    checkCombo();
    score.old = score.value;
    offset += speedScare;
    if (offset > dimension.height / lookAhead) {
        offset = speedScare;
        currTick++;
    }
    drawScore();
}

window.addEventListener('load', () => {
    start();
});
