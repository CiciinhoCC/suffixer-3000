function findSuffix(word1, word2, extras = 0) {
    let i = word1.length;
    let j = word2.length;

    while (i > 0 && j > 0 && word1[i - 1] === word2[j - 1]) {
        i--;
        j--;
    }
    i -= extras;

    return word1.slice(i);
}

//RANDOM FUNCTIONS
function sortByLength(array) {
    return array.sort((x, y) => y.length - x.length);
}
function longest(arr) {
    let lgth = 0;
    let longest;
    for (let i = 0; i < arr.length; i++) {
        if (arr[i].length > lgth) {
            lgth = arr[i].length;
            longest = arr[i];
        }
    }
    return longest;
}
function purge(arr, purge) {
    purgedArr = [];
    for (let i = 0; i < arr.length; i++) {
        const elem = arr[i];
        if (!elem.startsWith(purge)) {
            purgedArr.push(elem);
        }
    }
    return purgedArr;
}
// function updateLine(txt) {
//     process.stdout.clearLine(0);
//     process.stdout.cursorTo(0);
//     process.stdout.write(txt);
// }
String.prototype.isIn = (str) => {
    return findSuffix(this, str) == this;
}
function transpose(matrix) {
    let [row] = matrix
    return row.map((value, column) => matrix.map(row => row[column]))
}

//GET A LIST OF ALL POSSIBLE ENDINGS
//- pick a word
//- continue picking words until five of them match the ending
//- stop after all the words are tried
//- add the ending to the list. if failed, add the whole word to another list
//- pick another word
//- check the endings on the list
//- if it's there, add it again
//- if it isn't there, do the word checking list again

const loadingThing = ["|", "/", "-", "\\"];

function findAllSuffixes(list, known = [], tooSmall = 0) {
    let suffixes = known;
    console.time("Time (findAllSuffixes)");
    let diacritics = ['͡', '́', 'ː'];

    for (let i = 0; i < list.length; i++) {
        const pivotWord = list[i];
        let suffixGroup = [];
        let suffixGroupNEO = [];
        let foundIt = false;
        const oldSuffixes = suffixes;

        // updateLine(`${i}/${list.length}: ${pivotWord}`);

        try {
            for (let j = 0; j < oldSuffixes.length && !foundIt; j++) {
                const checkSuffix = oldSuffixes[j];
                let suffix = findSuffix(pivotWord, checkSuffix);
                if (diacritics.includes(suffix[0])) { suffix = findSuffix(pivotWord, checkSuffix, 1); }
                if (suffix !== "" && suffix.length > tooSmall) {
                    if (!suffixes.includes(suffix)) {
                        suffixes.push(suffix);
                        if (checkSuffix.startsWith("*")) {
                            suffixes = purge(suffixes, checkSuffix);
                        }
                    }
                    foundIt = true;
                }
            }
            for (let j = 0; j < list.length && !foundIt; j++) {
                if (j == i) { j++ }
                const checkWord = list[j];
                let suffix = findSuffix(pivotWord, checkWord);
                let suffixNEO = findSuffix(pivotWord, checkWord, 1);
                if (diacritics.includes(suffix[0])) { suffix = findSuffix(pivotWord, checkWord, 1); }
                if (diacritics.includes(suffixNEO[0])) { suffixNEO = findSuffix(pivotWord, checkWord, 2); }

                if (suffix !== "") {
                    // if (!suffixGroup.includes(suffix)) {
                    //     suffixGroup.push(suffix);
                    // }
                    // if (!suffixGroupNEO.includes(suffixNEO)) {
                    //     suffixGroupNEO.push(suffixNEO);
                    // }
                    suffixGroup.push(suffix);
                    suffixGroupNEO.push(suffixNEO);
                }
                // if (suffixGroup.length >= 10) {
                //     suffixes.push(longest(suffixGroup));
                //     foundIt = true;
                // }
                // if (suffixGroupNEO.length >= 10) {
                //     suffixes.push(longest(suffixGroupNEO));
                //     foundIt = true;
                // }
            }
            if (!foundIt) {
                if (suffixGroup.length > 1) {
                    suffixes.push(longest(suffixGroup));
                }
                if (suffixGroupNEO.length > 1) {
                    suffixes.push(longest(suffixGroupNEO));
                }
                else { suffixes.push("*" + pivotWord); }
            }
            suffixes = [...new Set(sortByLength(suffixes))];
        }
        catch (error) {
            console.log(`----------------\nERROR \nWORD: ${pivotWord}\n----------------`);
            console.log(error);
            suffixes.push("*" + pivotWord);
        }
    }

    let frequencies = new Array(suffixes.length).fill(0);
    for (let i = 0; i < list.length; i++) {
        const word = list[i];
        let matches = [];
        for (let j = 0; j < suffixes.length; j++) {
            const suffix = suffixes[j];
            if (findSuffix(word, suffix) == suffix) {
                matches.push([suffix, j]);
            }
        }
        matches.sort((a, b) => b[0].length - a[0].length);
        if (matches[0] !== undefined) {
            frequencies[matches[0][1]]++;
        }
    }
    console.log(frequencies);
    let purifiedSuffixes = []
    for (let i = 0; i < suffixes.length; i++) {
        const suffix = suffixes[i];
        if (frequencies[i] > 1) {
            purifiedSuffixes.push(suffix);
        }
    }

    suffixes = purifiedSuffixes;
    // updateLine("Done :D \n")
    console.timeEnd("Time (findAllSuffixes)");
    return [...new Set(sortByLength(purge(suffixes, "*")))];
}

function suffixFrequency(list, known, readable = false) {
    console.time("Time (suffixFrequency)");
    let suffixes = findAllSuffixes(list, known, 1);
    let matches = [];
    let frequencies = [];
    let noMatch = [];

    for (let i = 0; i < list.length; i++) {
        const word = list[i];
        let matchAll = [];
        // updateLine(`${i}/${list.length}: ${word}`);
        for (let j = 0; j < suffixes.length; j++) {
            const suffix = suffixes[j];
            const mat = findSuffix(word, suffix);
            if (mat == suffix) {
                matchAll.push(j);
            }
        }

        matchOrdered = matchAll.sort((x, y) => suffixes[y].length - suffixes[x].length);
        if (matchOrdered.length > 0) {
            let result = matchOrdered[0];
            matches.push(result);
            if (frequencies[result] === undefined) { frequencies[result] = 1; }
            else { frequencies[result]++; }
        }

        else {
            noMatch.push(word);
            matches.push(null);
        }

    }

    let suffixPlusFrequency = []
    for (let i = 0; i < suffixes.length; i++) {
        const suffix = suffixes[i];
        const frequency = frequencies[i];

        suffixPlusFrequency.push([suffix, frequency]);
    }
    let spfSorted = suffixPlusFrequency.sort((x, y) => y[1] - x[1]);

    const totalMatches = frequencies.reduce((partialSum, a) => partialSum + a, 0);
    let percentages = `Total matches: ${totalMatches}\nNo matches: ${noMatch.length}\n`;

    for (let i = 0; i < spfSorted.length; i++) {
        const suffix = spfSorted[i][0];
        const frequency = spfSorted[i][1];

        if (frequency > 1) { percentages += `${suffix}: ${frequency}\n`; }
    }
    if (noMatch.length > 0) { percentages += `No matches: ${JSON.stringify(noMatch)}\n`; }

    // updateLine("Done :D\n");
    console.timeEnd("Time (suffixFrequency)");
    if (readable) { return percentages; }
    return [matches, suffixes, frequencies];
}

//THE ACTUAL THING
function sheetify(table) {
    let sheet = "";

    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        sheet += row.join("	") + "\n";
    }

    return sheet;
}

function matchTable(results) {
    let [table, suf1, suf2, frq1, frq2] = results;
    let sheet = [["", ""].concat(suf2), ["", ""].concat(frq2)];
    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        let rowSheet = [suf1[i], frq1[i]].concat(row);
        sheet.push(rowSheet);
    }
    return sheetify(sheet);
}

function top3(results) {
    let [table, suf1, suf2, frq1, frq2] = results;
    let top3list = [];
    for (let i = 0; i < table.length; i++) {
        const row = table[i];
        let top3row = [];
        for (let j = 0; j < row.length; j++) {
            let percentage = row[j] > 0 ? suf2[j] + " (" + Math.round((row[j] / frq1[i]) * 100) + "%)" : ""
            top3row.push([row[j], percentage]);
        }
        top3row.sort((a, b) => b[0] - a[0]);
        top3row = [suf1[i], frq1[i]].concat(top3row.map((x) => { return x[1] }))
        top3list.push(top3row);
    }
    top3list.sort((a, b) => b[1] - a[1]);
    console.log(top3list);
    return sheetify(top3list);
}

function pairingFrequency(case1, case2) {
    const [matches1, suffixes1, frequencies1] = case1;
    const [matches2, suffixes2, frequencies2] = case2;
    let matchTable = [];

    for (let i = 0; i < suffixes1.length; i++) {
        let row = [];

        for (let j = 0; j < suffixes2.length; j++) {
            row.push(0);
        }
        matchTable.push(row);
    }

    for (let i = 0; i < matches1.length; i++) {
        const mat1 = matches1[i];
        const mat2 = matches2[i];
        if (!(mat1 === null || mat2 === null)) {
            matchTable[mat1][mat2]++;
        }

    }

    let matchTablePercentage = [];

    for (let i = 0; i < matchTable.length; i++) {
        const row = matchTable[i];
        const rowFrequency = frequencies1[i];
        let percRow = [];

        for (let j = 0; j < row.length; j++) {
            const match = row[j];
            percRow.push(
                match > 0 ?
                    ((match / rowFrequency) * 100).toFixed(2) + "%" :
                    ""
            );
        }
        matchTablePercentage.push(percRow);

    }

    return [matchTable, suffixes1, suffixes2, frequencies1, frequencies2];
}