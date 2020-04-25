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

    randomWorkout(size){
        this.exercises.sort(() => Math.random() - 0.5);
        return this.exercises.slice(size).map((el)=>{el.name});
    }
}