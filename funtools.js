
function acc(i) {
  return function(d) {
    return d[i];
  }
}

function ch() {
  var fs = Array.prototype.slice.call(arguments);
  return function(d) {
    return fs.reduceRight(function(p,c){return c(p)},d);
  }
}

function fork(f) {
  return function(d) {
    return [f[0](d[0]),f[1](d[1])];
  }
}

function log(s) {
  return function(d) {
    console.log(s, d);
    return d;
  }
}
