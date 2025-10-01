import app from "../../launchdarkly.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "launchdarkly-list-members",
  name: "List Members",
  description: "List all members in an account. [See the documentation](https://launchdarkly.com/docs/api/account-members/get-members).",
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
      description: "A list of filters. Each filter is of the form `field:value`. Example: `query:abc`. [See the documentation](https://launchdarkly.com/docs/api/account-members/get-members#filtering-members) for supported fields.",
      optional: true,
    },
    expand: {
      type: "string[]",
      label: "Expand",
      description: "A list of properties that can reveal additional information in the response",
      options: [
        "customRoles",
        "roleAttributes",
      ],
      optional: true,
    },
    sort: {
      type: "string",
      label: "Sort Field",
      description: "The field to sort by. Fields prefixed by a dash ( - ) sort in descending order.",
      options: [
        "displayName",
        "-displayName",
        "lastSeen",
        "-lastSeen",
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

    const members = this.app.paginate({
      fn: this.app.listAccountMembers,
      args: {
        $,
        params,
      },
      max: this.maxResults,
    });

    const results = [];
    for await (const member of members) {
      results.push(member);
    }

    $.export("$summary", `Found ${results.length} member${results.length === 1
      ? ""
      : "s"}`);
    return results;
  },
};
