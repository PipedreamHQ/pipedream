import app from "../../wiza.app.mjs";

export default {
  key: "wiza-get-contacts",
  name: "Get Contacts",
  description: "Get contacts for a list. [See the documentation](https://wiza.co/api-docs#/paths/~1api~1lists~1%7Bid%7D/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
    segment: {
      propDefinition: [
        app,
        "segment",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getContacts({
      $,
      id: this.id,
      params: {
        segment: this.segment,
      },
    });

    $.export("$summary", "Successfully retrieved the list's contacts");

    return response;
  },
};
