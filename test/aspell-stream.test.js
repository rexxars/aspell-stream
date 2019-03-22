'use strict';
var test = require('tape');
var aspell = require('../');

test('fires "misspelling"-events', function(t) {
    t.plan(3);
    var spellStream = aspell({lang: 'en'})
        .on('aspellMisspelling', function(err) {
            t.equal(err.word, 'someting', 'correct word should be picked up');
            t.equal(err.position, 9, 'correct position for the word picked up');
            t.assert(err.alternatives.length > 0, 'alternatives are provided');
        });

    spellStream.write('there is someting wrong here');
    spellStream.end();
});

test('fires "ok"-events', function(t) {
    t.plan(13);
    var spellStream = aspell({lang: 'en'})
        .on('aspellOk', function(msg) {
            t.assert(msg.type, 'aspellOk');
        })
        .on('aspellMisspelling', function(err) {
            t.equal(err.word, 'wong', 'error on wong');
        });

    spellStream.write('something very wong with this one\n');
    spellStream.write('ain\'t nothing wrong with this line, however\n');
    spellStream.end();
});

test('fires "comment"-events', function(t) {
    t.plan(1);
    var spellStream = aspell({lang: 'en'}).on('aspellComment', function(msg) {
        t.assert(msg.type, 'aspellComment');
    });

    spellStream.write('Boom.');
    spellStream.end();
});

test('fires "ok"-events with run-together flag', function(t) {
    t.plan(1);
    var spellStream = aspell({ lang: 'en', runTogether: true })
        .on('aspell', function(msg) {
            if (msg.runTogether) {
                t.assert(msg.runTogether, 'should pick up one runtogether word');
            }
        });

    spellStream.write('The runtogether is coming for youa.');
    spellStream.end();
});

test('fires "line-break"-events', function(t) {
    t.plan(3);
    var spellStream = aspell({ lang: 'en', runTogether: true })
        .on('aspellLineBreak', function(msg) {
            t.assert(msg.type, 'aspellLineBreak');
        });

    spellStream.write('Never going to give you up\n');
    spellStream.write('Never going to let you down');
    spellStream.end();
});
