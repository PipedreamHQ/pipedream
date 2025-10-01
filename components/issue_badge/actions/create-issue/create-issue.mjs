import issueBadge from "../../issue_badge.app.mjs";

export default {
  key: "issue_badge-create-issue",
  name: "Create Issue",
  description: "Create a new issue [See the documentation](https://documenter.getpostman.com/view/19911979/2sA2r9X4Aj#b5b9801a-432d-4d2e-96ef-a9fb2d2d2a94)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    issueBadge,
    name: {
      type: "string",
      label: "Name",
      description: "The name of the issue",
    },
    badgeId: {
      propDefinition: [
        issueBadge,
        "badgeId",
      ],
    },
    email: {
      type: "string",
      label: "Email",
      description: "The email of the recipient",
      optional: true,
    },
    phone: {
      type: "string",
      label: "Phone",
      description: "The phone number of the recipient",
      optional: true,
    },
  },
  async run({ $ }) {
    const result = await this.issueBadge.createIssue({
      $,
      data: {
        name: this.name,
        badge_id: this.badgeId,
        email: this.email,
        phone: this.phone,
      },
    });

    $.export("$summary", `Successfully created issue with ID: ${result.IssueId}`);
    return result;
  },
};
