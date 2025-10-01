import app from "../../epsy.app.mjs";

export default {
  key: "epsy-email-lookup",
  name: "Email Lookup",
  description: "Request a lookup for the provided email. [See the documentation](https://irbis.espysys.com/developer/)",
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
    const response = await this.app.emailLookup({
      $,
      data: {
        value: this.value,
        lookupId: 67,
      },
    });
    $.export("$summary", `Successfully sent request. Use the ID to get the results: '${response.id}'`);

    return response;
  },
};
