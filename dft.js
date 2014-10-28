var m = require('mathjs');
var fkit = require('fkit');

var sinInfo = function (value, k, N) {
    return {
        frequency: k,
        amplitude: m.round(m.abs(value)/m.sqrt(N), 5),
        phase: m.round(m.atan2(value.im, value.re), 5)
    };
};

// xs: a list of sample points in the signal to analyse, e.g.: [0, 1, 2, 1]
// N: number of samples in xs e.g: 4
// ns: a list from [0 .. N-1]

module.exports = function (xs) {
    var N = xs.length;
    var ns = fkit.range(0, N);

    var X = function (k) {
        //sum all the results for n = [0 ... N]
        var val = ns.reduce(function (sum, n) {
            //-i*2*pi*k*n / N
            var topbit = m.divide(
                m.multiply(m.multiply(-2*n*k, m.i), m.pi),
                N
            );

            return m.add(
                sum,
                //xs[n] * e^(-i*2*pi*k*n / N)
                m.multiply(xs[n], m.pow(m.e, topbit))
            );

        }, 0);

        //take the sum and divide it by 1/sqrt(N) to normalise, also round, because, javascript floats
        return m.round(
            m.multiply(
                m.divide(1, m.sqrt(N)),
                val
            ),
        8);
    };

    //returns an array of X(k) where k [ 0 ... N ]
    return fkit.range(0, N).map(function (k) {
        //Take the resultant complex number and convert to a frequency, amplitude and phase
        return sinInfo(X(k), k, N);
    });
};

//var xs = fkit.range(0,4);
//var sin = xs.map(function (n) {
//    return Math.sin(2*Math.PI*(n/xs.length));
//});
//sin = [8,4,8,0]
//
//console.log(module.exports(sin));


