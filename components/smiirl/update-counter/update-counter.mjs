import smiirl from "../smiirl.app.mjs";

export default {
  name: "Update Smiirl Counter",
  description: "Update a Smiirl Counter to the given number",
  key: "smirrl-update-counter",
  type: "action",
  version: "0.0.1",
  ...smiirl,
  props: {
    attributeName: {
      type: "string",
      label: "Attribute",
      description: "The attribute Smiirl is expecting in the JSON URL, configurable in the Smiirl Dashboard.",
      options: [
        "likes",
        "number",
        "count",
      ],
      optional: false,
    },
    value: {
      type: "integer",
      label: "Count",
      default: 0,
      description: "The number to set the Smiirl counter to.",
      optional: false,
    },
    http: {
      type: "$.interface.http",
      customResponse: true,
    },
  },
  async run () {
    await this.http.respond({
      [this.attributeName]: this.value,
    });
  },
};
