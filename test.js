var fsr = require('./FileStreamRotator');
var assert = require('assert');

var tests = {
    testFrequency: function () {
        var opt1 = 'M544';
        var opt2 = '5m';
        var opt3 = '1H';
        var opt4 = '3h'
        var opt5 = 'daily';
        var opt6 = 'test';
        var opt7 = '3W';
        var opt8 = '-1h';
        var opt9 = '25h';
        var opt10 = '24h';
        var opt11 = '23h';
        var opt12 = '59m';
        var opt13 = '60m';
        var opt14 = '61m';
        var opt15 = '-1m';


        assert.ok(!fsr.getFrequency(opt1));

        var obj = fsr.getFrequency(opt2);
        console.log('obj =', obj);
        assert.ok(typeof  obj == 'object');
        assert.equal(obj.type, 'm');
        assert.equal(obj.digit, 5);

        obj = fsr.getFrequency(opt3);
        assert.ok(typeof  obj == 'object');
        assert.equal(obj.type, 'h');
        assert.equal(obj.digit, 1);

        obj = fsr.getFrequency(opt4);
        assert.ok(typeof  obj == 'object');
        assert.equal(obj.type, 'h');
        assert.equal(obj.digit, 3);

        obj = fsr.getFrequency(opt5);
        assert.ok(typeof  obj == 'object');
        assert.equal(obj.type, 'daily');
        assert.equal(obj.digit, undefined);

        obj = fsr.getFrequency(opt6);
        assert.ok(typeof  obj == 'object');
        assert.equal(obj.type, 'test');
        assert.equal(obj.digit, 0);

        obj = fsr.getFrequency(opt7);
        assert.ok(obj === false);

        obj = fsr.getFrequency(opt8);
        assert.ok(obj === false);

        obj = fsr.getFrequency(opt9);
        assert.ok(obj === false);

        obj = fsr.getFrequency(opt10);
        console.log('obj =', obj);
        assert.ok(typeof obj == 'object');
        assert.equal(obj.type, 'h');
        assert.equal(obj.digit, 24);

        obj = fsr.getFrequency(opt11);
        console.log('obj =', obj);
        assert.ok(typeof obj == 'object');
        assert.equal(obj.type, 'h');
        assert.equal(obj.digit, 23);

        obj = fsr.getFrequency(opt12);
        assert.ok(typeof obj == 'object');
        assert.equal(obj.type, 'm');
        assert.equal(obj.digit, 59);

        obj = fsr.getFrequency(opt13);
        assert.ok(typeof obj == 'object');
        assert.equal(obj.type, 'm');
        assert.equal(obj.digit, 60);

        obj = fsr.getFrequency(opt14);
        assert.ok(obj === false);

        obj = fsr.getFrequency(opt15);
        assert.ok(obj === false);
    },
    testGetDate: function () {
        var opt = {type: 'test', digit: 0};
        var opt1 = {type: 'daily', digit: 0};
        var opt2 = {type: 'h', digit: 1};
        var opt3 = {type: 'm', digit: 30};
        var opt4 = {type: 'm', digit: 45};
        var opt5 = {type: 'h', digit: 3};
        var opt6 = {type: 'm', digit: 5};



        console.log(fsr.getDate(opt));
        console.log(fsr.getDate(opt1));
        console.log(fsr.getDate(opt2));
        console.log(fsr.getDate(opt3));
        console.log(fsr.getDate(opt4));
        console.log(fsr.getDate(opt5));
        console.log(fsr.getDate(opt6));
    },
    testGetStream: function() {
        var options = { filename: __dirname + '/log/program.log', frequency: '1m', verbose: true }

        var stream = fsr.getStream(options);
        process.__defineGetter__('stdout', function() {
            return stream;
        });
        process.__defineGetter__('stderr', function() {
            return stream;
        });

        setTimeout(function(){
            stream.write('Foo bar');
        }, 3000)

        setTimeout(function(){
            stream.write('Foo bar');
        }, 60000);
    }
}

Object.keys(tests).forEach(function (test) {
    if (typeof tests[test] == 'function') {
        tests[test]();
    }
});