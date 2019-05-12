import { DataManager } from "../Model/DataManager";
import * as d3 from "d3";
import { select } from "d3";

export abstract class View {
    // Data used to render d3 graphic.
    protected readonly dataManager: any;

    protected constructor(){
        this.dataManager = DataManager.Instance;
    }
    
    protected abstract render(): void;

    protected abstract prepareData(): Array<any>;

    protected drawAxis(): void {

    }

    protected mouseOver(data: any): void {
        d3.select("div#tooltip")
            .style("left", (d3.event.pageX - 30) + "px")
            .style("top", (d3.event.pageY - 40) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9);
        d3.select("div#tooltip").html(this.mouseOverContent(data));
    }

    protected abstract mouseOverContent(data: any): string;

    protected mouseOut(): void {
        d3.select("div#tooltip").transition()
            .duration(500)
            .style("opacity", 0)
    }
}
