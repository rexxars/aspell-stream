aspell-stream
=============

Readable and writable stream that spell checks your text and parses aspell output to an understandable format

Installation
============

Make sure `aspell` is installed on your system (`apt-get install aspell` on debian-based systems).
Run `npm install --save aspell-stream` to include it in your project.

Usage
=====

```js
var aspell = require('aspell-stream');
var fs = require('fs');

fs.createReadStream('somefile.md')
    .pipe(aspell())
    .on('misspelling', function(err) {
        console.log(err);
    });
```
Or...

```js
var spellStream = aspell()
    .on('misspelling', function(err) {
        console.log(err);
        /* {
            type: 'misspelling',
            word: 'someting',
            position: 9,
            alternatives: [
                'some',
                'something',
                'so',
                'meting',
                'so-meting',
                'smiting',
                'smarting',
                'smelting',
                'sorting',
                'meting',
                'Smetana'
            ]
        } */
    });

spellStream.write('there is someting wrong here');
spellStream.end();
```

License
=======

MIT-licensed. See LICENSE.
