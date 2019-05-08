import { DataManager } from "./Model/DataManager";
import { WorldAtlasView } from "./View/WorldAtlasView";
// import { FeatureCollection } from "geojson";

// Fetch all data sets.
const urls: string[] = [
    "data/ne_110m_admin_0_countries.geojson",
    "data/Dataset.json"
];

Promise.all( urls.map( u => fetch(u) )).then(res =>
    Promise.all( res.map( res => res.json() )).then( res => Initialize(res) ));

// Initialize the demo after datasets have been loaded.
const dataManager = DataManager.Instance;

function Initialize(response: Array<object>)
{
    dataManager.setData(response);
    console.log(dataManager.GetBMI());
    
    // Require <svg id="WorldAtlas"></svg> in index.html.
    let worldAtlasView = new WorldAtlasView("svg#WorldAtlas", dataManager.WorldGeoPath); 
}