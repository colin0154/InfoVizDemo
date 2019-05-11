import { View } from "./View";
import * as d3 from "d3";

export class BubbleChart extends View {
    private readonly countryList: Array<string>;
    private readonly data: Array<any>;

    private readonly xAxis: any;
    private readonly yAxis: any;
    private readonly zAxis: any;

    public constructor() {
        super();

        // Maybe Map support in TypeScript is not that good?
        this.countryList = Array.from(this.dataManager.GetCountryList());

        this.data = [];

        this.xAxis = d3.scaleLinear().range([20, 956]);
        this.yAxis = d3.scaleLinear().range([698, 20]);
        this.zAxis = d3.scaleLinear().range([1, 40]);

        this.render();
    }

    protected render(): void {
        // Clear the data array.
        this.data.length = 0;

        // Record the min/max value for scale. 
        // Make sure their value would be replaced.
        let xmax: number = 0;
        let ymin: number = 99999;
        let ymax: number = 0;
        let zmin: number = 9999999999;
        let zmax: number = 0;

        this.countryList.forEach(element => {
            const specificCountryData: any = {};
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
                

            this.data.push(specificCountryData);
        });

        this.xAxis.domain([0, xmax]);
        this.yAxis.domain([ymin, ymax]);
        this.zAxis.domain([zmin, zmax]);
        
        d3.select("svg#GDP > g.xAxis")
            .attr("transform", "translate(0, 700)")
            .call(d3.axisBottom(this.xAxis));
        
        d3.select("svg#GDP > g.yAxis")
            .attr("transform", "translate(30, 0)")
            .call(d3.axisLeft(this.yAxis));
        
        d3.select("svg#GDP > g.Bubble")
            .selectAll(".bubble")
            .data(this.data)
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
            .on("mouseover", d => {
                d3.select("div#tooltip").transition()
                    .duration(200)
                    .style("opacity", .9);
                d3.select("div#tooltip").html(d["Code"])
                    .style("left", (d3.event.pageX - 30) + "px")
                    .style("top", (d3.event.pageY - 40) + "px");
            })
            .on("mouseout", d => {
                d3.select("div#tooltip").transition()
                    .duration(500)
                    .style("opacity", 0)
            });
    }

}
