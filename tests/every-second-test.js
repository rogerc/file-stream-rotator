var moment = require('moment');
// var rotatingLogStream = require('../FileStreamRotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"1m", verbose: true});
var rotatingLogStream = require('../FileStreamRotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"custom", verbose: true, date_format: "YYYY-MM-DD.HH.mm"});
// var rotatingLogStream = require('../FileStreamRotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"dont-rotate", verbose: true, date_format: "YYYY-MM-DD.HH.mm.ss"});
// var rotatingLogStream = require('../FileStreamRotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"daily", verbose: true, date_format: "YYYYMMDD"});
// var rotatingLogStream = require('../FileStreamRotator').getStream({filename:"/tmp/testlog-%DATE%.log", frequency:"daily", verbose: true});

rotatingLogStream.on("error",function(){
    console.log(Date.now(), Date(), "stream error")
})


rotatingLogStream.on("close",function(){
    console.log(Date.now(), Date(), "stream closed")
})

rotatingLogStream.on("finish",function(){
    console.log(Date.now(), Date(), "stream finished")
})

rotatingLogStream.on("rotate",function(oldFile,newFile){
    console.log(Date.now(), Date(), "stream rotated",oldFile,newFile);
})

rotatingLogStream.on("open",function(fd){
    console.log(Date.now(), Date(), "stream open",fd);
})

rotatingLogStream.on("new",function(newFile){
    console.log(Date.now(), Date(), "stream new",newFile);
})

// console.log(rotatingLogStream.on, rotatingLogStream.end, rotatingLogStream)

var counter = 0;
var i = setInterval(function(){
    counter++;
    rotatingLogStream.write("test\n")
    if(counter == 200){
        clearInterval(i);
        rotatingLogStream.end("end\n");
    }
}, 100);

