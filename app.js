var playArray = require('./play-array');
var d3 = require('d3');
var fkit = require('fkit');
var dft = require('./dft');

var height = 300;
var width = 800;

window.config = {
    nHarmonics: 5
};

var f = function (x) {
    return 0*Math.sin(x) + Math.cos(x);
};

var f2 = function (x) {
    return Math.sin(x) + 0*Math.cos(x);
};

var makeSin = function (phase) {
    return function (x) {
        console.log(phase, 1-phase);
       return phase*Math.sin(x) + (1-phase)*Math.cos(x);
    };
};

window.xs = d3.range(0, 64);
window.ys = xs.map(f);
window.myYs = [];


var svg = d3.select('#graph')
            .append('svg')
                .attr('class', 'graph')
                .attr('width', width)
                .attr('height', height)
            .append('g');

//var line = d3.svg.line()
//             .interpolate('basis')
//             .x(function (d) { return d; })
//             .y(function (d) { return d; })

var xScale = d3.scale.linear()
                .domain([d3.min(xs), d3.max(xs)])
                .range([0, width]);

var yScale = d3.scale.linear()
                .domain([5, -5])
                .range([0, height]);


function render(f) {
    var dots = svg.selectAll('.dot')
                    .data(xs);

    dots
        .attr('cx', xScale)
        .attr('cy', fkit.compose(yScale, f));

    dots.enter()
        .append('circle')
        .attr('class', 'dot')
        .attr('cx', xScale)
        .attr('cy', fkit.compose(yScale, f))
        .attr('r', 2);
}
function renderMySignal() {
    var dots = svg.selectAll('.my-dot')
                    .data(xs);

    dots.attr('cx', xScale)
        .attr('cy', function (d, i) { return yScale(myYs[i] || 0); });

    dots.enter()
        .append('circle')
        .attr('class', 'my-dot')
        .attr('cx', xScale)
        .attr('cy', function (d, i) { return yScale(myYs[i] || 0); })
        .attr('r', 5)
        .attr('fill', 'red');
}

window.sin = Math.sin, window.cos = Math.cos;

//var makeEquationFn = function (eq) {
//    return new Function("x", "return " + eq);
//};
//
//var el = document.querySelector('[name=equation');
//el.addEventListener('change', function () {
//    var equation = makeEquationFn(el.value);
//    console.log(equation);
//    render(equation);
//}, false);

var makeEquationFn = function (dft) {
    var sins = dft.map(fkit.get('frequency'));
    var coeffs = dft.map(fkit.get('amplitude'));
    var phases = dft.map(fkit.get('phase'));

    var f = (Math.PI * 2)/sins.length;

    sins = sins.slice(0,sins.length/2).slice(0,config.nHarmonics);

    return function (x) {
        return sins.reduce(function (sum, sin, i) {
            var coeff = coeffs[i];
            if (i !== 0) coeff *= 2;
            return sum + coeff * Math.cos(f * sin * x + phases[i]);
        }, 0);
    };
};

//[].slice.call(document.querySelectorAll('input[type=range]')).map(function (el) {
//    el.addEventListener('mousemove', function () {
//        render(makeEquationFn(xs.length));
//    });
//});



var svgEl = d3.select('svg');
svgEl.on('mousedown', function () {
    myYs = xs.map(function () { return null; });
    svgEl.on('mousemove', function () {
        var mousePos = d3.mouse(document.querySelector('svg'));
        var x = xScale.invert(mousePos[0]);
        var y = yScale.invert(mousePos[1]);

        var index = fkit.findIndex(function (v) {
            return v >= x;
        }, xs);

        myYs = myYs.map(function (currentY, i) {
            if (i > index) return currentY;
            if (i === index) return y;
            return currentY === null ? y : currentY;
        });
        renderMySignal();
    });

    document.addEventListener('mouseup', function onMouseup() {
        document.removeEventListener('mouseup', onMouseup);
        svgEl.on('mousemove', null);
        config.nHarmonics = 0;
        render(makeEquationFn(dft(myYs)));
        playArray(myYs);
    }, false);
});

myYs = xs.map(function (x) { 
    var f = (Math.PI * 2)/xs.length;
    return 2*Math.sin(f*x);
});
console.log('Calculating');
renderMySignal();
render(makeEquationFn(dft(myYs)));
console.log('Calculated');

Object.observe(config, function () {
    render(makeEquationFn(dft(myYs)));
});

setInterval(function () { if (config.nHarmonics <= 32) { config.nHarmonics++} }, 500)
