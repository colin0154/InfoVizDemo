import { DataManager } from "../Model/DataManager";

export class Controller {
    private dataManager: DataManager;

    private yearSliderOne: HTMLInputElement;
    private yearSliderTwo: HTMLInputElement;
    private countrySelectOne: HTMLSelectElement;
    private countrySelectTwo: HTMLSelectElement;

    private previousActiveButton: HTMLElement;
    private isDropdownInitialized: boolean;

    constructor() {
        this.dataManager = DataManager.Instance;

        // So no implicit type conversion in TypeScript?
        this.yearSliderOne = <HTMLInputElement>document.getElementById("YearSliderOne");
        this.yearSliderTwo = <HTMLInputElement>document.getElementById("YearSliderTwo");
        this.countrySelectOne = <HTMLSelectElement>document.getElementById("selectDropdownOne");
        this.countrySelectTwo = <HTMLSelectElement>document.getElementById("selectDropdownTwo");

        this.isDropdownInitialized = false;

        this.addListener();
    }

    private addListener(): void {
        document.getElementById("showBMI").onclick = () => this.changePage(false);
        document.getElementById("showGDP").onclick = () => this.changePage(true);

        document.getElementById("Mean").onclick = (e) => this.changeField(e);
        document.getElementById("Underweight").onclick = (e) => this.changeField(e);
        document.getElementById("Obesity").onclick = (e) => this.changeField(e);
        document.getElementById("Severe").onclick = (e) => this.changeField(e);
        document.getElementById("Morbid").onclick = (e) => this.changeField(e);

        document.getElementById("EventTarget").addEventListener("StateChanged", e => this.stateChanged());

        this.yearSliderOne.onchange = () => this.changeYear(true);
        this.yearSliderTwo.onchange = () => this.changeYear(false);
        this.countrySelectOne.onchange = (e) => this.changeCountry(e);
        this.countrySelectTwo.onchange = (e) => this.changeCountry(e);
    }

    private changePage(isToGPD: boolean): void {
        if (this.dataManager.SelectedYear < 1990 && isToGPD) {
            this.dataManager.ChangeYear(1990);
        } 

        this.yearSliderOne.value = this.dataManager.SelectedYear.toString();
        this.yearSliderTwo.value = this.dataManager.SelectedYear.toString();

        document.getElementById("BMI").style.display = isToGPD ? "none" : "inline-flex";
        document.getElementById("GDP").style.display = isToGPD ? "inline-flex" : "none";
    }

    private changeYear(isSliderOne: boolean): void {
        if (isSliderOne) {
            this.dataManager.ChangeYear(Number(this.yearSliderOne.value))
        } else {
            this.dataManager.ChangeYear(Number(this.yearSliderTwo.value))
        }
    }

    private changeField(e: Event): void {
        // Change the button class for "current active style".
        if (this.previousActiveButton) {
            this.previousActiveButton.setAttribute("class", "field-button");
        }
        
        let node:HTMLElement = <HTMLElement>e.target;
        node.setAttribute("class", "field-button active");
        this.previousActiveButton = node;

        // Actually Change the state.
        switch(node.id) {
            case "Mean":
                this.dataManager.ChangeField(DataManager.Field.Mean);
                break;
            case "Underweight":
                this.dataManager.ChangeField(DataManager.Field.Underweight);
                break;
            case "Obesity":
                this.dataManager.ChangeField(DataManager.Field.Obesity);
                break;
            case "Severe":
                this.dataManager.ChangeField(DataManager.Field.Severe);
                break;
            case "Morbid":
                this.dataManager.ChangeField(DataManager.Field.Morbid);
                break;
        }
    }

    private changeCountry(e: Event): void {
        let node:HTMLSelectElement = <HTMLSelectElement>e.target;
        this.dataManager.ChangeCountry(node.value);
    }

    private initDropdown(): void {
        let countryList:Array<string> = Array.from(this.dataManager.GetCountryList());

        countryList.forEach(element => {
            let countryName: string = this.dataManager.GetCountryName(element);

            if (countryName == "") {
                return;
            }
            
            this.countrySelectOne.appendChild(new Option(countryName, element));
            this.countrySelectTwo.appendChild(new Option(countryName, element));
        });

        this.isDropdownInitialized = true;
    }

    private stateChanged(): void {
        if (!this.isDropdownInitialized) 
            this.initDropdown();

        this.countrySelectOne.value = this.dataManager.SelectedCountry;
        this.countrySelectTwo.value = this.dataManager.SelectedCountry;
    }
}
