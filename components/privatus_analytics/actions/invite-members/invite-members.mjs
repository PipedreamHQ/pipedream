import app from "../../privatus_analytics.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "privatus_analytics-invite-members",
  name: "Invite Members",
  description: "Invites people to the workspace by email. Each gets an invitation link valid for 14 days. [See the documentation](https://privatusanalytics.com/docs/api)",
  version: "0.0.1",
  type: "action",
  annotations: {
    "destructiveHint": false,
    "openWorldHint": true,
    "readOnlyHint": false,
  },
  props: {
    app,
    emails: {
      type: "string[]",
      label: "Emails",
      description: "Up to 50 email addresses. Addresses that are already members are skipped.",
    },
    role: {
      type: "string",
      label: "Role",
      description: "Role for the invited people, one of admin, editor, analyst, viewer, billing or custom. Default viewer. Use custom together with custom_role_id. Owner cannot be invited.",
      options: [
        "admin",
        "editor",
        "analyst",
        "viewer",
        "billing",
      ],
      default: "viewer",
      optional: true,
    },
    allSites: {
      type: "boolean",
      label: "All Sites",
      description: "Whether they may open every site, including future ones. Turn it off to limit them to **Sites**.",
      default: true,
      optional: true,
    },
    siteIds: {
      type: "string[]",
      label: "Sites",
      description: "The sites they may open, as site IDs like `pa_7Q2K9XH3AB`. Only used when **All Sites** is off.",
      optional: true,
    },
  },
  async run({ $ }) {
    const workspaceId = await this.app.getWorkspaceId({
      $,
    });
    const response = await this.app.request({
      $,
      method: "POST",
      path: `/workspaces/${workspaceId}/invitations.json`,
      data: utils.compact({
        emails: utils.toList(this.emails),
        role: this.role,
        all_sites: this.allSites,
        site_ids: utils.toList(this.siteIds),
      }),
    });
    $.export("$summary", `Successfully invited ${(response || []).length || this.emails.length} people`);
    return response;
  },
};
