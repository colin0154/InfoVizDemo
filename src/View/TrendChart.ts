import { View } from "./View";
import { ScaleLinear, svg, xml, select, path } from "d3";
import * as d3 from "d3";

export class TrendChart extends View {
    //#region Property
    private readonly height: number;
    private readonly width: number;

    private xAxis: ScaleLinear<number, number>;
    private yAxis: ScaleLinear<number, number>;
    //#endregion

    public constructor() {
        super();

        this.width = Number(d3.select("svg#Trend").attr("width"));
        this.height = Number(d3.select("svg#Trend").attr("height"));
        
        this.xAxis = d3.scaleLinear().domain([1973, 2020]).range([30, this.width-20]);
        this.yAxis = d3.scaleLinear().range([this.height-20, 20]);

        this.render();
    }
    
    protected render(): void {
        let data = this.prepareData();

        // Line Generator
        let line: any = d3.line()
            .x(d => this.xAxis(d[0]))
            .y(d => this.yAxis(d[1]));

        // Draw X any Y axis
        d3.select("svg#Trend > g.xAxis")
            .attr("transform", "translate(0, 234)")
            .call(d3.axisBottom(this.xAxis));

        d3.select("svg#Trend > g.yAxis")
            .attr("transform", "translate(30, 0)")
            .call(d3.axisLeft(this.yAxis));
        
        // Draw Line and Dot

        d3.select("svg#Trend > g.Line > path")
            .datum(data)
            .attr("d", line);
        
        d3.select("svg#Trend > g.Line")
            .selectAll(".circle")
            .data(data)
            .attr("cy", d => this.yAxis(d[1]))
            .enter()
            .append("circle")
                .attr("class", "circle")
                .attr("year", d => d[0])
                .attr("r", 5)
                .attr("cx", d => this.xAxis(d[0]))
                .attr("cy", d => this.yAxis(d[1]))
                .on("mouseover", d => this.mouseOver(d))
                .on("mouseout", d => this.mouseOut());
        }
    
    protected prepareData(): Array<any> {
        // Convert data structure to a format that d3.line() accepts.
        let inputArray = this.dataManager.GetFieldAllYear();
        let outputArray = [];

        for (let i = 0; i < inputArray.length; i++) {
            outputArray[i] = [i+1975, inputArray[i]];
        }

        // Set the input range to the min/max BMI of the country. Thanks to ES6 spread syntax.
        this.yAxis.domain([Math.min(...inputArray) - 0.5, Math.max(...inputArray) + 0.5]);

        return outputArray;
    }

    protected mouseOverContent(data: any): string {
        return data[0];
    }
}
