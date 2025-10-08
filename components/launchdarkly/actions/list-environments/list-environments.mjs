import app from "../../launchdarkly.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "launchdarkly-list-environments",
  name: "List Environments",
  description: "List all environments. [See the documentation](https://launchdarkly.com/docs/api/environments/get-environments-by-project).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    projectKey: {
      propDefinition: [
        app,
        "project",
      ],
    },
    filter: {
      type: "string[]",
      label: "Filter",
      description: "A list of filters. Each filter is of the form `field:value`. Example: `query:abc`. [See the documentation](https://launchdarkly.com/docs/api/environments/get-environments-by-project#filtering-environments) for supported fields.",
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort by. Fields prefixed by a dash ( - ) sort in descending order.",
      options: [
        "createdOn",
        "-createdOn",
        "critical",
        "-critical",
        "name",
        "-name",
      ],
      optional: true,
    },
    maxResults: {
      propDefinition: [
        app,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    // validate array props
    if (this.filter && !Array.isArray(this.filter)) {
      throw new ConfigurationError("Filter must be an array");
    }

    const params = {
      filter: this.filter?.join(","),
      sort: this.sort,
    };

    const environments = this.app.paginate({
      fn: this.app.listEnvironments,
      args: {
        $,
        projectKey: this.projectKey,
        params,
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const environment of environments) {
      results.push(environment);
    }

    $.export("$summary", `Found ${results.length} environment${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
