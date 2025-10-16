import app from "../../launchdarkly.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "launchdarkly-list-projects",
  name: "List Projects",
  description: "List all projects. [See the documentation](https://launchdarkly.com/docs/api/projects/get-projects).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    filter: {
      type: "string[]",
      label: "Filter",
      description: "A list of filters. Each filter is of the form `field:value`. Example: `query:abc`. [See the documentation](https://launchdarkly.com/docs/api/projects/get-projects#filtering-projects) for supported fields.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "A list of properties that can reveal additional information in the response",
      options: [
        "environments",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort by. Fields prefixed by a dash ( - ) sort in descending order.",
      options: [
        "createdOn",
        "-createdOn",
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
    if (this.expand && !Array.isArray(this.expand)) {
      throw new ConfigurationError("Expand must be an array");
    }

    const params = {
      filter: this.filter?.join(","),
      expand: this.expand?.join(","),
      sort: this.sort,
    };

    const projects = this.app.paginate({
      fn: this.app.listProjects,
      args: {
        $,
        params,
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const project of projects) {
      results.push(project);
    }

    $.export("$summary", `Found ${results.length} project${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
