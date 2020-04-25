// WORKOUT CLASS
class Workout{
    // Takes JSON conversion of Django QuerySet
    constructor(json){
        // Converting escaped characters to what they should be
        let myJSONList = ((document.getElementById("exercises").innerHTML).replace(/&(l|g|quo)t;/g, function(a,b){
            return {
                l   : '<',
                g   : '>',
                quo : '"'
            }[b];
        }));
        // Moving up a level so that fields are easily available
        this.exercises = JSON.parse(myJSONList).map((el)=>{return el.fields});
        console.log(this.exercises);
    }

    generateRandom(){
        this.exercises.sort(() => Math.random() - 0.5);
    }

    // Returns all if no size is passed
    names(size){
        return (size ? this.exercises.slice(0, size) : this.exercises).map((el)=>el.name);
    }

    // Returns all if no size is passed
    json(){
        return size ? this.exercises.slice(0, size): this.exercises;
    }
}

let time = 0;
let displayTime = 0;
let active = false;
let settingsOpen = true;
let isOn;
let on = 55;
let rest = 5;
let reps = 8;
let total = on + rest;
let progressBar = $("#progressBar");
let display = $("#timer");
let startStop = $("#startStop");
let onOff = $("#onOff");
let settingsPane = $("#settingsPane");
let timer;

let toneUp = $("#toneUp");
let toneDown = $("#toneDown");
let workout = new Workout($("#exercises").text());



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
    settingsPane.css("width", "0");
}

function openSettings(){
    settingsOpen = true;
    setTimeout(()=>{
        document.getElementsByClassName("settingsContent")[0].style.display = "inline";
        document.getElementById("settingsPane").classList = "settingsPane pane";
    }, 200);
    document.getElementById("settingsButton").style.display="none";
    settingsPane.css("width", "23%");
    document.getElementsByClassName("timerPane")[0].style.width = "75%";
}

function updateSettings(){
    on = Number(document.getElementById("on").value);
    rest = Number(document.getElementById("rest").value);
    reps = Number(document.getElementById("reps").value);
    total = on + rest;
    initialize();
}
This is a test

function initialize(){
    display.text(formatTimeCountDown(time));
    workout.generateRandom();
    $("#exercise").text(workout.names());
    setDisplaySize();
    initializeProgressBar();
}

function tick(){
    time += 0.01;
    display.text(formatTimeCountDown(time));
    onOff.text("Time: " + Math.floor(time) + " On: " + on + " Off: " + rest + " Total: " + total);
    if(Math.floor(on - (time % total)) == 2) toneDown.trigger("play");
    if(Math.floor(total - (time % total)) == 2) toneUp.trigger("play");
    setDisplaySize();
    updateProgressBar();
}


function setDisplaySize(){
    let size = "200px"
    if(displayTime > 600) size = "380px";
    else if(displayTime > 60) size = "330px";
    else if(displayTime > 10) size = "250px";
    display.css("width", size);
}

function toggleStartStop(){
    active ? stopTimer() : start();
    active = !active;
    setStartStopStyle();
}

function setStartStopStyle(){
    active ? startStop.text("Stop") : startStop.text("Start");
    // Default class is btn-success – toggles by adding btn-danger
    startStop.toggleClass("btn-danger");
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
    display.text(formatTimeCountDown(time));
    updateProgressBar();
    setDisplaySize();
}

function setOnOff(){
    isOn = ((time % total) - on) < 0;
    onOff.text(isOn ? "ON" : "OFF");
}

function formatTimeCountUp(time){
    mins = Math.floor(time/60);
    seconds = time%60;
    seconds = Math.round(seconds * 100) / 100;
    if(seconds%1==0) seconds = seconds + ".00";
    else if((seconds*10) % 1==0) seconds = seconds + "0";
    if(seconds < 10 && mins > 0) seconds = "0"+seconds;
    if(mins > 0) return(mins + ":" + seconds);
    else return(seconds);
}

function formatTimeCountDown(time){
    t = time % total;
    if(t < on) t = on - t;
    else t = rest - (t - on);
    displayTime = t;
    mins = Math.floor(t/60)
    seconds = t%60;
    seconds = Math.round(seconds * 100) / 100
    if(seconds%1==0) seconds = seconds + ".00";
    else if((seconds*10) % 1==0) seconds = seconds + "0";
    if(seconds < 10 && mins > 0) seconds = "0"+seconds;
    if(mins > 0) return(mins + ":" + seconds)
    else return(seconds)
}

function initializeProgressBar(){
    progressBar.empty();
    for(let i = 0; i < reps; i++){
        progressBar.append("<td>"+(i+1)+"</td>");
    }
}

function updateProgressBar(){
    currentInterval = Math.ceil(time/total) - 1;
    for(let i = 0; i < reps-1; i++){
        // Green
        if(i < currentInterval) progressBar.children()[i].css("background-color", "#99e398");
        // Red
        else if(i < currentInterval) progressBar.children()[i].css("background-color", "#ff7575");
        // Orange
        else if(i < currentInterval) progressBar.children()[i].css("background-color", "#ffd599");
    }
}



initialize();