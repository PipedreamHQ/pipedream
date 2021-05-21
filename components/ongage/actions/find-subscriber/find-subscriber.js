const ongage = require("../../ongage.app.js");

module.exports = {
  key: "ongage-find-subscriber",
  name: "Ongage Find Subscriber",
  description: "Find a list subscriber in Ongage.",
  version: "0.0.1",
  type: "action",
  props: {
    ongage,
    email: {
      propDefinition: [
        ongage,
        "email",
      ],
    },
    haltOnError: {
      propDefinition: [
        ongage,
        "haltOnError",
      ],
    },
  },
  async run () {
    try {
      return await this.ongage.findSubscriber(
        this.email,
      );
    } catch (err) {
      if (this.haltOnError) {
        throw err;
      }
      if (err.response) {
        return err.response.data;
      }
      return err;
    }
  },
};
