import { View } from "./View";
import { ScaleLinear } from "d3";
import * as d3 from "d3";
import { DataManager } from "../Model/DataManager";
import { Controller } from "../Controller/Controller";

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
        
        this.xAxis = d3.scaleLinear().domain([1973, 2020]).range([40, this.width-30]);
        this.yAxis = d3.scaleLinear().range([this.height-30, 30]);
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");
        eventTarget.addEventListener("StateChanged", e => this.render());
    }
    
    protected render(): void {
        if (Controller.CurrentPageOnGDP) 
            return;
            
        let data = this.prepareData();

        // Line Generator
        let line: any = d3.line()
            .x(d => this.xAxis(d[0]))
            .y(d => this.yAxis(d[1]))
            .curve(d3.curveMonotoneX);

        // Draw X any Y axis
        d3.select("svg#Trend > g.xAxis")
            .attr("transform", "translate(0, 180)")
            .call(d3.axisBottom(this.xAxis));

        d3.select("svg#Trend > g.yAxis")
            .attr("transform", "translate(40, 0)")
            .call(d3.axisLeft(this.yAxis));
            // .call(d3.axisLeft(this.yAxis).tickFormat(d3.format("d")));
        
        // Draw Line and Dot

        d3.select("svg#Trend > g.Line > path")
            .datum(data)
            .attr("d", line);
        
        d3.select("svg#Trend > g.Line")
            .selectAll(".circle")
            .data(data)
            .attr("cy", d => this.yAxis(d[1]))
            .attr("class", (d: any) => {
                if (d[0] == this.dataManager.SelectedYear)
                    return "circle active";
                return "circle";
            })
            .enter()
            .append("circle")
                .attr("class", (d: any) => {
                    if (d[0] == this.dataManager.SelectedYear)
                        return "circle active";
                    return "circle";
                })
                .attr("year", d => d[0])
                .attr("r", 5)
                .attr("cx", d => this.xAxis(d[0]))
                .attr("cy", d => this.yAxis(d[1]))
                .on("mouseover", d => this.mouseOver(d))
                .on("mouseout", d => this.mouseOut());
        }
    
    protected prepareData(): Array<any> {
        // Convert data structure to a format that d3.line() accepts.
        let inputArray = this.dataManager.GetFieldValueAllYear();
        let outputArray = [];

        for (let i = 0; i < inputArray.length; i++) {
            outputArray[i] = [i+1975, inputArray[i]];
        }

        // Set the input range to the min/max BMI of the country. Thanks to ES6 spread syntax.
        let delta = Math.max(...inputArray) - Math.min(...inputArray);
        this.yAxis.domain([Math.min(...inputArray) - delta*0.1, Math.max(...inputArray) + delta*0.1]);

        return outputArray;
    }

    protected mouseOverContent(data: any): string {
        let fieldName = "患病率: ";

        if (this.dataManager.SelectedField == DataManager.Field.Mean){
            fieldName = "BMI均值: ";
        }
        
        let html: string ="<p>" + data["0"] +"年</p> \n"
        + "<p>" +  fieldName + data[1] + "</p>";
        
        return html;
    }
}
