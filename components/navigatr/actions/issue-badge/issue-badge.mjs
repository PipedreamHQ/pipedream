import app from "../../navigatr.app.mjs";

export default {
  key: "navigatr-issue-badge",
  name: "Issue Badge",
  description: "Issue a badge to a recipient. [See the documentation](https://api.navigatr.app/docs#/Badge/issue_badge_v1_badge__badge_id__issue_put)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    providerId: {
      propDefinition: [
        app,
        "providerId",
      ],
    },
    badgeId: {
      propDefinition: [
        app,
        "badgeId",
      ],
    },
    recipientHasAccount: {
      propDefinition: [
        app,
        "recipientHasAccount",
      ],
      reloadProps: true,
    },
    recipientId: {
      propDefinition: [
        app,
        "recipientId",
      ],
    },
    recipientEmail: {
      propDefinition: [
        app,
        "recipientEmail",
      ],
      disabled: true,
      hidden: true,
    },
    recipientFirstname: {
      propDefinition: [
        app,
        "recipientFirstname",
      ],
      disabled: true,
      hidden: true,
    },
    recipientLastname: {
      propDefinition: [
        app,
        "recipientLastname",
      ],
      disabled: true,
      hidden: true,
    },
  },
  async additionalProps(existingProps) {
    const props = {};
    if (!this.recipientHasAccount) {
      existingProps.recipientId.hidden = true;
      existingProps.recipientId.disabled = true;
      existingProps.recipientEmail.hidden = false;
      existingProps.recipientEmail.disabled = false;
      existingProps.recipientFirstname.hidden = false;
      existingProps.recipientFirstname.disabled = false;
      existingProps.recipientLastname.hidden = false;
      existingProps.recipientLastname.disabled = false;
    }
    return props;
  },
  async run({ $ }) {
    const response = await this.app.issueBadge({
      $,
      badgeId: this.badgeId,
      data: {
        provider_id: this.providerId,
        recipient_id: this.recipientId,
        recipient_email: this.recipientEmail,
        recipient_firstname: this.recipientFirstname,
        recipient_lastname: this.recipientLastname,
      },
    });
    $.export("$summary", "Successfully issued badge");
    return response;
  },
};
