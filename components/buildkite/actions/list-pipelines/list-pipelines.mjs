import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-pipelines",
  name: "List Pipelines",
  description: "Returns a list of an organization's pipelines. [See the documentation](https://buildkite.com/docs/apis/rest-api/pipelines#list-pipelines)",
  version: "0.0.1",
  type: "action",
  props: {
    buildkite,
    organizationSlug: {
      propDefinition: [
        buildkite,
        "organizationSlug",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.buildkite._makeRequest({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines`,
    });
    $.export("$summary", `Found ${response.length} pipeline(s)`);
    return response;
  },
};
