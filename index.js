var ee = require('event-emitter');
var duplexer = require('duplexer');
var es = require('event-stream');
var spawn = require('child_process').spawn;
var slug = require('to-slug-case');
var shellescape = require('shell-escape');

var parser = require('./parser');

function parseOpts(options) {
    var flags = [];
    var opts = options || {};
    for (var key in opts) {
        if (opts[key] === true) {
            flags.push(`--${slug(key)}`);
            continue;
        }
        flags.push('--' + slug(key) + '=' + shellescape([opts[key]]));
    }
    return flags;
}


function aspell(opts) {
    var proc   = spawn('aspell', ['-a'].concat(parseOpts(opts)));
    var stream = duplexer(proc.stdin, proc.stdout);

    ee(stream);

    proc.stdout
        .pipe(es.split())
        .pipe(es.map(function (data, cb) {
            var result = parser(data);
            stream.emit(result.type, result);
            stream.emit('aspell', result);
            cb();
        }));

    return stream;
}

module.exports = aspell;
