import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-create-communication-draft",
  name: "Create Communication Draft",
  description: "Save a durable Super Carl communication draft without sending it. Use **Check Communication Capabilities** first to pick the channel and target fields; use **Send Communication** only after a user has approved live delivery. [See the documentation](https://supercarl.ai/docs/endpoints)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    superCarl,
    channel: {
      propDefinition: [
        superCarl,
        "communicationChannel",
      ],
    },
    message: {
      propDefinition: [
        superCarl,
        "message",
      ],
    },
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
    recipientEmail: {
      propDefinition: [
        superCarl,
        "recipientEmail",
      ],
    },
    connectorUserId: {
      propDefinition: [
        superCarl,
        "connectorUserId",
      ],
    },
    idempotencyKey: {
      propDefinition: [
        superCarl,
        "idempotencyKey",
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
      mode: "draft",
      draft: true,
      channel: this.channel,
      message: this.message,
      target_user_id: this.targetUserId,
      linkedin_profile_url: this.linkedinProfileUrl,
      linkedin_username: this.linkedinUsername,
      x_profile_url: this.xProfileUrl,
      x_username: this.xUsername,
      recipient_email: this.recipientEmail,
      connector_user_id: this.connectorUserId,
      idempotency_key: this.idempotencyKey,
      delegate_user_id: this.delegateUserId,
    });
    requireCommunicationTarget(data);

    const response = await this.superCarl.createCommunication({
      $,
      data,
    });

    $.export("$summary", `Created communication draft ${response?.id || ""}`.trim());
    return response;
  },
};
