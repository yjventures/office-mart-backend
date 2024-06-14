const converter = require('convert-excel-to-json');

const excelToJson = (file) => {
  const result = converter({
    sourceFile: file,
    header: {
      rows: 1
    },
    columnToKey: {
      '*': '{{columnHeader}}'
    }
  });
  return result.Sheet1;
}

module.exports = {
  excelToJson
};