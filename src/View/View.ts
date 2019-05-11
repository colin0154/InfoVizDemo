import { DataManager } from "../Model/DataManager";
import * as d3 from "d3";

export abstract class View {
    // Data used to render d3 graphic.
    protected readonly dataManager: any;

    constructor(){
        this.dataManager = DataManager.Instance;
    }
    
    protected abstract render(): void;
}