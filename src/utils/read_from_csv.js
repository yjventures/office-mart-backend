const converter = require("csvtojson");

const csvToJson = async (file) => {
  const result = await converter().fromFile(file);
  return result;
};

module.exports = {
  csvToJson,
};