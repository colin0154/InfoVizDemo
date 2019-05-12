import { FeatureCollection } from "geojson";

export class DataManager {
    //#region Property
    private static instance: DataManager;

    private geoJson: FeatureCollection;
    private dataset: Map<string, any>;

    // Global States
    private selectedYear: number;
    private selectedCountry: string;
    private selectedField: DataManager.Field;

    private readonly event: Event;
    private readonly EventTarget: HTMLElement;
    //#endregion

    private constructor(){
        this.selectedYear = 2016;
        this.selectedCountry = "CHN";
        this.selectedField = DataManager.Field.Mean;

        this.event = new Event("StateChanged")
        this.EventTarget = document.getElementById("EventTarget");
    }

    public static get Instance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }

        return DataManager.instance;
    }

    public Initialize(data: Array<any>): void {
        if (this.geoJson != null || this.dataset != null) {
            console.log("Warning: Data has already been set.");
            return;
        }

        this.geoJson = data[0];
        // Reverse from Array to Map.
        this.dataset = new Map(data[1]);
    }

    //#region Data Accessor
    public get GeoJson(): FeatureCollection {
        return this.geoJson;
    }

    public get SelectedCountry(): string {
        return this.selectedCountry;
    }

    public get SelectedYear(): number {
        return this.selectedYear;
    }
    
    public get SelectedField(): DataManager.Field {
        return this.selectedField;
    }
    
    public GetFieldValue(code: string = this.selectedCountry): number {
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1975;
        const field: string = this.getSelectedField();
        
        return country[field][year];
    }

    // Return the country's all data from current field since 1975.
    public GetFieldValueAllYear(): Array<number> {
        const country: any = this.dataset.get(this.selectedCountry);
        const field: string = this.getSelectedField();

        return country[field];
    }

    public GetPopulation(code: string = this.selectedCountry): number{
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1975;

        return country["Population"][year];
    }

    public GetGDPPerCapita(code: string = this.selectedCountry) {
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1990;

        return country["GDPPerCapita"][year];
    }

    public GetCountryList(): any {
        return this.dataset.keys();
    }

    public GetCountryName(code: string = this.selectedCountry): string {
        if (this.dataset.get(code) == null){
            return;
        }

        return this.dataset.get(code)["Name"];
    }
    //#endregion

    //#region State Setter
    public ChangeYear(year: number): void {
        if (year < 1975 || year > 2016) {
            console.log("Warning: DataManager don't have year " + year);
            return;
        }

        this.selectedYear = year;
        this.EventTarget.dispatchEvent(this.event);
    }

    public ChangeField(field: DataManager.Field): void {
        this.selectedField = field;
        this.EventTarget.dispatchEvent(this.event);
    }

    public ChangeCountry(code: string): void {
        if (!this.GetCountryName(code)) {
            console.log("Warning: Invalid country code.")
            return;
        }

        this.selectedCountry = code;
        this.EventTarget.dispatchEvent(this.event);
    }
    //#endregion

    //#region Helper Function
    // Return the property name.
    private getSelectedField(): string {
        switch (this.selectedField) {
            case DataManager.Field.Mean:
                return "Mean";
                break;
            case DataManager.Field.Underweight:
                return "Underweight";
                break;
            case DataManager.Field.Obesity:
                return "Obesity";
                break;
            case DataManager.Field.Severe:
                return "Severe";
                break;
            case DataManager.Field.Morbid:
                return "Morbid";
                break;
        }
    }
    //#endregion
}

//#region Enums
// This is a workaround to use enum in a Typscript Class.
export namespace DataManager {
    export enum Field {
        Mean,
        Underweight,
        Obesity,
        Severe,
        Morbid
    }
}
//#endregion
