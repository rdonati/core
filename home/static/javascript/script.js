
let time = 0;
let displayTime = 0;
let active = false;
let settingsOpen = true;
let isOn;
let on = 55;
let rest = 5;
let reps = 8;
let total = on + rest;
let progressBar = document.getElementById("progressBar");
let display = document.getElementById("timer");
let startStop = document.getElementById("startStop");
let intervalCounter = document.getElementById("intervalCounter");
let onOff = document.getElementById("onOff");
let settingsPane = document.getElementsByClassName("settingsPane")[0];
let timer;

let toneUp = document.getElementById("toneUp");
let toneDown = document.getElementById("toneDown");

document.addEventListener('keypress', logKey);
function logKey(e){
    if(e.code == "Space") toggleStartStop();
    if(e.code == "KeyR") reset();
    if(e.code == "KeyS") toggleSettings();
}

function toggleSettings(){
    settingsOpen ? closeSettings() : openSettings();
}

function closeSettings(){
    settingsOpen = false;
    setTimeout(()=>{document.getElementById("settingsButton").style.display="inline"}, 200);
    document.getElementsByClassName("timerPane")[0].style.width = "100%";
    document.getElementsByClassName("settingsContent")[0].style.display = "none";
    document.getElementById("settingsPane").classList = "settingsPane";
    settingsPane.style.width = "0";
}

function openSettings(){
    settingsOpen = true;
    setTimeout(()=>{
        document.getElementsByClassName("settingsContent")[0].style.display = "inline";
        document.getElementById("settingsPane").classList = "settingsPane pane";
    }, 200);
    document.getElementById("settingsButton").style.display="none";
    settingsPane.style.width = "23%";
    document.getElementsByClassName("timerPane")[0].style.width = "75%";
}

function updateSettings(){
    on = Number(document.getElementById("on").value);
    rest = Number(document.getElementById("rest").value);
    reps = Number(document.getElementById("reps").value);
    total = on + rest;
    initialize();
}

function initialize(){
    display.innerHTML = formatTimeCountDown(time);
    setDisplaySize();
    initializeProgressBar();
}

function tick(){
    time += 0.01;
    display.innerHTML = formatTimeCountDown(time);
    onOff.innerHTML = "Time: " + Math.floor(time) + " On: " + on + " Off: " + rest + " Total: " + total;
    if(Math.floor(on - (time % total)) == 2) toneDown.play();
    if(Math.floor(total - (time % total)) == 2) toneUp.play();
    setDisplaySize();
    updateProgressBar();
    // setOnOff();
}


function setDisplaySize(){
    let size = "200px"
    if(displayTime > 600) size = "380px";
    else if(displayTime > 60) size = "330px";
    else if(displayTime > 10) size = "250px";
    display.style.width = size;
}

function toggleStartStop(){
    active ? stopTimer() : start();
    active = !active;
    setStartStopStyle();
}

function setStartStopStyle(){
    if(!active){
        startStop.innerHTML = "Start";
        startStop.className = "btn btn-success"
    }
    else{
        startStop.innerHTML = "Stop";
        startStop.className = "btn btn-danger"
    }
}

function start(){
    stopTimer();
    timer = setInterval(tick, 10);
}

function stopTimer(){
    clearInterval(timer);
}

function reset(){
    stopTimer();
    active = false;
    setStartStopStyle();
    time = 0;
    displayTime = 0;
    display.innerHTML = formatTimeCountDown(time);
    updateProgressBar();
    setDisplaySize();
}

function setOnOff(){
    isOn = ((time % total) - on) < 0;
    onOff.innerHTML = isOn ? "ON" : "OFF"
}

function formatTimeCountUp(time){
    mins = Math.floor(time/60)
    seconds = time%60;
    seconds = Math.round(seconds * 100) / 100
    if(seconds%1==0) seconds = seconds + ".00";
    else if((seconds*10) % 1==0) seconds = seconds + "0";
    if(seconds < 10 && mins > 0) seconds = "0"+seconds;
    if(mins > 0) return(mins + ":" + seconds)
    else return(seconds)
}

function formatTimeCountDown(time){
    t = time % total;
    if(t < on) t = on - t;
    else t = rest - (t - on);
    displayTime = t;
    mins = Math.floor(t/60)
    seconds = t%60;
    seconds = Math.round(t * 100) / 100
    if(seconds%1==0) seconds = seconds + ".00";
    else if((seconds*10) % 1==0) seconds = seconds + "0";
    if(seconds < 10 && mins > 0) seconds = "0"+seconds;
    if(mins > 0) return(mins + ":" + seconds)
    else return(seconds)
}

function initializeProgressBar(){
    while (progressBar.firstChild) {
        progressBar.removeChild(progressBar.lastChild);
    }
    for(let i = 0; i < reps; i++){
        progressBar.insertCell(i).innerHTML=i+1;
    }
}

function updateProgressBar(){
    currentInterval = Math.ceil(time/total) - 1;
    for(let i = 0; i < reps-1; i++){
        // Green
        if(i < currentInterval) progressBar.childNodes[i].style.backgroundColor = "#99e398";
        // Red
        else if(i > currentInterval) progressBar.childNodes[i].style.backgroundColor = "#ff7575";
        // Orange
        else if(i == currentInterval) progressBar.childNodes[i].style.backgroundColor = "#ffd599";
    }
}

initialize();

