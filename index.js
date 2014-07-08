'use strict';
var events = require('events');
var util = require('util');
var duplexer = require('duplexer');
var spawn = require('child_process').spawn;
var split = require('split');
var through = require('through2');
var parser = require('./parser');
var slug = require('to-slug-case');
var shellescape = require('shell-escape');

function parseOpts(options) {
    var flags = [], opts = options || {}, val;
    for (var key in opts) {
        val = opts[key];
        val = val === true ? '' : ('=' + shellescape([val]));

        flags.push('--' + slug(key) + val);
    }

    return flags;
}

module.exports = function(opts) {
    var proc   = spawn('aspell', ['-a'].concat(parseOpts(opts)));
    var stream = duplexer(proc.stdin, proc.stdout);

    proc.stdout
        .pipe(split())
        .pipe(through(function(chunk, enc, cb) {
            var result = parser(chunk.toString());
            stream.emit(result.type, result);
            cb();
        }));

    util.inherits(stream, events.EventEmitter);
    return stream;
};
