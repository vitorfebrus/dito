const fs = require('fs');
const readline = require('readline');
const path = require('path');
var validWords = [];
var cont = 0;

// Path to your text file
const filePath = path.join(__dirname, 'br-sem-acentos.txt')
// Create a readable stream from the file
const fileStream = fs.createReadStream(filePath);

// Create an interface for reading data line by line
const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity // Recognize all instances of CR LF ('\r\n') in input as a single line break.
});

// Read the file line by line
rl.on('line', (line) => {

    if(line.length == 5) {
        validWords.push(line.toUpperCase());
    }
    logProgress();
});

// Handle the close event
rl.on('close', () => {
    convertToJson(JSON.stringify(validWords));
});


function convertToJson(jsonString) {

    const filePath = 'output.json';

    // Write JSON string to file
    fs.writeFile(filePath, jsonString, (err) => {
        if (err) {
            console.error('Error writing file:', err);
        } else {
            console.log('File has been written');
        }
    });
}

function logProgress() {
    cont++;
    if(cont % 1000 == 0) {
        console.log(cont / 2400, '%');
    }
}