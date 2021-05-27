const ongage = require("../../ongage.app.js");

module.exports = {
  key: "ongage-subscribe",
  name: "Ongage Subscribe",
  description: "Subscribe to a list in Ongage.",
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
    overwrite: {
      propDefinition: [
        ongage,
        "overwrite",
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
      return await this.ongage.subscribe(
        this.listId,
        this.email,
        this.fields,
        this.overwrite,
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
