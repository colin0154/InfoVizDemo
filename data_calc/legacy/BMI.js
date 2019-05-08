let fs = require('fs');

// I CHANGED THE FILE NAME!
let obj = JSON.parse(fs.readFileSync('source.json', "utf8"));

let myObject = {};

obj.forEach(element => {
    // Create new key-value pair if country doesn't exist in output object.
    if (myObject[element.ISO] == null) {
        myObject[element.ISO] = {
            Mean: [],
            Underweight: [],
            Obesity: [],
            Severe: [],
            Morbid: []
        };
    }

    // Convert Raw data to percentage, then round to one digit.
    // Math.round can only round to integer. Feel bad.
    function calc(data, isPercentage = true) {
        if (isPercentage) {
            return Math.round(data * 1000) / 10;
        }
        return Math.round(data * 10) / 10;
    }

    const targetObj = myObject[element.ISO]

    // Add correspond per-year data into the output obj.
    targetObj["Mean"].push(calc(element.Mean, false));
    targetObj["Underweight"].push(calc(element.Underweight));
    targetObj["Obesity"].push(calc(element.Obesity));
    targetObj["Severe"].push(calc(element.Severe));
    targetObj["Morbid"].push(calc(element.Morbid));
});

let outputJson = JSON.stringify(myObject);

// I ALSO CHANGED THIS FILE NAME!
fs.writeFile("output.json", outputJson, "utf8", (err) => {
    if (err) {
        return console.log(err);
    }
    
    console.log("Saved.");
})
