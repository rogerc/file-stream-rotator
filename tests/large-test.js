var os = require('os');

require('crypto').randomBytes(1048, function(err, buffer) {
    var token = buffer.toString('hex');
    var logStream = require('../FileStreamRotator').getStream({
        filename: './logs/application-%DATE%',
        frequency: 'custom',
        // size: '50k',
        max_logs: 4,
        end_stream: true,
        verbose: true,
        watch_log: true,
        extension: ".log"
    });
    var count = 0
    var i = setInterval(function(){
        // console.log("count: ", count)
        if (count > 300) {
            return clear()
        }
        count++;
        for (var i = 0; i < 1; i++) {
            logStream.write(token + os.eol);
        }
    },10)

    function clear(){
        console.log("clearing interval")
        clearInterval(i)
        logStream.end("end");
    }
});