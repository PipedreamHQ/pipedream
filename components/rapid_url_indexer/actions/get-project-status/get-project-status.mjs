import rapidUrlIndexer from "../../rapid_url_indexer.app.mjs";

export default {
  key: "rapid_url_indexer-get-project-status",
  name: "Get Project Status",
  description: "Get the status of a specific project. [See the documentation](https://rapidurlindexer.com/indexing-api/).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    rapidUrlIndexer,
    projectId: {
      propDefinition: [
        rapidUrlIndexer,
        "projectId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.rapidUrlIndexer.getProjectStatus({
      $,
      projectId: this.projectId,
    });
    if (response.id) {
      $.export("$summary", `Successfully retrieved status for Project with ID ${response.id}`);
    }
    return response;
  },
};
