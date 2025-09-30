import app from "../../hunter.app.mjs";

export default {
  key: "hunter-get-lead",
  name: "Get Lead",
  description: "Retrieve one of your leads by ID. [See the documentation](https://hunter.io/api-documentation/v2#leads).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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

    const response = await app.getLead({
      $,
      leadId,
    });

    $.export("$summary", `Successfully retrieved lead with ID \`${response.data.id}\`.`);
    return response;
  },
};
