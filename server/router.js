const actions = require('./actions');

module.exports = {
  GET: {
    "/api/clicks/": actions.get_clicks,
  },
  POST: {
    "/api/clicks/": actions.save,
  },
};
