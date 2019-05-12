import { View } from "./View";
import { ScaleLinear } from "d3";
import * as d3 from "d3";

export class BubbleChart extends View {
    private countryList: Array<string>;

    private xAxis: ScaleLinear<number, number>;
    private yAxis: ScaleLinear<number, number>;
    private zAxis: ScaleLinear<number, number>;

    public constructor() {
        super();

        // Maybe Map support in TypeScript is not that good?
        this.countryList = Array.from(this.dataManager.GetCountryList());

        this.xAxis = d3.scaleLinear().range([60, 926]);
        this.yAxis = d3.scaleLinear().range([558, 0]);
        this.zAxis = d3.scaleLinear().range([3, 40]);
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");
        eventTarget.addEventListener("StateChanged", e => this.render());
    }

    protected render(): void {
        let data: Array<any> = this.prepareData();

        d3.select("svg#GDP > g.xAxis")
            .attr("transform", "translate(0, 558)")
            .call(d3.axisBottom(this.xAxis));
        
        d3.select("svg#GDP > g.yAxis")
            .attr("transform", "translate(60, 0)")
            .call(d3.axisLeft(this.yAxis));
        
        d3.selectAll(".bubble").remove();

        d3.select("svg#GDP > g.Bubble")
            .selectAll(".bubble")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => this.xAxis(d["GDPPerCapita"]))
            .attr("cy", d => this.yAxis(d["Field"]))
            .attr("r", d => this.zAxis(d["Population"]))
            .attr("class", "bubble")
            .on("mouseover", d => this.mouseOver(d))
            .on("mouseout", d => this.mouseOut())
            .exit().remove();
    }

    protected prepareData(): Array<any> {
        let data: Array<any> = [];

        // Determine the max/min value for axis scale. 
        // Make sure their value would be replaced.
        let xmax: number = 0;
        let ymin: number = 99999;
        let ymax: number = 0;
        let zmin: number = 9999999999;
        let zmax: number = 0;

        this.countryList.forEach(element => {
            let specificCountryData: any = {};
            specificCountryData["Code"] = element;
            specificCountryData["Field"] = this.dataManager.GetFieldValue(element);
            specificCountryData["GDPPerCapita"] = this.dataManager.GetGDPPerCapita(element);
            specificCountryData["Population"] = this.dataManager.GetPopulation(element);

            // Some countries don't have data in specific year. Just skip.
            if(specificCountryData["Field"] == null
                || specificCountryData["GDPPerCapita"] == 0
                || specificCountryData["GDPPerCapita"] == null
                || specificCountryData["Population"] == null)
                return;
            
            if (specificCountryData["Field"] < ymin)
                ymin = specificCountryData["Field"];
            if (specificCountryData["Field"] > ymax)
                ymax = specificCountryData["Field"];
            if (specificCountryData["GDPPerCapita"] > xmax)
                xmax = specificCountryData["GDPPerCapita"]; 
            if (specificCountryData["Population"] < zmin)
                zmin = specificCountryData["Population"];
                if (specificCountryData["Population"] > zmax)
                zmax = specificCountryData["Population"];

            data.push(specificCountryData);
        });

        this.xAxis.domain([0, xmax]);
        this.yAxis.domain([ymin, ymax]);
        this.zAxis.domain([zmin, zmax]);

        return data;
    }

    protected mouseOverContent(data: any): string {
        let html: string =
        "<p>" + this.dataManager.GetCountryName(data["Code"]) +"</p>"
        + "<p>GDP：" + data["GDPPerCapita"] + "</p>";

        // Determine using ten thousand or million as unit
        // Source data is already using thousand as unit, so a million is 1000;
        const HUNDRED_MILLION:number = 100000;
        let pop = data["Population"];

        if (data["Population"] > HUNDRED_MILLION) {
            let aboveHM = Math.floor(data["Population"] / HUNDRED_MILLION);
            let belowHM = Math.round((pop - aboveHM * HUNDRED_MILLION) / 10);
            html += "<p>人口：" + aboveHM + "亿" + belowHM + "万</p>"
        } else {
            html += "<p>人口：" + Math.round(pop / 10) + "万</p>"
        }

        return html;
    }
}
