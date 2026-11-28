import xrayCloud from "../../xray_cloud.app.mjs";

export default {
  key: "xray_cloud-get-tests",
  name: "Get Tests",
  description:
    "Search and retrieve Xray test cases. Use JQL to filter by project, labels, or other Jira fields. [See the documentation](https://docs.getxray.app/display/XRAYCLOUD/GraphQL+API)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    xrayCloud,
    jql: {
      propDefinition: [
        xrayCloud,
        "jql",
      ],
    },
    limit: {
      propDefinition: [
        xrayCloud,
        "limit",
      ],
    },
    start: {
      propDefinition: [
        xrayCloud,
        "start",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.xrayCloud.getTests({
      $,
      jql: this.jql,
      limit: this.limit,
      start: this.start,
    });
    const count = response?.getTests?.results?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} test(s)`);
    return response;
  },
};
