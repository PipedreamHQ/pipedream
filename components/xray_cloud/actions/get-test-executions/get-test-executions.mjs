import xrayCloud from "../../xray_cloud.app.mjs";

export default {
  key: "xray_cloud-get-test-executions",
  name: "Get Test Executions",
  description:
    "Search and retrieve Xray test executions with their run statuses. Use JQL to filter. [See the documentation](https://docs.getxray.app/display/XRAYCLOUD/GraphQL+API)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: false,
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
  },
  async run({ $ }) {
    const response = await this.xrayCloud.getTestExecutions({
      $,
      jql: this.jql,
      limit: this.limit,
    });
    const total = response?.data?.getTestExecutions?.total ?? 0;
    $.export("$summary", `Successfully retrieved ${total} test execution(s)`);
    return response;
  },
};
