import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-check-communication-capabilities",
  name: "Check Communication Capabilities",
  description: "Check which Super Carl communication channels are available for a target before sending a message. Returns the list of channels with their `can_send` status, recipient email, and connector user IDs. [See the documentation](https://supercarl.ai/docs/endpoints)",
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
    channels: {
      propDefinition: [
        superCarl,
        "communicationChannels",
      ],
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
      channels: this.channels,
      delegate_user_id: this.delegateUserId,
    });
    requireCommunicationTarget(data);

    const response = await this.superCarl.getCommunicationCapabilities({
      $,
      data,
    });

    const readyChannels = Array.isArray(response?.channels)
      ? response.channels.filter((channel) => channel?.can_send === true)
      : [];
    $.export("$summary", `Found ${readyChannels.length} ready communication channels.`);
    return response;
  },
};
