import app from "../../hunter.app.mjs";

export default {
  key: "hunter-delete-lead",
  name: "Delete Lead",
  description: "Delete an existing lead from your Hunter account. [See the documentation](https://hunter.io/api-documentation/v2#delete-lead).",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      leadId,
    } = this;

    await app.deleteLead({
      $,
      leadId,
    });

    $.export("$summary", "Successfully deleted lead");
    return {
      success: true,
    };
  },
};
