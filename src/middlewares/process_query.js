const process_query = (req, res, next) => {
  try {
    if (req?.query) {
       for (let item in req.query) {
        if (req.query[item] === 'true') {
          req.query[item] = true;
        } else if (req.query[item] === 'false') {
          req.query[item] = false;
        }
       }
    }
    next();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  process_query,
};