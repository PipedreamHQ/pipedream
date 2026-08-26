import xrayCloud from "../../xray_cloud.app.mjs";

export default {
  key: "xray_cloud-get-test-executions",
  name: "Get Test Executions",
  description:
    "Search and retrieve Xray test executions with their run statuses. Use JQL to filter. [See the documentation](https://docs.getxray.app/display/XRAYCLOUD/GraphQL+API)",
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
    const response = await this.xrayCloud.getTestExecutions({
      $,
      jql: this.jql,
      limit: this.limit,
      start: this.start,
    });
    const count = response?.getTestExecutions?.results?.length ?? 0;
    $.export("$summary", `Successfully retrieved ${count} test execution(s)`);
    return response;
  },
};
