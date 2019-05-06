import { FeatureCollection } from "geojson";
import * as d3 from "d3";

export abstract class View {
    // Container for d3 selector.
    protected _selection: any;

    // Data used to render d3 graphic.
    protected _data: FeatureCollection;

    constructor(container: string, dataSet: FeatureCollection){
        this._selection = d3.select(container);
        this._data = dataSet;
    }
    
    protected abstract render(): void;
}