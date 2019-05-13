import { DataManager } from "../Model/DataManager";

export class Controller {
    private dataManager: DataManager;

    private yearSliderOne: HTMLInputElement;
    private yearSliderTwo: HTMLInputElement;
    private countrySelectOne: HTMLSelectElement;
    private countrySelectTwo: HTMLSelectElement;

    private previousActiveButton: HTMLElement;
    private isDropdownInitialized: boolean;

    public static CurrentPageOnGDP: boolean;

    constructor() {
        this.dataManager = DataManager.Instance;

        // So no implicit type conversion in TypeScript?
        this.yearSliderOne = <HTMLInputElement>document.getElementById("YearSliderOne");
        this.yearSliderTwo = <HTMLInputElement>document.getElementById("YearSliderTwo");
        this.countrySelectOne = <HTMLSelectElement>document.getElementById("selectDropdownOne");
        this.countrySelectTwo = <HTMLSelectElement>document.getElementById("selectDropdownTwo");

        this.previousActiveButton = document.getElementById("Mean");

        this.isDropdownInitialized = false;

        Controller.CurrentPageOnGDP = false;

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

        this.yearSliderOne.oninput = (e) => this.changeYear(e, true);
        this.yearSliderTwo.oninput = (e) => this.changeYear(e, false);
        this.countrySelectOne.onchange = (e) => this.changeCountry(e);
        this.countrySelectTwo.onchange = (e) => this.changeCountry(e);

        // this.yearSliderTwo.oninput = (e) => this.sliderOnInput(e);
    }

    private changePage(isToGDP: boolean): void {
        if (this.dataManager.SelectedYear < 1990 && isToGDP) {
            this.dataManager.ChangeYear(1990);
        } 

        this.yearSliderOne.value = this.dataManager.SelectedYear.toString();
        this.yearSliderTwo.value = this.dataManager.SelectedYear.toString();

        this.sliderOnInput(!isToGDP);

        // Stop rendering the not visible page.
        Controller.CurrentPageOnGDP= isToGDP;
        // Raise event to tell charts to update. Otherwise the charts would still have previous state since last page change.
        document.getElementById("EventTarget").dispatchEvent(new Event("StateChanged"));

        document.getElementById("BMI").style.display = isToGDP ? "none" : "inline-flex";
        document.getElementById("GDP").style.display = isToGDP ? "inline-flex" : "none";

        document.getElementById("showBMI").setAttribute("class", isToGDP ? "" : "active");
        document.getElementById("showGDP").setAttribute("class", isToGDP ? "active" : "");
    }

    private changeYear(e: Event, isSliderOne: boolean): void {
        if (isSliderOne) {
            this.dataManager.ChangeYear(Number(this.yearSliderOne.value))
        } else {
            this.dataManager.ChangeYear(Number(this.yearSliderTwo.value))
        }

        this.sliderOnInput(isSliderOne);
    }

    private changeField(e: Event): void {
        // Change the button class for "current active style". Default active is "MeanBMI".
        this.previousActiveButton.setAttribute("class", "field-button");
        
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
        let countryList: Array<string> = Array.from(this.dataManager.GetCountryList());
        let sortableList: Array<Array<string>> = [];

        // Get [Code, Name] pair into a sortable array.
        countryList.forEach(element => {
            let countryName: string = this.dataManager.GetCountryName(element);

            if (countryName == "") {
                return;
            }
            sortableList.push([element, countryName]);
        });

        let sortedList: Array<Array<string>> = sortableList.sort((a,b) => a[1].localeCompare(b[1], "zh-Hans-CN", {sensitivity: "accent"}));

        sortableList.forEach(element => {
            this.countrySelectOne.appendChild(new Option(element[1], element[0]));
            this.countrySelectTwo.appendChild(new Option(element[1], element[0]));
        })

        this.isDropdownInitialized = true;
    }

    private stateChanged(): void {
        if (!this.isDropdownInitialized) 
            this.initDropdown();

        this.countrySelectOne.value = this.dataManager.SelectedCountry;
        this.countrySelectTwo.value = this.dataManager.SelectedCountry;
    }

    private sliderOnInput(isSliderOne: boolean): void {
        let target: HTMLElement,
            step: number,
            width: number,
            innerText: string;

        if (isSliderOne) {
            target = document.getElementById("SliderOneOutput");
            step = (-7 + 91) / 41;
            width = -91 + (Number(this.yearSliderOne.value)-1975) * step;
            innerText = this.yearSliderOne.value;
        } else {
            target = document.getElementById("SliderTwoOutput");
            step = (-6 + 92) / 26;
            width = -92 + (Number(this.yearSliderTwo.value)-1990) * step;
            innerText = this.yearSliderTwo.value;
        }
        
        let style: string = "left: " + width.toString() + "%";
        target.setAttribute("style", style);
        target.innerText = innerText;
    }
}
