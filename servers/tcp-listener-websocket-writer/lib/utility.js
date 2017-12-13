class Utility {
  indexArrayByField(array, fieldName) {
    let obj = {};
    for (let i = 0; i < array.length; i++) {
      obj[array[i][fieldName]] = array[i];
    }
    return obj;
  }
}

module.exports = new Utility();
