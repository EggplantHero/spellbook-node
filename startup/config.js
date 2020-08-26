const config = require("config");

module.exports = function () {
  if (!config.get("jwtPrivateKey")) {
    // throw new Error("FATAL ERROR: jwtPrivateKey is not set.");
    console.log("FATAL ERROR: jwtPrivateKey is not set.");
    console.log(
      "Please set it with the command: set spellbook_jwtPrivateKey=..."
    );
    process.abort();
  }
};
