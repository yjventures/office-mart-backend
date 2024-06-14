const addMinutes = (date, minutes) => {
  try {
    return date.setMinutes(date.getMinutes() + minutes);
  } catch (e) {
    throw e;
  }
}

const isLessThan = (time1, time2) => {
  try {
    const ret = time1 < time2;
    return ret;
  } catch (e) {
    throw e;
  }
}

module.exports = {
  addMinutes,
  isLessThan,
}