const fCorrectNumber = (number, decimal = 8) => {
  return Number(number.toFixed(decimal));
};

const fFloatFloor = (number, decimal = 4) => {
  return Math.floor(number * 10 ** decimal) / 10 ** decimal;
};

module.exports = {
  fCorrectNumber,
  fFloatFloor
};
