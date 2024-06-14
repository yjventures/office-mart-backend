const capitalizeFirstLetter = (str) => {
  const words = str.trim().split(' ');
  const newWords = words.map(element => {
    return element[0].toUpperCase() + element.substring(1); 
  });
  return newWords.join(' ');
};

module.exports = {
  capitalizeFirstLetter,
};