let fs = require('fs');

let GDPJson = JSON.parse(fs.readFileSync("GDP.json", "utf-8"));
let PopulationJson = JSON.parse(fs.readFileSync("Population.json", "utf-8"));

let nameMaps = {};
let perCapitaMaps = {};

PopulationJson.forEach(element => {
    // Get GDP reference of this country.
    const countryCode = element.Code;
    const GDPRef = GDPJson[countryCode];

    // Map the country name.
    nameMaps[countryCode] = element.Name;

    // Initialize the sub object.
    perCapitaMaps[countryCode] = {
        PerCapita: []
    }

    for (let i = 1975; i <= 2016; i++)
    {
        // Calculate per-capita GDP.
        let currentYearGDP = GDPRef[i];
        let perCapita = null;

        // Some countries don't have GDP data in specific year.
        // Round the result.
        if (currentYearGDP != null) {
            perCapita = currentYearGDP / element[i];
            perCapita = Math.round(perCapita);
        }

        perCapitaMaps[countryCode].PerCapita.push(perCapita);
    }
});

// Serialize objects and write to local files.
let outputNameMaps = JSON.stringify(nameMaps);
let outputPerCapita = JSON.stringify(perCapitaMaps)

fs.writeFile("NameCountryCode.json", outputNameMaps, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log("Saved.");
})

fs.writeFile("perCapita.json", outputPerCapita, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log("Saved.");
})

