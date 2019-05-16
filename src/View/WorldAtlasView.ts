import { View } from "./View";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { GeoPath, GeoProjection, geoPath, select, scaleDiverging } from "d3";
import { DataManager } from "../Model/DataManager";
import { Controller } from "../Controller/Controller";

export class WorldAtlasView extends View {
    //#region Properties
    private path: GeoPath;
    private projection: GeoProjection;

    // Euler angles for projection rotation, zoom for scale.
    private rotationYaw: number;
    private rotationPitch: number;
    private rotationRoll: number;
    private zoom: number;

    //#endregion

    public constructor(){
        super();

        this.rotationYaw = 0;
        this.rotationPitch = 0;
        this.rotationRoll = 0;
        this.zoom = 200;     
    }

    protected addListener(): void {
        let eventTarget = document.getElementById("EventTarget");
        eventTarget.addEventListener("StateChanged", e => this.render());

        // Rotation Control
        document.getElementById("RotateLeft").onclick = () => { this.rotate(WorldAtlasView.Rotation.Left) };
        document.getElementById("RotateRight").onclick = () => { this.rotate(WorldAtlasView.Rotation.Right) };
        document.getElementById("RotateUp").onclick = () => { this.rotate(WorldAtlasView.Rotation.Up) };
        document.getElementById("RotateDown").onclick = () => { this.rotate(WorldAtlasView.Rotation.Down) };
        document.getElementById("ZoomIn").onclick = () => { this.rotate(WorldAtlasView.Rotation.ZoomIn) };
        document.getElementById("ZoomOut").onclick = () => { this.rotate(WorldAtlasView.Rotation.ZoomOut) };
    }

    protected render(): void {
        if (Controller.CurrentPageOnGDP) 
            return;

        // using Orthographic Projection.
        this.projection = d3.geoOrthographic().translate([656/2, 450/2]).rotate([this.rotationYaw, this.rotationPitch, this.rotationRoll]).scale(this.zoom);
        this.path = d3.geoPath().projection(this.projection);

        let data = this.prepareData().features;

        // And draw new one.
        d3.select("g#Maps")
            .selectAll("path.country")
            .data(data)
            .attr("d", this.path)
            .attr("class", (d: any) => {
                if (d.properties.ISO_A3 == this.dataManager.SelectedCountry)
                    return "country active";
                return "country";
            })
            .enter()
            .append("path")
            .attr("class", (d: any) => {
                if (d.properties.ISO_A3 == this.dataManager.SelectedCountry)
                    return "country active";
                return "country";
            })
            .attr("d", this.path)
            // On mouse click, it will emit an event with correspond country code.
            .on("click", (d: any) => this.changeCountry(d.properties.ISO_A3))
            .on("mouseover", d => this.mouseOver(d))
            .on("mouseout", d => this.mouseOut());

        // Update the size of Ocean
        d3.select("circle#Ocean")
            .attr("r", this.zoom);
    }

    protected prepareData(): any {
        return this.dataManager.GeoJson;
    }

    private rotate(direction: WorldAtlasView.Rotation): void {
        // Compensate for scale, will rotate a smaller degree when zoom in.
        // scaleFactor can't be more than 1;
        const scaleFactor: number = this.zoom <= 250 ? 1 : 150 / this.zoom;
        const finalRotationYaw = 30 * scaleFactor;
        const finalRotationPitch = 15 * scaleFactor;

        switch(direction){
            case WorldAtlasView.Rotation.Left:
                // I don't want to make the degree larger than 180.
                this.rotationYaw -= this.rotationYaw <= -180 ? -(360 - finalRotationYaw) : finalRotationYaw;
                break;
            case WorldAtlasView.Rotation.Right:
                this.rotationYaw += this.rotationYaw >= 180 ? -(360 - finalRotationYaw) : finalRotationYaw;
                break;
            case WorldAtlasView.Rotation.Up:
                this.rotationPitch += this.rotationPitch >= 60 ? 0 : finalRotationPitch;
                break;
            case WorldAtlasView.Rotation.Down:
                this.rotationPitch -= this.rotationPitch <= -60 ? 0 : finalRotationPitch;
                break;
            case WorldAtlasView.Rotation.ZoomIn:
                this.zoom += this.zoom >= 600 ? 0 : 25;
                break;
            case WorldAtlasView.Rotation.ZoomOut:
                this.zoom -= this.zoom <= 200 ? 0 : 25;
                break;
            default:
                return;
        }
        
        this.render();
    }

    protected mouseOverContent(data: any): string {
        let countryCode = data["properties"]["ISO_A3"];
        let countryName = this.dataManager.GetCountryName(countryCode);

        if (!countryName) {
            return "<p>缺少该国家或地区的数据</p>";
        }

        let fieldName = "患病率: ";
        if (this.dataManager.SelectedField == DataManager.Field.Mean){
            fieldName = "BMI均值: ";
        }
        
        let html: string ="<p>" + countryName +"</p> \n"
        + "<p>" +  fieldName + this.dataManager.GetFieldValue(countryCode) + "</p>";
        
        return html;
    }

    private changeCountry(code: string) {
        this.dataManager.ChangeCountry(code);
    }
}

//#region Enums
// This is a workaround to use enum in a Typscript Class.
export namespace WorldAtlasView {
    export enum Rotation {
        Left,
        Right,
        Up,
        Down,
        ZoomIn,
        ZoomOut
    }
}
//#endregion
