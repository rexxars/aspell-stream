var aspell = require('../');

process.stdin
    .pipe(aspell())
    .on('misspelling', function(err) {
        console.log(err);
    });
