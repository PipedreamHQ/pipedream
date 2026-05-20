import app from "../../lever_oauth.app.mjs";

export default {
  key: "lever_oauth-list-stages",
  name: "List Stages",
  description:
    "Returns all pipeline stages configured in the Lever account."
    + " Use this to resolve stage names to IDs before filtering candidates with **Search Opportunities**, moving a candidate with **Update Opportunity Stage**, or creating an opportunity at a specific stage."
    + " Returns each stage's id and text (display name)."
    + " [See the documentation](https://hire.lever.co/developer/documentation#list-all-stages)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    app,
    limit: {
      propDefinition: [
        app,
        "limit",
      ],
      description: "Maximum number of stages to return (1–100). Defaults to 100.",
    },
  },
  async run({ $ }) {
    const response = await this.app.listStages({
      $,
      params: {
        limit: this.limit,
      },
    });
    const stages = response.data ?? response;
    $.export("$summary", `Retrieved ${stages.length} stage${stages.length === 1
      ? ""
      : "s"}`);
    return stages;
  },
};
