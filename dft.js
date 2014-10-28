var m = require('mathjs');
var fkit = require('fkit');

var sinInfo = function (value, k, N) {
    return {
        frequency: k,
        amplitude: m.round(m.abs(value)/m.sqrt(N), 5),
        phase: m.round(m.atan2(value.im, value.re), 5)
    };
};

module.exports = function (xs) {
    var N = xs.length;
    var ns = fkit.range(0, N);

    var X = function (k) {
        var val = ns.reduce(function (sum, n) {
            var topbit = m.divide(
                m.multiply(m.multiply(-2*n*k, m.i), m.pi),
                N
            );

            return m.add(
                sum,
                m.multiply(xs[n], m.pow(m.e, topbit))
            );

        }, 0);

        return m.round(
            m.multiply(
                m.divide(1, m.sqrt(N)),
                val
            ),
        8);
    };

    return fkit.range(0, N).map(function (k) {
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


