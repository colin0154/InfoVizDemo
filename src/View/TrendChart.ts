import { View } from "./View";
import { ScaleLinear, svg, xml, select, path } from "d3";
import * as d3 from "d3";

export class TrendChart extends View {
    //#region Property
    private readonly height: number;
    private readonly width: number;

    private xScale: ScaleLinear<number, number>;
    private yScale: ScaleLinear<number, number>;

    private inputArray: Array<number>;
    //#endregion

    public constructor() {
        super();

        this.width = Number(d3.select("svg#Trend").attr("width"));
        this.height = Number(d3.select("svg#Trend").attr("height"));
        
        d3.select("svg#Trend");

        this.xScale = d3.scaleLinear().domain([1974, 2017]).range([0, this.width]);
        this.yScale = d3.scaleLinear().range([this.height, 0]);

        this.render();
    }
    
    protected render(): void {
        this.inputArray = this.dataManager.GetBMIAllYear();

        let outputArray: Array<any> = [];

        for (let i = 0; i < this.inputArray.length; i++) {
            outputArray[i] = [i+1975, this.inputArray[i]];
        }

        // Set the input range to the min/max BMI of the country. Thanks to ES6 spread syntax.
        this.yScale.domain([Math.min(...this.inputArray)-1, Math.max(...this.inputArray)+1]);

        d3.select("g#xScale")
            .attr("transform", "translate(0,600)")
            .call(d3.axisBottom(this.xScale));

        d3.select("g#yScale")
            .attr("transform", "translate(20, 0)")
            .call(d3.axisLeft(this.yScale));

        let line: any = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]));

        // I have no idea why it has to be [outputArray]. Ask d3.js
        d3.select("g#Line")
            .append("path")
            .data([outputArray])
            .attr("class", "line")
            .attr("d", line);
        
        d3.select("g#Line")
            .selectAll(".circle")
            .data(outputArray)
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("year", d => d[0])
            .attr("r", 5)
            .attr("cx", d => this.xScale(d[0]))
            .attr("cy", d => this.yScale(d[1]));
    }
    
}