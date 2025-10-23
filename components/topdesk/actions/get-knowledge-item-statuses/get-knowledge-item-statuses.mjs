import app from "../../topdesk.app.mjs";

export default {
  key: "topdesk-get-knowledge-item-statuses",
  name: "Get Knowledge Item Statuses",
  description: "Returns the list of possible Knowledge Item statuses. [See the documentation](https://developers.topdesk.com/explorer/?page=knowledge-base#/Searchlists/getStatuses)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    archived: {
      type: "boolean",
      label: "Archived",
      description: "Whether to show archived entries. Leave unset for all entries, or specify true/false for only archived or only active entries, respectively.",
      optional: true,
    },
  },
  annotations: {
    readOnlyHint: true,
    destructiveHint: false,
    openWorldHint: true,
    idempotentHint: true,
  },
  async run({ $ }) {
    const {
      app,
      archived,
    } = this;

    const response = await app.listKnowledgeItemStatuses({
      $,
      params: {
        archived,
      },
    });

    const statusCount = response.results?.length || 0;
    $.export("$summary", `Successfully retrieved \`${statusCount}\` knowledge item status(es)`);

    return response;
  },
};
