/* eslint-disable no-console */
const Benchmark = require('benchmark')

const padSize = 23
const benches = []

function getHz(bench) {
  return 1 / (bench.stats.mean + bench.stats.moe)
}

function pad(str, len, l) {
  while (str.length < len) str = l ? str + ' ' : ' ' + str
  return str
}

exports.mkSuite = function() {
  const suite = new Benchmark.Suite()
  suite
    // add listeners
    .on('add', function(event) {
      benches.push(event.target)
    })
    .on('start', function() {
      process.stdout.write('benchmarking performance ...\n\n')
    })
    .on('cycle', function(event) {
      process.stdout.write(String(event.target) + '\n')
    })
    .on('complete', function() {
      if (benches.length > 1) {
        benches.sort(function(a, b) {
          return getHz(b) - getHz(a)
        })
        var fastest = benches[0],
          fastestHz = getHz(fastest)
        process.stdout.write(
          '\n\033[32m' +
            pad(fastest.name, padSize) +
            '\033[0m was ' +
            'fastest' +
            '\n'
        )
        benches.slice(1).forEach(function(bench) {
          var hz = getHz(bench)
          var percent = 1 - hz / fastestHz
          process.stdout.write(
            '\033[33m' +
              pad(bench.name, padSize) +
              '\033[0m' +
              ' was ' +
              ((percent * 100).toFixed(1) +
                '% ops/sec slower (factor ' +
                (fastestHz / hz).toFixed(1) +
                ')') +
              '\n'
          )
        })
      }
      process.stdout.write('\n')
      process.nextTick(() => {
        process.exit(0)
      })
    })
  return suite
}
