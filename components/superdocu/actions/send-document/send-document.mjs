import app from "../../superdocu.app.mjs";

export default {
  key: "superdocu-send-document",
  name: "Send Document",
  description: "Send a document in Superdocu. [See the documentation](https://developers.superdocu.com/api/index.html)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    documentId: {
      propDefinition: [
        app,
        "documentId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.sendDocument({
      $,
      documentId: this.documentId,
    });

    $.export("$summary", `Successfully sent document with ID \`${this.documentId}\``);

    return response;
  },
};
