import buildkite from "../../buildkite.app.mjs";

export default {
  key: "buildkite-list-organizations",
  name: "List Organizations",
  description: "Returns a list of organizations accessible by the API token. [See the documentation](https://buildkite.com/docs/apis/rest-api/organizations#list-organizations)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    buildkite,
    limit: {
      propDefinition: [
        buildkite,
        "limit",
      ],
    },
  },
  async run({ $ }) {
    const results = [];
    for await (const org of this.buildkite.paginate({
      $,
      path: "/organizations",
      max: this.limit,
    })) {
      results.push(org);
    }
    $.export("$summary", `Successfully retrieved ${results.length} organization(s)`);
    return results;
  },
};
