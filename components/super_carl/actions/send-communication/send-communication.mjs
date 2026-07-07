import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-send-communication",
  name: "Send Communication",
  description: "Create a Super Carl outbound communication and optionally send it through Gmail, LinkedIn, X, or Super Carl channels. Dry Run defaults to true; set it to false only after **Check Communication Capabilities** passes and the user approves live delivery. [See the documentation](https://supercarl.ai/docs/endpoints)",
  version: "0.0.1",
  annotations: {
    destructiveHint: true,
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
    dryRun: {
      type: "boolean",
      label: "Dry Run",
      description: "Create and validate the communication without live delivery. Defaults to true; set false only for approved sends.",
      optional: true,
      default: true,
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
      channel: this.channel,
      message: this.message,
      dry_run: this.dryRun,
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

    const mode = this.dryRun
      ? "dry-run communication"
      : "communication";
    $.export("$summary", `Created ${mode} ${response?.id || ""}`.trim());
    return response;
  },
};
