const Carina = require('carina').Carina;
const ws = require('ws');
Carina.WebSocket = ws;


const startCarina = () => {
    const ca = new Carina({
        isBot: true
    }).open();

    console.log('Subscribed to the mixer constellation.');

    ca.subscribe('channel:5206637:followed', data => {
        console.log('new follower')
        if (data.following) {
            console.log('pushing the new item');
            array.push(data.user.channel.token);
            console.log(array);

        }
    });

};

let array = ['test one', 'test two', 'test three'];
let finishedPlaying = true; //global variable
let timerID = null;

function startTimer(one, two) {

    //log when timer is triggered
    console.log("Timer Fired: " + one + " at : " + Date.now.toString())

    timerID = setInterval(function() {
        getNextItem();
    }, two);

};


const getNextItem = () => {
    const LastItem = getLastItemInQueue();
    console.log(LastItem);
    if (array.length > 0) {
        playItem(array[array.length - 1]);
    } else {
        console.log('no item to play')
    }

};

getLastItemInQueue = function() {

    return new Date()

};

const playItem = item => {
    console.log('played', item);


    array.pop();
    console.log(array);
    finishedPlaying = true;
};

startCarina();
startTimer('test', 4000);



/*

const playItem = () => {
    let i = 0;
    const myLoop = () => {
        setTimeout(() => {
            main.style.visibility = 'visible';
            img.style.animation = 'popin 4s linear';
            p.style.animation = 'fadeinout 3.8s linear';
            p.style.animationDelay = '0.2s';
            text.innerHTML = array[0];
            text1.innerHTML = ' has followed the channel!';
            jqueryThing();
            setTimeout(() => { img.style.animation = ''; p.style.animation = ''; main.style.visibility = 'hidden'; array.shift(); console.log(array); }, 3999);
            i++;
            if (i < array.length) {
                myLoop();
            }
        }, 5500);
    };
    myLoop();
};

*/