import toggl from "../../toggl.app.mjs";
import { filterWorkspaceUsers } from "../../common/utils.mjs";

export default {
  key: "toggl-list-workspace-users",
  name: "List Workspace Users",
  description: "List users visible to the connected Toggl Track account in a workspace with authoritative returned and unique counts. Optionally filter by a full or partial name or email address. Use the returned `userId` with **Search Detailed Time Entries**, **Get Time Entry Summary**, or **Get Project Activity**. [See the documentation](https://engineering.toggl.com/docs/track/api/workspaces/)",
  version: "1.0.0",
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
    const userIds = new Set();

    for (const user of users) {
      if (!Number.isSafeInteger(user.userId) || user.userId < 1) {
        throw new Error("Toggl returned a workspace user without a valid user ID.");
      }

      if (userIds.has(user.userId)) {
        throw new Error(`Toggl returned duplicate workspace user ID ${user.userId}.`);
      }

      userIds.add(user.userId);
    }

    const result = {
      users,
      returnedCount: users.length,
      uniqueUserCount: userIds.size,
      duplicateCount: 0,
      complete: true,
      ...this.query && {
        query: this.query,
      },
    };

    $.export("$summary", `Found ${result.returnedCount} unique workspace ${result.returnedCount === 1
      ? "user"
      : "users"}`);

    return result;
  },
};
