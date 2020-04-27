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
    }

    generateRandom(){
        this.exercises.sort(() => Math.random() - 0.5);
    }

    // Returns all if no size is passed
    names(size){
        return (size ? this.exercises.slice(0, size) : this.exercises).map((el)=>el.name);
    }

    // Returns all if no size is passed
    json(size){
        return size ? this.exercises.slice(0, size): this.exercises;
    }
}

class Stopwatch{
    constructor(on, rest, reps, exercises){
        // Binding all functions so that they can be used as button click events
        this.start = this.start.bind(this);
        this.stop = this.stop.bind(this);
        this.reset = this.reset.bind(this);
        this.toggleStartStop = this.toggleStartStop.bind(this);
        this.tick = this.tick.bind(this);
        this.render = this.render.bind(this);
        
        // References to HTML elements
        this.startStopButton = $("#stopwatch-startStop");
        this.resetButton = $("#stopwatch-reset");
        this.display = $("#stopwatch-display");
        this.currentExercise = $("#currentExercise");
        this.nextExercise = $("#nextExercise");

        this.exercises = exercises;
        this.time = -5;
        this.active = false;
        this.timer;
        this.on = on;
        this.rest = rest;
        this.reps = reps;

        this.initializeButtons();
        this.initializeProgressBar();
        this.render();
        console.log(this.exercises);
    }

    get total(){
        return this.on + this.rest;
    }

    get currentInterval(){
        return Math.ceil(this.time / this.total);
    }

    get status(){
        if(this.time < 0) return "Countdown";
        else if(this.time % this.total < this.on) return "ON";
        else return "OFF";
    }

    // Sets text and click event for buttons
    initializeButtons(){
        this.startStopButton.text("Start");
        this.startStopButton.click(this.toggleStartStop);

        this.resetButton.text("Reset");
        this.resetButton.click(this.reset);
    }

    // Sets display... add any other necessary methods
    render(){
        this.display.text(this.formatCountdown());
        $("#status").text(this.status);

        // Setting exercise labels
        this.currentExercise.text("");
        this.nextExercise.text("");
        if(this.currentInterval == 0){
            this.currentExercise.text("Starting with: " + this.exercises[this.currentInterval].name);
        }else if(this.currentInterval != this.reps){
            if(this.status == "ON") this.currentExercise.text(this.exercises[this.currentInterval-1].name);
            this.nextExercise.text(" Next: " + this.exercises[this.currentInterval].name);
        }else{
            this.currentExercise.text(this.exercises[this.currentInterval-1].name);
        }
        
        // Checkinf if the workout is done
        if(this.time >= ((this.total)*this.reps) - this.rest){
            this.reset();
            this.display.text("DONE");
            this.currentExercise.text("");
            this.nextExercise.text("");
        }
        else{
            this.updateProgressBar();
        }
    }

    // Increments time
    tick(){
        this.time += 0.01;
        
        this.render();
    }

    // Default formatting method. Displays as (1.33, 10.33, 1:03.33)
    format(){
        let secs = Math.round((this.time % 60)*100) / 100;
        let mins = Math.floor(this.time/60);

        // Adding trailing zeros (e.g. 1.3 => 1.30, 1 => 1.00)
        if(secs % 1 == 0) secs += ".00";
        else if((secs*10) % 1 == 0) secs += "0";

        // Adds preceding 0 (e.g. 1:3.00 => 1:03.00)
        if(secs < 10 && mins > 0) secs = "0" + secs;

        // Only returns minutes when minutes exist (e.g. 10.33 NOT 0:10.33)
        if(mins){
            return(mins + ":" + secs)
        }else{
            return String(secs);
        }
    }

    formatCountdown(){
        if(this.time < 0){
            let secs = Math.round(this.time * -100) /100;
            if(secs % 1 == 0) secs += ".00";
            else if((secs*10) % 1 == 0) secs += "0";
            return secs;
        }
        let timeInInterval = this.time % this.total;
        let t;
        if(timeInInterval < this.on) t = this.on - timeInInterval;
        else t = this.rest - (timeInInterval - this.on);

        let secs = Math.round((t % 60)*100) / 100;
        let mins = Math.floor(t/60);

        // Adding trailing zeros (e.g. 1.3 => 1.30, 1 => 1.00)
        if(secs % 1 == 0) secs += ".00";
        else if((secs*10) % 1 == 0) secs += "0";

        // Adds preceding 0 (e.g. 1:3.00 => 1:03.00)
        if(secs < 10 && mins > 0) secs = "0" + secs;

        // Only returns minutes when minutes exist (e.g. 10.33 NOT 0:10.33)
        if(mins){
            return(mins + ":" + secs)
        }else{
            return String(secs);
        }
    }

    start(){
        this.timer = setInterval(this.tick, 10);
        this.active = true;
        this.startStopButton.text("Stop");
        this.startStopButton.addClass("btn-danger");
    }
    
    stop(){
        clearInterval(this.timer);
        this.active = false;
        this.startStopButton.text("Start");
        this.startStopButton.removeClass("btn-danger");
    }

    toggleStartStop(){
        if(this.active){
            this.stop();
        }else{
            this.start();
        }
    }

    reset(){
        this.stop();
        this.time = -5;
        this.render();
    }

    initializeProgressBar(){
        $("#progressBar").empty();
        for(let i = 0; i < this.reps; i++){
            $("#progressBar").append("<td>"+(i+1)+"</td>");
        }
    }

    updateProgressBar(){
        let currentInterval = Math.ceil(this.time/this.total) - 1;
        let children = $("#progressBar").children();
        for(let i = 0; i < this.reps; i++){
            // Green
            if(i < currentInterval) $(children[i]).css("background-color", "#99e398");
            // Red
            else if(i > currentInterval) $(children[i]).css("background-color", "#ff7575");
            // Orange
            else if(i == currentInterval) $(children[i]).css("background-color", "#ffd599");
        }
    }

    setSettings(on, rest, reps){
        this.on = on;
        this.rest = rest;
        this.reps = reps;

        this.initializeProgressBar();
        this.reset();
    }
}

let settingsOpen = true;

let on = 55;
let rest = 5;
let reps = 8;

let stopwatch;

let progressBar = $("#progressBar");
let settingsPane = $("#settingsPane");

let toneUp = $("#toneUp");
let toneDown = $("#toneDown");
let workout = new Workout($("#exercises").text());



document.addEventListener('keypress', logKey);
function logKey(e){
    if(e.code == "Space") stopwatch.toggleStartStop();
    if(e.code == "KeyR") stopwatch.reset();
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
    let on = Number(document.getElementById("on").value);
    let rest = Number(document.getElementById("rest").value);
    let reps = Number(document.getElementById("reps").value);   
    stopwatch.setSettings(on, rest, reps);
}

function initialize(){
    workout.generateRandom();
    stopwatch = new Stopwatch(on, rest, reps, workout.json());
}



initialize();