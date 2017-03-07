var moment = require('moment');
var rotatingLogStream = require('file-stream-rotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"daily", verbose: true, date_format: "YYYY-MM-DD.HH.mm.ss"});

rotatingLogStream.on("error",function(){
    console.log(Date.now(), Date(), "stream error")
})


rotatingLogStream.on("close",function(){
    console.log(Date.now(), Date(), "stream closed")
})

rotatingLogStream.on("finish",function(){
    console.log(Date.now(), Date(), "stream finished")
})

rotatingLogStream.on("rotated",function(oldFile,newFile){
    console.log(Date.now(), Date(), "stream rotated",oldFile,newFile);
})

// console.log(rotatingLogStream.on, rotatingLogStream.end, rotatingLogStream)

var counter = 0;
var i = setInterval(function(){
    counter++;
    rotatingLogStream.write("test\n")
    if(counter == 20){
        clearInterval(i);
        rotatingLogStream.end("end\n");
    }
}, 100);

