var ok = Object.freeze({ type: 'aspellOk' });
var unknown = Object.freeze({ type: 'aspellUnknown' });
var runTogether = Object.freeze({ type: 'aspellOk', runTogether: true });
var lineBreak = Object.freeze({ type: 'aspellLineBreak' });

module.exports = function parseLine(line) {
    if (line.length <= 0) {
        return lineBreak;
    }

    var ctrl = line.charAt(0);

    if (ctrl === '@') {
        return { type: 'comment', line: line };
    } else if (ctrl === '*') {
        return ok;
    } else if (ctrl === '-') {
        return runTogether;
    } else if (ctrl !== '&' && ctrl !== '#') {
        return unknown;
    }

    var parts = line.split(/:?,?\s/g);
    return {
        type: 'aspellMisspelling',
        word: parts[1],
        position: parseInt((ctrl === '#' ? parts[2] : parts[3]) || 0, 10),
        alternatives: parts.slice(4)
    };
};
