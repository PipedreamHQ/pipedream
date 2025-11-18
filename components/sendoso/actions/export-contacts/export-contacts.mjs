import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-export-contacts",
  name: "Export Contacts",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Export contacts data from Sendoso. [See the documentation](https://sendoso.docs.apiary.io/#reference/contact-management)",
  type: "action",
  props: {
    sendoso,
    format: {
      type: "string",
      label: "Export Format",
      description: "Format for the exported data.",
      options: [
        "json",
        "csv",
      ],
      optional: true,
      default: "json",
    },
  },
  async run({ $ }) {
    const { format } = this;

    const response = await this.sendoso.exportContacts({
      $,
      params: {
        format,
      },
    });

    $.export("$summary", `Successfully exported contacts in ${format} format`);
    return response;
  },
};

