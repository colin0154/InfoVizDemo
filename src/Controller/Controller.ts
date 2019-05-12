import { DataManager } from "../Model/DataManager";

export class Controller {
    private dataManager: DataManager;

    constructor() {
        this.dataManager = DataManager.Instance;
        this.addListener();
    }

    private addListener(): void {
        document.getElementById("showBMI").onclick = () => this.changePage(false);
        document.getElementById("showGDP").onclick = () => this.changePage(true);

        document.getElementById("Mean").onclick = () => this.dataManager.ChangeField(DataManager.Field.Mean);
        document.getElementById("Underweight").onclick = () => this.dataManager.ChangeField(DataManager.Field.Underweight);
        document.getElementById("Obesity").onclick = () => this.dataManager.ChangeField(DataManager.Field.Obesity);
        document.getElementById("Severe").onclick = () => this.dataManager.ChangeField(DataManager.Field.Severe);
        document.getElementById("Morbid").onclick = () => this.dataManager.ChangeField(DataManager.Field.Morbid);

        document.getElementById("Year").onchange = () => this.changeYear();
    }

    private changePage(isToGPD: boolean): void {
            document.getElementById("BMI").style.display = isToGPD ? "none" : "inline-flex";
            document.getElementById("GDP").style.display = isToGPD ? "inline-flex" : "none";
    }

    private changeYear(): void {
        // So no implicit type conversion in TypeScript?
        let target: HTMLInputElement = <HTMLInputElement>document.getElementById("Year");        
        
        this.dataManager.ChangeYear(Number(target.value));
    }
}
