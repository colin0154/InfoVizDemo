import { FeatureCollection } from "geojson";
import { namespace, formatDefaultLocale } from "d3";

export class DataManager {
    //#region Property
    private static instance: DataManager;

    private geoJson: FeatureCollection;
    private dataset: Map<string, any>;

    // Global States
    private selectedYear: number;
    private selectedCountry: string;
    private selectedField: DataManager.Field;
    //#endregion

    private constructor(){
        this.selectedYear = 2016;
        this.selectedCountry = "CHN";
        this.selectedField = DataManager.Field.Mean;
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
    
    public GetField(code: string = this.selectedCountry): number {
        const country: any = this.dataset.get(code);
        const year: number = this.selectedYear - 1975;
        const field: string = this.getSelectedField();
        
        return country[field][year];
    }

    // Return the country's all data from current field since 1975.
    public GetFieldAllYear(): Array<number> {
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
        return this.dataset.get(code)["Name"];
    }
    //#endregion

    //#region Helper Function
    // Return the property name.
    private getSelectedField(): string {
        switch (this.selectedField) {
            case DataManager.Field.Mean:
                return "Mean";
                break;
            case DataManager.Field.UnderWeight:
                return "UnderWeight";
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
        UnderWeight,
        Obesity,
        Severe,
        Morbid
    }
}
//#endregion
