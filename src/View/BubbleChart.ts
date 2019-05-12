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

        this.xAxis = d3.scaleLinear().range([20, 956]);
        this.yAxis = d3.scaleLinear().range([698, 20]);
        this.zAxis = d3.scaleLinear().range([1, 40]);
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");
        eventTarget.addEventListener("StateChanged", e => this.render());
    }

    protected render(): void {
        let data: Array<any> = this.prepareData();

        d3.select("svg#GDP > g.xAxis")
            .attr("transform", "translate(0, 700)")
            .call(d3.axisBottom(this.xAxis));
        
        d3.select("svg#GDP > g.yAxis")
            .attr("transform", "translate(30, 0)")
            .call(d3.axisLeft(this.yAxis));
        
        d3.select("svg#GDP > g.Bubble")
            .selectAll(".bubble")
            .data(data)
            .attr("cx", d => this.xAxis(d["GDPPerCapita"]))
            .attr("cy", d => this.yAxis(d["Field"]))
            .attr("r", d => this.zAxis(d["Population"]))
            .enter()
            .append("circle")
            .attr("cx", d => this.xAxis(d["GDPPerCapita"]))
            .attr("cy", d => this.yAxis(d["Field"]))
            .attr("r", d => this.zAxis(d["Population"]))
            .attr("class", "bubble")
            .attr("country", d => d["Code"])
            .on("mouseover", d => this.mouseOver(d))
            .on("mouseout", d => this.mouseOut());
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
            specificCountryData["Field"] = this.dataManager.GetField(element);
            specificCountryData["GDPPerCapita"] = this.dataManager.GetGDPPerCapita(element);
            specificCountryData["Population"] = this.dataManager.GetPopulation(element);

            // Some countries don't have data in specific year. Just skip.
            if(specificCountryData["Field"] == null
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
        return data["Code"];
    }

}
