import { View } from "./View";
import { ScaleLinear } from "d3";
import * as d3 from "d3";
import { DataManager } from "../Model/DataManager";
import { Controller } from "../Controller/Controller";

export class BubbleChart extends View {
    private countryList: Array<string>;

    private xAxis: ScaleLinear<number, number>;
    private yAxis: ScaleLinear<number, number>;
    private zAxis: ScaleLinear<number, number>;

    public constructor() {
        super();

        // Maybe Map support in TypeScript is not that good?
        this.countryList = Array.from(this.dataManager.GetCountryList());

        this.xAxis = d3.scaleLinear().range([60, 926]).domain([0, 55000]).clamp(true);
        this.yAxis = d3.scaleLinear().range([558, 0]);
        this.zAxis = d3.scaleLinear().range([3, 40]).domain([0, 1400000]);
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");
        eventTarget.addEventListener("StateChanged", e => this.render());
    }

    protected render(): void {
        if (!Controller.CurrentPageOnGDP) 
            return;
            
        let data: Array<any> = this.prepareData();
        this.setYAxisDomain();

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
            .attr("class", (d: any) => {
                if (d["Code"] == this.dataManager.SelectedCountry)
                    return "bubble active";
                return "bubble";
            })
            .on("mouseover", d => this.mouseOver(d))
            .on("mouseout", d => this.mouseOut())
            .on("click", (d: any) => this.dataManager.ChangeCountry(d["Code"]))
    }

    protected prepareData(): Array<any> {
        let data: Array<any> = [];

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

            data.push(specificCountryData);
        });
        return data;
    }

    private setYAxisDomain(): void {
        let yAixdomain: Array<number>;

        switch (this.dataManager.SelectedField) {
            case DataManager.Field.Mean:
                yAixdomain = [19, 31];
                break;
            case DataManager.Field.Underweight:
                yAixdomain = [0, 26];
                break;
            case DataManager.Field.Obesity:
                yAixdomain = [0, 45];
                break;
            case DataManager.Field.Severe:
                yAixdomain = [0, 18];
                break;
            case DataManager.Field.Morbid:
                yAixdomain = [0, 9];
                break;
        }

        this.yAxis.domain(yAixdomain).clamp(true);
    }

    protected mouseOverContent(data: any): string {
        let html: string =
        "<p>" + this.dataManager.GetCountryName(data["Code"]) +"</p>"
        + "<p>患病率：" + data["Field"] + "%"
        + "<p>GDP：" + data["GDPPerCapita"] + "国际元</p>";

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
