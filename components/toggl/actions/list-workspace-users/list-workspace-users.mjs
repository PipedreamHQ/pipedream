import toggl from "../../toggl.app.mjs";
import { filterWorkspaceUsers } from "../../common/utils.mjs";

export default {
  key: "toggl-list-workspace-users",
  name: "List Workspace Users",
  description: "List users visible to the connected Toggl Track account in a workspace. Optionally filter by a full or partial name or email address. Use the returned `userId` as a User IDs value in **Search Detailed Time Entries**, **Get Time Entry Summary**, or **Export Detailed Time Entries**. [See the documentation](https://engineering.toggl.com/docs/track/api/workspaces/)",
  version: "0.0.1",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    toggl,
    workspaceId: {
      propDefinition: [
        toggl,
        "workspaceId",
      ],
    },
    query: {
      type: "string",
      label: "Name or Email",
      description: "Optional full or partial user name or email address, e.g. `Angus`. Matching is case-insensitive.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.toggl.getWorkspaceUsers({
      workspaceId: this.workspaceId,
      $,
    });

    if (!Array.isArray(response)) {
      throw new Error("Toggl returned an invalid workspace users response.");
    }

    const users = filterWorkspaceUsers(response, this.query);

    $.export("$summary", `Found ${users.length} workspace ${users.length === 1
      ? "user"
      : "users"}`);

    return users;
  },
};
