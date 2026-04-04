import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-organizations",
  name: "List Organizations",
  description: "Returns a list of organizations accessible by the API token. [See the documentation](https://buildkite.com/docs/apis/rest-api/organizations#list-organizations)",
  version: "0.0.1",
  type: "action",
  props: {
    buildkite,
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: "/organizations",
    });
    $.export("$summary", `Found ${response.length} organization(s)`);
    return response;
  },
};
