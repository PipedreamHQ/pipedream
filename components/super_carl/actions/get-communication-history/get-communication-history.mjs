import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-get-communication-history",
  name: "Get Communication History",
  description: "Fetch prior Super Carl communication history for a target before drafting or sending. Use this to avoid duplicate outreach and to inspect recent Gmail, LinkedIn, X, Instagram, and Super Carl sends. [See the documentation](https://supercarl.ai/docs/endpoints)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    superCarl,
    targetUserId: {
      propDefinition: [
        superCarl,
        "targetUserId",
      ],
    },
    linkedinProfileUrl: {
      propDefinition: [
        superCarl,
        "linkedinProfileUrl",
      ],
    },
    linkedinUsername: {
      propDefinition: [
        superCarl,
        "linkedinUsername",
      ],
    },
    xProfileUrl: {
      propDefinition: [
        superCarl,
        "xProfileUrl",
      ],
    },
    xUsername: {
      propDefinition: [
        superCarl,
        "xUsername",
      ],
    },
    instagramProfileUrl: {
      propDefinition: [
        superCarl,
        "instagramProfileUrl",
      ],
    },
    instagramUsername: {
      propDefinition: [
        superCarl,
        "instagramUsername",
      ],
    },
    recipientEmail: {
      propDefinition: [
        superCarl,
        "recipientEmail",
      ],
    },
    channel: {
      type: "string",
      label: "History Channel",
      description: "Optional history filter. Use `all` for every channel or a specific channel such as `linkedin` or `gmail`.",
      optional: true,
      default: "all",
      options: [
        "all",
        "email",
        "gmail",
        "super_carl",
        "linkedin",
        "x",
        "instagram",
      ],
    },
    limit: {
      type: "integer",
      label: "Limit",
      description: "Maximum history rows to return.",
      optional: true,
      default: 12,
      min: 1,
      max: 50,
    },
    offset: {
      propDefinition: [
        superCarl,
        "offset",
      ],
    },
    historyFresh: {
      type: "boolean",
      label: "Refresh LinkedIn History",
      description: "When true, request a fresh LinkedIn history refresh if the target resolves to a Super Carl user.",
      optional: true,
      default: false,
    },
    delegateUserId: {
      propDefinition: [
        superCarl,
        "delegateUserId",
      ],
    },
  },
  async run({ $ }) {
    const data = cleanObject({
      target_user_id: this.targetUserId,
      linkedin_profile_url: this.linkedinProfileUrl,
      linkedin_username: this.linkedinUsername,
      x_profile_url: this.xProfileUrl,
      x_username: this.xUsername,
      instagram_profile_url: this.instagramProfileUrl,
      instagram_username: this.instagramUsername,
      recipient_email: this.recipientEmail,
      channel: this.channel,
      limit: this.limit,
      offset: this.offset,
      history_fresh: this.historyFresh,
      delegate_user_id: this.delegateUserId,
    });
    requireCommunicationTarget(data);

    const response = await this.superCarl.getCommunicationHistory({
      $,
      data,
    });

    $.export("$summary", `Found ${response?.total_count || 0} prior communications.`);
    return response;
  },
};
