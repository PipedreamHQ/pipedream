import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-pipelines",
  name: "List Pipelines",
  description: "Returns a list of an organization's pipelines. [See the documentation](https://buildkite.com/docs/apis/rest-api/pipelines#list-pipelines)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildkite,
    organizationSlug: {
      propDefinition: [
        buildkite,
        "organizationSlug",
      ],
    },
    limit: {
      propDefinition: [
        buildkite,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const results = [];
    for await (const pipeline of this.buildkite.paginate({
      $,
      path: `/organizations/${this.organizationSlug}/pipelines`,
      max: this.limit,
    })) {
      results.push(pipeline);
    }
    $.export("$summary", `Successfully retrieved ${results.length} pipeline(s)`);
    return results;
  },
};
