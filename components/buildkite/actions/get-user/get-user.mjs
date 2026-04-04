import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-get-user",
  name: "Get Current User",
  description: "Returns basic details about the user account that sent the request. [See the documentation](https://buildkite.com/docs/apis/rest-api/user)",
  version: "0.2.0",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildkite,
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: "/user",
    });
    $.export("$summary", `Successfully retrieved user: ${response.name}`);
    return response;
  },
};
