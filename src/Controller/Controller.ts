interface IEventEmitter {
    EmitEvent(): Event;
}

export class Controller {
    constructor() {
        document.getElementById("showBMI").onclick = () => this.changePage(false);
        document.getElementById("showGDP").onclick = () => this.changePage(true);
        
    }

    private changePage(isToGPD: boolean):any {
            document.getElementById("BMI").style.display = isToGPD ? "none" : "inline-flex";
            document.getElementById("GDP").style.display = isToGPD ? "inline-flex" : "none";
    }
}
