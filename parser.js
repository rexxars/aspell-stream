'use strict';
var ok = { type: 'ok' };
var unknown = { type: 'unknown' };
var runTogether = { type: 'ok', runTogether: true };
var lineBreak = { type: 'line-break' };

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
        type: 'misspelling',
        word: parts[1],
        position: parseInt((ctrl === '#' ? parts[2] : parts[3]) || 0, 10),
        alternatives: parts.slice(4)
    };
};
