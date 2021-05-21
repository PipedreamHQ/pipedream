const ongage = require("../../ongage.app.js");

module.exports = {
  key: "ongage-update-subscriber",
  name: "Ongage Update Subscriber",
  description: "Update a list subscriber in Ongage.",
  version: "0.0.1",
  type: "action",
  props: {
    ongage,
    listId: {
      propDefinition: [
        ongage,
        "listId",
      ],
      optional: true,
    },
    email: {
      propDefinition: [
        ongage,
        "email",
      ],
    },
    fields: {
      propDefinition: [
        ongage,
        "fields",
      ],
      optional: true,
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
      return await this.ongage.updateSubscriber(
        this.listId,
        this.email,
        this.fields,
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
