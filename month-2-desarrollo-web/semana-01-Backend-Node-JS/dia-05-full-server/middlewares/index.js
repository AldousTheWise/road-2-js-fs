// middlewares/index.js
const cors = require("./cors.js");
const jsonParser = require("./jsonParser.js");
const formParser = require("./formParser.js");
const logger = require("./logger.js");
const staticFiles = require("./staticFiles.js");
const sessions = require("./sessions.js");
const { requireAuth, redirectIfAuthenticated, authService } = require("./auth");

module.exports = {
  cors,
  jsonParser,
  formParser,
  logger,
  staticFiles,
  sessions,
  requireAuth,
  redirectIfAuthenticated,
  authService,
};
