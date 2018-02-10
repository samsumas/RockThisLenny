// This is a very serious repo. Please do not use any kind of humor and behave professionally.

let track  = require('./song.js').generateRandomSong();

//console.log(track);

const color = {
    bar: 'black',
    score: 'blue',
    background: 'white',
    horizontalSeparator: 'lightgrey',
    buttons: ['red', 'blue', 'green', 'orange'],
    fire: 0 //TODO:when in a long combo : put this to one and print cool flames in the background
};

const dimension = {
    width: 400,
    height: 600,
};

//please ignore following strings, its only deko
const combomessages = [
    "$WAGGYBOY",
    "Almost like Meltdown on Intel",
    "This nearly proved P=NP!",
    "COOOOOOOOOOOOMMMMMMMMMMBBBBBBBBBBOOOOOOOO",
    "THIS LENNY IS ON FIREEEEEEE!"
];

const longcombomessages = [
    "This combo was nearly as long as my penis. Nearly.",
    "Cookiezi's becoming jealous!",
    "This deserved one Cookie!"
];

const failmessages = [
    "Failed!",
    "Maybe you should go back to studying...",
    "Missed a Tile!",
    "Almost as sad as Meltdown with Intel",
    "it isn't that complicated, noob",
    "Try Harder!",
    "This isnt hard: just click the right tiles at the same Moment",
    "If you thought this is hard, try TI"
];

const score = {
    value: 0,
    old: 0,
    combo: 0,
    clickedThisTick: [0, 0, 0, 0],
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
const loop = track.length-hSepHeight; //0 to disable


// definition of game variable
let bpm = 120; //bpm
let takt = 60000 / bpm;
let currTick = 0; //current tik
let offset = 0;
let speedScare = 4;

const start = () => {
    canvas.width = dimension.width;
    canvas.height = dimension.height;
    document.addEventListener('keydown', keyListener);
    canvas.addEventListener('click', clickListener);
    document.body.insertBefore(canvas, document.body.childNodes[0]);
    countDown();
    setInterval(update, 60); //TODO: recheck if this is running asynchron (it should wait for the countdown)
}

const countDown = () => {
//  for (i=3; i > 0; i--) {
//      //TODO: print a big (value of i) on screen for countdown
//      //TODO: add countdown sounds
//  }
}

const keyListener = (event) => {
    let c = -1;
    switch (event.keyCode) {
        case 81: //q
            c=0;
            break;
        case 87: //w
            c=1;
            break;
        case 69: //e
            c=2;
            break;
        case 82: //r
            c=3;
            break;
        default:
            //do nothing
    }
    if (c != -1) {
        if (score.clickedThisTick[c])
            return; // do nothing
        if (getValueAt(c, lookAhead - 1) > 0) {
            score.value++;
        } else {
            score.value--;
        }
        score.clickedThisTick[c] = 1;
        return;
    }
}

const shoutAtLousyPlayer = () => {
    //TODO: print one from failmessages to Screen for 2 seconds
    //in big red letters
}
const complimentGoodPlayer = () => {
    //TODO: print one from combomessages to SCreen for 2 seconds
    //in normalsized green letters (it has to be smaller then score:P)
}
const complimentVeryGoodPlayer = () => {
    //TODO: print one from longcombomessages to Screen for 2 seconds
    //in big lila letters
}

//listens to clicks
const clickListener = (event) => {
    let t = currTick;
    let x = event.pageX - canvas.offsetLeft;
    let y = event.pageY - canvas.offsetTop;
    y = canvas.width - y;

    for (i = 0; i < 4; i++) {
        if (x < dimension.width * (1+i)/ 4) {
            if (getValueAt(i, lookAhead-1) > 0) {
                score.value++;
            } else {
                score.value--;
                //TODO: make animation
            }
            break;
        }
    }
}

const clear = () => {
    if (color.fire) {
        //TODO:cool flames and stuff
    } else {
        context.fillStyle = color.background;
        context.fillRect(0, 0, dimension.width, dimension.height);
    }
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
    if (sum != 0 && score.value - score.old == sum) {
        //COMBO!!!
        //TODO : add some cool animation
        //color.fire = 1; //only uncomment this when the time comes
        score.combo++;
    } else {
        //bonus points
        //TODO : add some cool animation
        if (score.combo > 3)
            score.value += score.combo / 2; //half point for everycombo
        color.fire = 0;
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
    offset += speedScare;
    if (offset > dimension.height / lookAhead) {
        offset = speedScare;
        currTick++;
        //following things has to be done one time per tick
        checkCombo();
        score.old = score.value;
        for (i=0; i<4; i++) {
            score.clickedThisTick[i] = 0;
        }
    }
    drawScore();
}

window.addEventListener('load', () => {
    start();
});
