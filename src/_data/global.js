module.exports = {
  random() {
    return new Array(3).fill(null).map(function segment() {
      return (((1 + Math.random()) * 0x10000) | 0).toString(16);
    }).join('-');
  },
}
