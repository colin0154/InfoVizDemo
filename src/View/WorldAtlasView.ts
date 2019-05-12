import { View } from "./View";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { GeoPath, GeoProjection, geoPath, select, scaleDiverging } from "d3";
import { DataManager } from "../Model/DataManager";

export class WorldAtlasView extends View {
    //#region Properties
    private path: GeoPath;
    private projection: GeoProjection;

    // Projection rotation and zoom controller.
    private readonly btnRotateLeft: HTMLElement;
    private readonly btnRotateRight: HTMLElement;
    private readonly btnRotateUp: HTMLElement;
    private readonly btnRotateDown: HTMLElement;
    private readonly btnZoomIn: HTMLElement;
    private readonly btnZoomOut: HTMLElement;

    // Euler angles for projection rotation, zoom for scale.
    private rotationYaw: number;
    private rotationPitch: number;
    private rotationRoll: number;
    private zoom: number;

    //#endregion

    public constructor(){
        // Hard code selector and data set.
        super();

        this.rotationYaw = 0;
        this.rotationPitch = 0;
        this.rotationRoll = 0;
        this.zoom = 200;

        // Get DOM button references.
        this.btnRotateLeft = document.getElementById("RotateLeft");
        this.btnRotateRight = document.getElementById("RotateRight");
        this.btnRotateUp = document.getElementById("RotateUp");
        this.btnRotateDown = document.getElementById("RotateDown");
        this.btnZoomIn = document.getElementById("ZoomIn");
        this.btnZoomOut = document.getElementById("ZoomOut");
        
        // Add listener to buttons controlling the rotation.
        this.btnRotateLeft.onclick = () => { this.rotate(WorldAtlasView.Rotation.Left) };
        this.btnRotateRight.onclick = () => { this.rotate(WorldAtlasView.Rotation.Right) };
        this.btnRotateUp.onclick = () => { this.rotate(WorldAtlasView.Rotation.Up) };
        this.btnRotateDown.onclick = () => { this.rotate(WorldAtlasView.Rotation.Down) };
        this.btnZoomIn.onclick = () => { this.rotate(WorldAtlasView.Rotation.ZoomIn) };
        this.btnZoomOut.onclick = () => { this.rotate(WorldAtlasView.Rotation.ZoomOut) };
        
        this.render();
    }

    protected render(): void {
        // using Orthographic Projection.
        this.projection = d3.geoOrthographic().translate([656/2, 450/2]).rotate([this.rotationYaw, this.rotationPitch, this.rotationRoll]).scale(this.zoom);
        this.path = d3.geoPath().projection(this.projection);

        let data = this.prepareData().features;

        // And draw new one.
        d3.select("g#Maps")
            .selectAll("path.country")
            .data(data)
            .attr("d", this.path)
            .enter()
            .append("path")
            .attr("class", "country")
            .attr("d", this.path)
            // On mouse click, it will emit an event with correspond country code.
            .on("click", (d: any) => console.log(d.properties.ISO_A3))
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
                this.zoom += this.zoom >= 500 ? 0 : 25;
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
        return data["properties"]["ISO_A3"];
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
