var os = require('os');

require('crypto').randomBytes(512, function(err, buffer) {
    var token = buffer.toString('hex');
    var logStream = require('../FileStreamRotator').getStream({
        filename: './logs/application-%DATE%.log',
        frequency: 'custom',
        size: '5k',
        max_logs: 4,
        end_stream: true,
        verbose: true,
        watch_log: true
    });
    
    for (var i = 0; i < 1000; i++) {
        logStream.write(token + os.eol);
    }
});