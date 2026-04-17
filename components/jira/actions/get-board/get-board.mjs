import jira from "../../jira.app.mjs";

export default {
  key: "jira-get-board",
  name: "Get Board",
  description: "Returns the board for the given board ID. [See the documentation](https://developer.atlassian.com/cloud/jira/software/rest/api-group-board/#api-rest-agile-1-0-board-boardid-get)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    readOnlyHint: true,
    openWorldHint: true,
  },
  props: {
    jira,
    cloudId: {
      propDefinition: [
        jira,
        "cloudId",
      ],
    },
    boardId: {
      propDefinition: [
        jira,
        "boardId",
        (c) => ({
          cloudId: c.cloudId,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.jira.getBoard({
      $,
      cloudId: this.cloudId,
      boardId: this.boardId,
    });
    let browserUrl;
    try {
      const baseUrl = await this.jira.getCloudBaseUrl(this.cloudId);
      const projectKey = response.location?.projectKey;
      browserUrl = baseUrl && projectKey
        ? `${baseUrl}/jira/software/projects/${projectKey}/boards/${this.boardId}`
        : undefined;
    } catch (e) {
      console.log("Could not enrich response with browser URL", e.message);
    }

    $.export("$summary", `Successfully retrieved board with ID ${this.boardId}`);
    return {
      ...response,
      browserUrl,
    };
  },
};
