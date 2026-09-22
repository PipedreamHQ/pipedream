import { ConfigurationError } from "@pipedream/platform";
import fathom from "../../fathom.app.mjs";

export default {
  key: "fathom-list-users",
  name: "List Users and Permissions",
  description: "List the users on the account and their admin permissions (settings access level and view access). **Admin-only** — the connected account must have `account_admin` settings access, or the request fails with a 403 error. Use **List Teams** to find a valid team name to filter by. [See the documentation](https://developers.fathom.ai/api-reference/users/list-users-and-their-permissions)",
  version: "0.0.2",
  type: "action",
  ai: "optimized",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    fathom,
    teamName: {
      propDefinition: [
        fathom,
        "teamName",
      ],
    },
    status: {
      type: "string",
      label: "Status",
      description: "Filter by user account status. `invited` cannot be combined with **Settings Access Level**.",
      optional: true,
      options: [
        "active",
        "deactivated",
        "invited",
      ],
    },
    settingsAccess: {
      type: "string",
      label: "Settings Access Level",
      description: "Filter by admin settings access level.",
      optional: true,
      options: [
        "none",
        "team_admin",
        "account_admin",
      ],
    },
    cursor: {
      propDefinition: [
        fathom,
        "cursor",
      ],
    },
  },
  async run({ $ }) {
    if (this.status === "invited" && this.settingsAccess) {
      throw new ConfigurationError("The `invited` Status filter cannot be combined with Settings Access Level.");
    }

    const response = await this.fathom.listUsers({
      $,
      params: {
        team: this.teamName,
        status: this.status,
        settings_access: this.settingsAccess,
        cursor: this.cursor,
      },
    });
    $.export("$summary", `Found ${response?.items?.length} users`);
    return response;
  },
};
