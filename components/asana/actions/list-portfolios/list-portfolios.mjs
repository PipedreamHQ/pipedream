import asana from "../../asana.app.mjs";

export default {
  key: "asana-list-portfolios",
  name: "List Portfolios",
  description: "Returns a list of portfolios in the given workspace owned by the given user. Use this to discover portfolio GIDs before calling **Get Portfolio** or **List Portfolio Items**. Owner defaults to the authenticated user; regular API users can only list portfolios they own. [See the documentation](https://developers.asana.com/reference/getportfolios)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    asana,
    workspace: {
      label: "Workspace",
      description: "The workspace or organization to filter portfolios on. Use the **List Workspaces** action to find available workspace GIDs.",
      type: "string",
      propDefinition: [
        asana,
        "workspaces",
      ],
    },
    owner: {
      label: "Owner",
      description: "The user who owns the portfolios. Defaults to the authenticated user (`me`). Regular API users can only list portfolios they own; service accounts may specify any user.",
      type: "string",
      optional: true,
      propDefinition: [
        asana,
        "users",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
    },
    optFields: {
      propDefinition: [
        asana,
        "optFields",
      ],
      description: "Optional portfolio properties to include in the response (e.g. `created_at`, `due_on`, `members`). Nested paths are allowed; `gid` is always returned.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        asana,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    let hasMore, count = 0;
    const params = {
      workspace: this.workspace,
      owner: this.owner || "me",
      opt_fields: Array.isArray(this.optFields) && this.optFields.length
        ? this.optFields.join(",")
        : undefined,
      limit: 100,
    };
    const results = [];

    do {
      const {
        data, next_page: next,
      } = await this.asana.getPortfolios({
        params,
        $,
      });

      hasMore = next;
      params.offset = next?.offset;

      if (data.length === 0) break;

      for (const portfolio of data) {
        results.push(portfolio);
        if (++count >= this.maxResults) {
          hasMore = false;
          break;
        }
      }
    } while (hasMore);

    $.export("$summary", `${results.length} portfolio${results.length !== 1
      ? "s"
      : ""} retrieved${results.length >= this.maxResults
      ? " (maxResults reached)"
      : ""}`);
    return results;
  },
};
