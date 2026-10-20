import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-find-members",
  name: "Find Members",
  description: "Lists the members of the workspace, or finds one by name or email, with their role. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": true,
  },
  props: {
    app,
    query: {
      type: "string",
      label: "Name or Email",
      description: "Partial, case-insensitive match on the member's name or email.",
      optional: true,
    },
    role: {
      type: "string",
      label: "Role",
      description: "Only members with this role, one of owner, admin, editor, analyst, viewer, billing or custom.",
      options: [
        "owner",
        "admin",
        "editor",
        "analyst",
        "viewer",
        "billing",
        "custom",
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
    let items = await this.app.paginate({
      $,
      path: await this.app.workspacePath({
        $,
        path: "/members.json",
      }),
      params: utils.compact({
        query: this.query,
        role: this.role,
      }),
      maxResults: this.maxResults,
    });
    $.export("$summary", `Found ${items.length} member${items.length === 1
      ? ""
      : "s"}`);
    return items;
  },
};
