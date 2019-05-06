import { DataManager } from "./Model/DataManager";
import { WorldAtlasView } from "./View/WorldAtlasView";
// import { FeatureCollection } from "geojson";

const _worldAtlasUrl: string = "data/ne_110m_admin_0_countries.geojson";

const _dataManager = DataManager.Instance;

fetch(_worldAtlasUrl)
    .then(res => res.json())
    .then(json => Initialize(json));


function Initialize(json: any)
{
    _dataManager.WorldAtlas = json;
    
    // Require <svg id="WorldAtlas"></svg> in index.html.
    let worldAtlasView = new WorldAtlasView("svg#WorldAtlas", _dataManager.WorldAtlas); 
}

