import app from "../../epsy.app.mjs";

export default {
  key: "epsy-name-lookup",
  name: "Name Lookup",
  description: "Request a lookup for the provided name. [See the documentation](https://irbis.espysys.com/developer/)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    value: {
      propDefinition: [
        app,
        "value",
      ],
    },
  },

  async run({ $ }) {
    const response = await this.app.nameLookup({
      $,
      data: {
        value: this.value,
        lookupId: 149,
      },
    });
    $.export("$summary", `Successfully sent request. Use the ID to get the results: '${response.id}'`);
    return response;
  },
};
