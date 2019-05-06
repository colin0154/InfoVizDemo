import { FeatureCollection } from "geojson";

export class DataManager {
    // DataManager is a Singleton.
    private static _instance: DataManager;
    private _worldAtlas: any;

    private constructor(){}

    public static get Instance(): DataManager {
        if (!DataManager._instance) {
            DataManager._instance = new DataManager();
        }
        return DataManager._instance;
    }

    public get WorldAtlas(): any {
        if (!this._worldAtlas) {
            console.log("Error: World atlas data is null.");
            return;
        }
        return this._worldAtlas;
    }

    public set WorldAtlas(data: any) {
        this._worldAtlas = data;
    }
}
