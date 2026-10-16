import app from "../../mailtrap.app.mjs";

export default {
  name: "Delete Suppression",
  description:
    "Remove an email address from the suppression list, allowing Mailtrap to send to it again. [See the documentation]" +
    "(https://docs.mailtrap.io/developers/email-sending/suppressions#delete-api-suppressions-suppression_id)",
  key: "mailtrap-delete-suppression",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    suppressionId: {
      propDefinition: [
        app,
        "suppressionId",
      ],
    },
  },
  async run({ $ }) {
    const { suppressionId } = this;

    const response = await this.app.deleteSuppression({
      $,
      suppressionId,
    });

    $.export("$summary", `Removed suppression (ID: ${suppressionId})`);
    return response;
  },
};
