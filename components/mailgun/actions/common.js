const mailgun = require("../mailgun.app");

module.exports = {
  props: {
    haltOnError: {
      propDefinition: [
        mailgun,
        "haltOnError",
      ],
    },
  },
  withErrorHandler: (action) => async function (...props) {
    try {
      return await action(...props);
    } catch (error) {
      if (this.haltOnError) {
        throw error;
      }
      return error;
    }
  },
};
