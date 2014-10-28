var playArray = require('./play-array');

playArray([1,2,3,1,2,3,1,2,3,1,2,3,1,2,3,1,2,3]);

//window.context = new AudioContext();
//var buffer = context.createBuffer(1, 44000, 44000);
//
//var nowBuffering = buffer.getChannelData(0);
//var x = -1;
//for (var i = 0; i < 44000; i++) {
//    x += 0.01;
//    if (x > 1) x = -1;
//    nowBuffering[i] = Math.sin(i/10);
//}
//
//var source = context.createBufferSource();
//source.loop = true;
//source.buffer = buffer;
//source.connect(context.destination);
//source.start();
