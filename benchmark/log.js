/* eslint-disable no-console */
const bench = require('./bench.js')
const FileStreamRotator = require('../index')

const path = require('path')

const stream1 = FileStreamRotator.getStream({filename: path.join(__dirname, '../log/program1.log'), verbose: false, date_format: 'YYYY-MM-DD', frequency: '1m' })
const stream2 = FileStreamRotator.getStream({filename: path.join(__dirname, '../log/program2.log'), verbose: false, date_format: 'YYYY-MM-DD', frequency: 'custom' })

process.env.BENCHMARK = true

// Without output (dis rotateStream.write(str, encoding);)
// benchmarking performance ...
// 
// stream with optimize x 16,391,653 ops/sec ±0.74% (88 runs sampled)
// stream without optimize x 621,457 ops/sec ±1.45% (90 runs sampled)
// 
//    stream with optimize was fastest
// stream without optimize was 96.2% ops/sec slower (factor 26.6)

bench
  .mkSuite()
  .add('stream with optimize', function() {
    stream1.write('!!!!!!!\n')
  })
  .add('stream without optimize', function() {
    stream2.write('!!!!!!!\n')
  })
  .run({})
