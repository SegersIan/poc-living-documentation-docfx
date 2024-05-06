const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

try {
    const directoryPath = '../api';
    const destinationFile =  path.join("../", 'all-classes.json');
    const yamlFiles = listFiles(directoryPath, '.yml');
    const fileContents = yamlFiles
        .map(file => parseYamlFile(file).items)
        .reduce((acc, x) => acc.concat(x), []);
        
    saveJSONFile(destinationFile, JSON.stringify({
        _classes: {
            "**.*" : fileContents
        }
    }, null, 4))
} catch (e) {
    console.error(e);
}

function listFiles(directory, extension, excludeFiles = ["toc.yml"]) {
    return fs.readdirSync(directory)
             .filter(file => path.extname(file).toLowerCase() === extension)
             .filter(file => !excludeFiles.includes(file))
             .map(file => path.join(directory, file));
}

function parseYamlFile(filePath) {
    try {
        console.log(`Loading file: ${filePath}`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const content =  yaml.load(fileContents);
        return content;
    } catch (e) {
        console.error(`Failed to parse ${filePath}: ${e}`);
        return {items: []}; 
    }
}

function saveJSONFile(filePath, data){
    fs.writeFileSync(filePath, data);
}