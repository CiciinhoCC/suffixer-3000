//the stuff below only outputs the corelation between columns 0 and 1
//honestly ignore all of this, i'll just work on the web version

let fs = require('fs');
const { top3, pairingFrequency, suffixFrequency } = require('../main');

function transpose(matrix) {
    let [row] = matrix
    return row.map((value, column) => matrix.map(row => row[column]))
}

let words = [];
const data = fs.readFileSync("not-web/words.txt", "utf8");
data.split("\r\n").forEach(word => {
    words.push(word.replaceAll("́", "").split("	"));
});
words = transpose(words);

const output = top3(pairingFrequency(
    suffixFrequency(words[0], []),
    suffixFrequency(words[1], []) //change the numbers here if you want something else
))

fs.writeFile("not-web/output.txt", output, (err) => {
    if (err) {
        console.error('Error writing to file:', err);
        return;
    }
    console.log('File written successfully!');
});