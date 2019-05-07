import { FeatureCollection } from "geojson";
import * as d3 from "d3";

export abstract class View {
    // Container for d3 selector.
    protected selection: any;

    // Data used to render d3 graphic.
    protected data: FeatureCollection;

    constructor(container: string, dataSet: FeatureCollection){
        this.selection = d3.select(container);
        this.data = dataSet;
    }
    
    protected abstract render(): void;
}