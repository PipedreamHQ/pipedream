import app from "../../brainbase_labs.app.mjs";

export default {
  key: "brainbase_labs-get-team",
  name: "Get Team",
  description:
    "Get the team associated with the provided API key. [See the documentation](https://docs.usebrainbase.com/api-reference/team/get-the-team-associated-with-the-provided-api-key)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    includeIntegrations: {
      type: "boolean",
      label: "Include Integrations",
      description: "Set to true to also include integrations in the response",
      optional: true,
    },
  },
  async run({ $ }) {
    const params = {
      includeIntegrations: this.includeIntegrations,
    };

    const response = await this.app.getTeam({
      $,
      params,
    });

    $.export("$summary", "Successfully retrieved team information");
    return response;
  },
};
