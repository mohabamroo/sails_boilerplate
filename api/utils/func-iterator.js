module.exports.builder = (req, res, pipeline) => {
  for (func in pipeline) {
    if (func(req, res)) break;
  }
};
