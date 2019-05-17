import { View } from "./View";
import { Controller } from "../Controller/Controller";
import { DataManager } from "../Model/DataManager";
const getCountryISO2 = require("country-iso-3-to-2");

export class InfoSection extends View {
    private countryDOM: HTMLElement;
    private fieldDOM: HTMLElement;
    private yearDOM: HTMLElement;
    private portraitDOM: HTMLElement;
    private flagDOM: HTMLElement;

    constructor() {
        super();
        
        this.countryDOM = document.getElementById("Info-Country");
        this.fieldDOM = document.getElementById("Info-Field");
        this.yearDOM = document.getElementById("Info-Year");
        this.portraitDOM = document.getElementById("Info-Portrait");
        this.flagDOM = document.getElementById("Info-FlagIcon");
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");

        eventTarget.addEventListener("StateChanged", e => this.render());
    }

    protected render(): void {
        // Upper part of info section.
        this.changePortrait();
        
        this.changeFlagIcon();

        // Lower part of info section.
        if (Controller.CurrentPageOnGDP) 
            return;
        
        this.countryDOM.innerText = this.dataManager.GetCountryName();
        this.yearDOM.innerText = this.dataManager.SelectedYear.toString();
        
        let value: string = this.dataManager.GetFieldValue().toString();
        let name: string = this.dataManager.SelectedField == DataManager.Field.Mean ? "BMI均值：" : "患病率：";
        this.fieldDOM.innerHTML = name + value;


    }

    protected prepareData(): any[] {
        return;
    }

    private changePortrait(): void {
        if (this.dataManager.SelectedField == DataManager.Field.Mean){
            let value: number = this.dataManager.GetFieldValue();

            switch (true) {
                case (value < 18.5):
                    this.portraitDOM.setAttribute("style", "object-position: 0 0");
                    break;
                case (value >= 18.5 && value <= 29.99):
                    this.portraitDOM.setAttribute("style", "object-position: -194px 0");
                    break;
                case (value >= 30 && value <= 34.99):
                    this.portraitDOM.setAttribute("style", "object-position: -388px 0");
                    break;
                case (value >= 35 && value <= 39.99):
                    this.portraitDOM.setAttribute("style", "object-position: -582px 0");
                    break;
                case (value >= 40):
                    this.portraitDOM.setAttribute("style", "object-position: -776px 0");
                    break;
            }
        }

        switch (this.dataManager.SelectedField) {
            case DataManager.Field.Underweight:
                this.portraitDOM.setAttribute("style", "object-position: 0 0");
                break;
            case DataManager.Field.Obesity:
                this.portraitDOM.setAttribute("style", "object-position: -388px 0");
                break;
            case DataManager.Field.Severe:
                this.portraitDOM.setAttribute("style", "object-position: -582px 0");
                break;
            case DataManager.Field.Morbid:
                this.portraitDOM.setAttribute("style", "object-position: -776px 0");
                break; 
        }
    }

    private changeFlagIcon(): void {
        let html: string = "flag-icon flag-icon-" + this.dataManager.GetCountryCodeA2().toLowerCase();
        this.flagDOM.setAttribute("class", html);
    }
}