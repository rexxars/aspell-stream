'use strict';
var test = require('tape');
var aspell = require('../');

test('fires "misspelling"-events', function(t) {
    t.plan(3);
    var spellStream = aspell()
        .on('misspelling', function(err) {
            t.equal(err.word, 'someting', 'correct word should be picked up');
            t.equal(err.position, 9, 'correct position for the word picked up');
            t.assert(err.alternatives.length > 0, 'alternatives are provided');
        });

    spellStream.write('there is someting wrong here');
    spellStream.end();
});

test('fires "ok"-events', function(t) {
    t.plan(13);
    var spellStream = aspell()
        .on('ok', function(msg) {
            t.assert(msg, 'word ok');
        })
        .on('misspelling', function(err) {
            t.equal(err.word, 'wong', 'error on wong');
        });

    spellStream.write('something very wong with this one\n');
    spellStream.write('ain\'t nothing wrong with this line, however\n');
    spellStream.end();
});

test('fires "comment"-events', function(t) {
    t.plan(1);
    var spellStream = aspell().on('comment', function(msg) {
        t.assert(msg, 'comment event fired');
    });

    spellStream.write('Boom.');
    spellStream.end();
});

test('fires "ok"-events with run-together flag', function(t) {
    t.plan(1);
    var spellStream = aspell({ runTogether: true })
        .on('ok', function(msg) {
            if (msg.runTogether) {
                t.assert(msg.runTogether, 'should pick up one run-together word');
            }
        });

    spellStream.write('The elephantman is coming for you.');
    spellStream.end();
});

test('fires "line-break"-events', function(t) {
    t.plan(3);
    var spellStream = aspell({ runTogether: true })
        .on('line-break', function(msg) {
            t.assert(msg, 'line-break event fired');
        });

    spellStream.write('Never going to give you up\n');
    spellStream.write('Never going to let you down');
    spellStream.end();
});
