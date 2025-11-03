import app from "../../espy.app.mjs";

export default {
  key: "espy-email-lookup",
  name: "Email Lookup",
  description: "Request a lookup for the provided email. [See the documentation](https://api-docs.espysys.com/name-socialscan/headers-and-body-request-by-name-lookup)",
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
