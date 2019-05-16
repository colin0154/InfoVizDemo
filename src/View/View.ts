import { DataManager } from "../Model/DataManager";
import * as d3 from "d3";
import { Controller } from "../Controller/Controller";

export abstract class View {
    // Data used to render d3 graphic.
    protected readonly dataManager: DataManager;

    protected constructor(){
        this.dataManager = DataManager.Instance;
        this.addListener();
    }
    
    protected abstract render(): void;

    protected abstract prepareData(): Array<any>;

    protected mouseOver(data: any): void {
        let position: Array<number> = Controller.CurrentPageOnGDP ? [30, 55] : [-55, -40];

        d3.select("div#tooltip")
            .style("left", (d3.event.pageX + position[0]) + "px")
            .style("top", (d3.event.pageY + position[1]) + "px")
                .transition()
                .duration(200)
                .style("opacity", .9);
        d3.select("div#tooltip").html(this.mouseOverContent(data));
    }

    protected mouseOverContent(data: any): string {
        throw new Error ("Error. mouseOVerContent hasn't been implemented yet.")
    }

    protected mouseOut(): void {
        d3.select("div#tooltip").transition()
            .duration(500)
            .style("opacity", 0)
    }

    protected abstract addListener(): void
}
