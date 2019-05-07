import { FeatureCollection } from "geojson";
import { namespace, formatDefaultLocale } from "d3";

export class DataManager {
    //#region Singleton
    private static instance: DataManager;

    private constructor(){};

    public static get Instance(): DataManager {
        if (!DataManager.instance) {
            DataManager.instance = new DataManager();
        }
        return DataManager.instance;
    }
    //#endregion

    //#region DataSets
    private worldGeoPath: FeatureCollection;
    private bmiFemale: any;
    private bmiMale: any;
    private countryName: any;
    private perCapita: any;
    private isDataSet: boolean = false;

    public setData(data: Array<any>): void {
        if (this.isDataSet) {
            console.log("Error: Data has already been set.");
            return;
        }

        // [geoPath, femaleBMI, maleBMI, countryName, perCapita]
        this.worldGeoPath = data[0];
        this.bmiFemale = data[1];
        this.bmiMale = data[2];
        this.countryName = data[3];
        this.perCapita = data[4]
        this.isDataSet = true;
    }
    //#endregion

    //#region Global States
    private currentYear: number = 2016;
    private currentCountry: string = "CHN";
    private currentSex: DataManager.Sex = DataManager.Sex.Male;
    private currentDataType: DataManager.Type = DataManager.Type.Mean;
    //#endregion

    //#region Data Accessors
    public get WorldGeoPath(): FeatureCollection {
        if (!this.worldGeoPath) {
            console.log("Error: World atlas data is null.");
            return;
        }
        return this.worldGeoPath;
    }
    
    public GetBMI(): number {
        const targetSet = this.querySex();
        return targetSet[this.currentCountry][this.queryType()][this.currentYear - 1975];
    }

    // Return the country's all BMI data since 1975.
    public GetBMIAll(): Array<number> {
        const targetSet = this.querySex();
        return targetSet[this.currentCountry][this.queryType()];
    }

    public GetCountry(code: string = this.currentCountry): string {
        return this.countryName[code];
    }
    //#endregion

    //#region BMI data accessors helper funciton
    private querySex(): any {
        return this.currentSex == DataManager.Sex.Male ? this.bmiMale : this.bmiFemale;
    }

    private queryType(): string {
        switch (this.currentDataType) {
            case DataManager.Type.Mean:
                return "Mean";
                break;
            case DataManager.Type.UnderWeight:
                return "UnderWeight";
                break;
            case DataManager.Type.Obesity:
                return "Obesity";
                break;
            case DataManager.Type.Severe:
                return "Severe";
                break;
            case DataManager.Type.Morbid:
                return "Morbid";
                break;
        }
    }
    //#endregion
}

//#region Enums
// This is a workaround to use enum in a Typscript Class.
export namespace DataManager {
    export enum Sex {
        Male,
        Female
    }

    export enum Type {
        Mean,
        UnderWeight,
        Obesity,
        Severe,
        Morbid
    }
}
//#endregion
