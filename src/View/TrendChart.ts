import { View } from "./View";
import { ScaleLinear, svg, xml, select, path } from "d3";
import * as d3 from "d3";

export class TrendChart extends View {
    //#region Property
    private readonly height: number;
    private readonly width: number;

    private xScale: ScaleLinear<number, number>;
    private yScale: ScaleLinear<number, number>;

    private BMIArray: Array<any> = [];
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
        // Convert data structure to a format that d3.line() accepts.
        const inputArray = this.dataManager.GetBMIAllYear();

        for (let i = 0; i < inputArray.length; i++) {
            this.BMIArray[i] = [i+1975, inputArray[i]];
        }

        // Set the input range to the min/max BMI of the country. Thanks to ES6 spread syntax.
        this.yScale.domain([Math.min(...inputArray) - 0.5, Math.max(...inputArray) + 0.5]);

        // Draw X any Y axis
        d3.select("g#xScale")
            .attr("transform", "translate(0,600)")
            .call(d3.axisBottom(this.xScale));

        d3.select("g#yScale")
            .attr("transform", "translate(20, 0)")
            .call(d3.axisLeft(this.yScale));

        // Draw Line and Dot
        let line: any = d3.line()
            .x(d => this.xScale(d[0]))
            .y(d => this.yScale(d[1]));

        d3.select("g#Line > path.line")
            .datum(this.BMIArray)
            .attr("d", line);
        
        d3.select("g#Line")
            .selectAll(".circle")
            .data(this.BMIArray)
            .attr("cy", d => this.yScale(d[1]))
            .enter()
            .append("circle")
            .attr("class", "circle")
            .attr("year", d => d[0])
            .attr("r", 5)
            .attr("cx", d => this.xScale(d[0]))
            .attr("cy", d => this.yScale(d[1]));
    }
    
}