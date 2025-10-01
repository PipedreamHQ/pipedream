import app from "../../launchdarkly.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "launchdarkly-list-feature-flags",
  name: "List Feature Flags",
  description: "List all feature flags. [See the documentation](https://launchdarkly.com/docs/api/feature-flags/get-feature-flags).",
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
    environmentKey: {
      propDefinition: [
        app,
        "environment",
        ({ projectKey }) => ({
          projectKey,
        }),
      ],
    },
    filter: {
      type: "string[]",
      label: "Filter",
      description: "A list of filters. Each filter is of the form `field:value`. Example: `query:dark-mode`. [See the documentation](https://launchdarkly.com/docs/api/feature-flags/get-feature-flags#filtering-flags) for supported fields.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "A list of properties that can reveal additional information in the response",
      options: [
        "codeReferences",
        "evaluation",
        "migrationSettings",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort by. Fields prefixed by a dash ( - ) sort in descending order.",
      options: [
        "creationDate",
        "-creationDate",
        "key",
        "-key",
        "maintainerId",
        "-maintainerId",
        "name",
        "-name",
        "tags",
        "-tags",
        "targetingModifiedDate",
        "-targetingModifiedDate",
        "type",
        "-type",
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
      env: this.environmentKey,
    };

    const flags = this.app.paginate({
      fn: this.app.listFeatureFlags,
      args: {
        $,
        projectKey: this.projectKey,
        params,
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const flag of flags) {
      results.push(flag);
    }

    $.export("$summary", `Found ${results.length} feature flag${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
