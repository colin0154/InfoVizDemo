let fs = require('fs');

let obj = JSON.parse(fs.readFileSync('GDP.json', "utf8"));

let output = {};

obj.forEach(element => {
    const code = element.Code;
    
    delete element.Code;

    output[code.toString()] = element;
});

console.log(output.CHN);