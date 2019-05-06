import { View } from "./View";
import * as d3 from "d3";
import { FeatureCollection } from "geojson";
import { GeoPath, GeoProjection, geoPath, select } from "d3";

export class WorldAtlasView extends View {
    // _selection inherited from View class.
    // _data inherited from View class.
    private _path: GeoPath;
    private _projection: GeoProjection;

    // Projection rotation and zoom controller.
    private readonly _buttonRotateLeft: HTMLElement = document.getElementById("RotateLeft");
    private readonly _buttonRotateRight: HTMLElement = document.getElementById("RotateRight");
    private readonly _buttonRotateUp: HTMLElement = document.getElementById("RotateUp");
    private readonly _buttonRotateDown: HTMLElement = document.getElementById("RotateDown");
    private readonly _buttonZoomIn: HTMLElement = document.getElementById("ZoomIn");
    private readonly _buttonZoomOut: HTMLElement = document.getElementById("ZoomOut");

    // Euler angles for projection rotation, zoom for scale.
    private _rotationYaw: number = 0;
    private _rotationPitch: number = 0;
    private _rotationRoll: number = 0;
    private _zoom: number = 250;

    public constructor(selector: string, dataSet: FeatureCollection){
        // Hard code selector and data set.
        super(selector, dataSet);
        
        // Add listener to buttons controlling the rotation.
        this._buttonRotateLeft.onclick = () => { this.rotate("LEFT") };
        this._buttonRotateRight.onclick = () => { this.rotate("RIGHT") };
        this._buttonRotateUp.onclick = () => { this.rotate("UP") };
        this._buttonRotateDown.onclick = () => { this.rotate("DOWN") };
        this._buttonZoomIn.onclick = () => { this.rotate("IN") };
        this._buttonZoomOut.onclick = () => { this.rotate("OUT") };
        
        this.render();
    }

    protected render(): void {
        // using Orthographic Projection.
        this._projection = d3.geoOrthographic().translate([640, 360]).rotate([this._rotationYaw, this._rotationPitch, this._rotationRoll]).scale(this._zoom);
        this._path = d3.geoPath().projection(this._projection);

        // Graticule definition.
        const graticule = d3.geoGraticule().step([30, 30]);
        
        // Erase existing map.
        // this._selection.selectAll("path").remove();

        // And draw new one.
        this._selection.select("g#Maps")
                        .selectAll("path.country")
                        .data(this._data.features)
                        .attr("d", this._path)
                        .enter()
                        .append("path")
                        .attr("class", "country")
                        .attr("d", this._path)
                        // On mouse click, it will emit an event with correspond country code.
                        .on("click", (d: any) => console.log(d.properties.ISO_A3));   

        // Draw graticule.
        this._selection.select("g#Graticule")
                        .selectAll("path.graticule")
                        .data(graticule.lines())
                        .attr("d", this._path)
                        .enter()
                        .append("path")
                        .attr("class", "graticule")
                        .attr("d", this._path);
    }

    private rotate(direction: string): void {
        // Compensate for scale, will rotate a smaller degree when zoom in.
        // scaleFactor can't be more than 1;
        const scaleFactor: number = this._zoom <= 250 ? 1 : 150 / this._zoom;
        const finalRotationYaw = 30 * scaleFactor;
        const finalRotationPitch = 15 * scaleFactor;

        switch(direction){
            case "LEFT":
                // I don't want to make the degree larger than 180.
                this._rotationYaw -= this._rotationYaw <= -180 ? -(360 - finalRotationYaw) : finalRotationYaw;
                break;
            case "RIGHT":
                this._rotationYaw += this._rotationYaw >= 180 ? -(360 - finalRotationYaw) : finalRotationYaw;
                break;
            case "UP":
                this._rotationPitch += this._rotationPitch >= 60 ? 0 : finalRotationPitch;
                break;
            case "DOWN":
                this._rotationPitch -= this._rotationPitch <= -60 ? 0 : finalRotationPitch;
                break;
            case "IN":
                this._zoom += this._zoom >= 700 ? 0 : 25;
                break;
            case "OUT":
                this._zoom -= this._zoom <= 150 ? 0 : 25;
                break;
            default:
                return;
        }
        
        this.render();
    }
}
