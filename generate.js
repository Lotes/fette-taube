const song = require('./song.json')
const Promise = require('bluebird')
const exec = require('child_process').exec
const folder = process.argv[process.argv.length - 1]

function execute (params, outputFileName) {
  return new Promise(function (resolve, reject) {
    exec('sox -m ' + params + ' ' + outputFileName, function (err) {
      if (err) return reject(err)
      resolve()
    })
  })
}

Promise.map(Object.keys(song), function (voice) {
  var takte = song[voice]
  var args = takte.map(function (element, index) {
    return [index, element]
  }).filter(function (tuple) {
    return tuple[1] !== null
  }).map(function (tuple) {
    var padding = tuple[0] * 2
    var takt = tuple[1]
    return '"|sox muster/' + folder + '/' + voice + takt + '.ogg -p pad ' + padding + ' 0"'
  }).join(' ')
  var fileName = voice + '.ogg'
  console.log('generate ' + fileName)
  return execute('muster/silence.ogg ' + args, fileName)
    .then(function () {
      return fileName
    })
})
.then(function (fileNames) {
  console.log('generate final.ogg')
  return execute(fileNames.join(' '), folder + '.ogg')
})
.catch(function (err) {
  console.log(err)
})
