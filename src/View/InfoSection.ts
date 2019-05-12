import { View } from "./View";

export class InfoSection extends View {
    private countryDOM: HTMLElement;
    private fieldDOM: HTMLElement;
    private yearDOM: HTMLElement;

    constructor() {
        super();
        
        this.countryDOM = document.getElementById("Info-Country");
        this.fieldDOM = document.getElementById("Info-Field");
        this.yearDOM = document.getElementById("Info-Year");
        this.fieldDOM = document.getElementById("Info-Field");
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");

        eventTarget.addEventListener("StateChanged", e => this.render());
    }

    protected render(): void {
        this.countryDOM.innerText = this.dataManager.GetCountryName();
        this.yearDOM.innerText = this.dataManager.SelectedYear.toString();
        this.fieldDOM.innerHTML = this.dataManager.GetFieldValue().toString();
    }

    protected prepareData(): any[] {
        // throw new Error("Method not implemented.");
        return;
    }
}