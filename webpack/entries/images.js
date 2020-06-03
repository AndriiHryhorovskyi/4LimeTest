const requireTest = require.context(
  "../../src/img",
  true,
  /\.(ico|gif|png|svg|jpe?g)$/i
);
requireTest.keys().forEach(requireTest);
