var d3 = require('d3');
window.context = new AudioContext();

var lastSource;

module.exports = function (arr) {
    if (lastSource) lastSource.stop();

    var max = d3.max(arr);
    var yScale = d3.scale.linear()
                    .domain([-1*max,max])
                    .range([-1,1]);
    
    var buffer = context.createBuffer(1, arr.length, 22050);

    var nowBuffering = buffer.getChannelData(0);
    for (var i = 0; i < arr.length; i++) {
        nowBuffering[i] = yScale(arr[i]);
    }

    lastSource = context.createBufferSource();
    lastSource.loop = true;
    lastSource.buffer = buffer;
    lastSource.connect(context.destination);
    lastSource.start();
};

