// Stylesheet embedded in JavaScript, will be injected in run-time.
require("./Sass/style.scss");

import { DataManager } from "./Model/DataManager";
import { WorldAtlasView } from "./View/WorldAtlasView";
import { TrendChart } from "./View/TrendChart";
import { Controller } from "./Controller/Controller";
import { BubbleChart } from "./View/BubbleChart";
import { InfoSection } from "./View/InfoSection";


// Fetch all data sets.
const urls: string[] = [
    "data/ne_110m_admin_0_countries.geojson",
    "data/Dataset.json"
];

Promise.all( urls.map( u => fetch(u) )).then(res =>
    Promise.all( res.map( res => res.json() )).then( res => Initialize(res) ));

// Initialize the demo after datasets have been loaded.
let dataManager = DataManager.Instance;

function Initialize(response: Array<object>)
{
    dataManager.Initialize(response);
    let controller = new Controller();

    // Require <svg id="WorldAtlas"></svg> in index.html.
    let worldAtlasView = new WorldAtlasView(); 
    let trendChart = new TrendChart();
    let bubbleChart = new BubbleChart();
    let infoSection = new InfoSection();

    dataManager.ChangeYear(2001);
}
