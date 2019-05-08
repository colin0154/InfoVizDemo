let fs = require("fs");

//#region import unhandled json data.
const bmiMale = JSON.parse(fs.readFileSync("src/bmi_male.json", "utf-8"));
const bmiFemale = JSON.parse(fs.readFileSync("src/bmi_female.json", "utf-8"));
const gdp = JSON.parse(fs.readFileSync("src/gdp_per_capita.json", "utf-8"));
const populationFemale = JSON.parse(fs.readFileSync("src/population_female.json", "utf-8"));
const populationTotal = JSON.parse(fs.readFileSync("src/population.json", "utf-8"));
//#endregion

//#region Insert all data sets into a temporary map.
const tempMap = new Map();

bmiMale.forEach(element => {
    // M for male, F for female.
    let property = {
        Name: "",
        MeanM: [],
        MeanF: [],
        UnderweightM: [],
        UnderweightF: [],
        ObesityM: [],
        ObesityF: [],
        SevereM: [],
        SevereF: [],
        MorbidM: [],
        MorbidF: [],
        GDPPerCapita: [],
        PopulationTotal: [],
        PopulationF: []
    };

    // Initial the key/value pair, the map property for the first time.
    if (tempMap.has(element.ISO)) {
        property = tempMap.get(element.ISO)
    } else {
        tempMap.set(element.ISO, property)
    }

    // "property" in map is a reference type, so following line will work.
    property.MeanM[element.Year - 1975] = element.Mean;
    property.UnderweightM[element.Year - 1975] = element.Underweight;
    property.ObesityM[element.Year - 1975] = element.Obesity;
    property.SevereM[element.Year - 1975] = element.Severe;
    property.MorbidM[element.Year - 1975] = element.Morbid;
});

bmiFemale.forEach(element => {
    let property = tempMap.get(element.ISO)

    property.MeanF[element.Year - 1975] = element.Mean;
    property.UnderweightF[element.Year - 1975] = element.Underweight;
    property.ObesityF[element.Year - 1975] = element.Obesity;
    property.SevereF[element.Year - 1975] = element.Severe;
    property.MorbidF[element.Year - 1975] = element.Morbid;
});

populationTotal.forEach(element => {
    let property = tempMap.get(element.Code)

    // Countries and regions without BMI data will be skipped.
    if (property == null)
        return;

    property.Name = element.Name;

    for (i = 1975; i <= 2016; i++) {
        property.PopulationTotal.push(element[i]);
    }
})

populationFemale.forEach(element => {
    let property = tempMap.get(element.Code)

    if (property == null)
        return;

    for (i = 1975; i <= 2016; i++) {
        property.PopulationF.push(element[i]);
    }
});

gdp.forEach(element => {
    let property = tempMap.get(element.Code)

    if (property == null)
        return;

    // GDP(PPP) data starts at 1990.
    for (i = 1990; i <= 2016; i++) {
        property.GDPPerCapita.push(element[i]);
    }
});
//#endregion


//#region Output Map
const outputMap = new Map();

for (var [code, property] of tempMap) {
    const outputProperty = {
        Name: property.Name,
        Mean: handleBMI(property.MeanM, property.MeanF, property.PopulationTotal, property.PopulationF, false),
        Underweight: handleBMI(property.UnderweightM, property.UnderweightF, property.PopulationTotal, property.PopulationF),
        Obesity: handleBMI(property.ObesityM, property.ObesityF, property.PopulationTotal, property.PopulationF),
        Severe: handleBMI(property.SevereM, property.SevereF, property.PopulationTotal, property.PopulationF),
        Morbid: handleBMI(property.MorbidM, property.MorbidF, property.PopulationTotal, property.PopulationF),
        GDPPerCapita: handleGDP(property.GDPPerCapita),
        Population: handlePopulation(property.PopulationTotal)
    }
    outputMap.set(code, outputProperty);
}

//#region Calculation before output.
function handleBMI(arrayM, arrayF, total, female, isPercentage = true) {
    const outArray = [];
    // Skip if no population data. Just in case.
    for (i = 0; i <= 41; i++) {

        const maleBMI = arrayM[i];
        const femaleBMI = arrayF[i];
        const femaleP = female[i] / total[i];
        const maleP = 1 - femaleP;

        const combineBMI = maleBMI * maleP + femaleBMI * femaleP

        if (isPercentage) {
            // Round to percentage with one digit.
            outArray[i] = Math.round(combineBMI*1000)/10;
        } else {
            outArray[i] = Math.round(combineBMI*10)/10;
        }
    }
    return outArray;
}

function handleGDP(array) {
    const outArray = [];
    // Data starts at 1990.
    for (i = 0; i <= 26; i++) {
        outArray[i] = Math.round(array[i]);
    }
    return outArray;
}

function handlePopulation(array) {
    const outArray = [];
    // unit: Thousand
    for (i = 0; i <= 41; i++) {
        outArray[i] = Math.round(array[i]/1000);
    }
    return outArray;
}
//#endregion
//#endregion

// ES6 can't stringify map. Convert map to primitive first.
let outputJson = JSON.stringify(Array.from(outputMap));

fs.writeFile("dist/Dataset.json", outputJson, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log("Saved.");
})
