import superCarl from "../../super_carl.app.mjs";
import {
  cleanObject,
  parseObjectProp,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-send-communication",
  name: "Send Communication",
  description: "Create a Super Carl outbound communication and optionally send it through Gmail, LinkedIn, X, Instagram, or Super Carl channels. Dry Run defaults to true; set it to false only after **Check Communication Capabilities** passes and the user approves live delivery. [See the documentation](https://supercarl.ai/docs/endpoints)",
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
    subject: {
      propDefinition: [
        superCarl,
        "subject",
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
    connectorUserId: {
      propDefinition: [
        superCarl,
        "connectorUserId",
      ],
    },
    context: {
      propDefinition: [
        superCarl,
        "context",
      ],
    },
    idempotencyKey: {
      propDefinition: [
        superCarl,
        "idempotencyKey",
      ],
    },
    waitMs: {
      propDefinition: [
        superCarl,
        "waitMs",
      ],
    },
    waitUntil: {
      propDefinition: [
        superCarl,
        "waitUntil",
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
    const context = parseObjectProp(this.context, "Context");
    const data = cleanObject({
      channel: this.channel,
      message: this.message,
      dry_run: this.dryRun,
      subject: this.subject,
      target_user_id: this.targetUserId,
      linkedin_profile_url: this.linkedinProfileUrl,
      linkedin_username: this.linkedinUsername,
      x_profile_url: this.xProfileUrl,
      x_username: this.xUsername,
      instagram_profile_url: this.instagramProfileUrl,
      instagram_username: this.instagramUsername,
      recipient_email: this.recipientEmail,
      connector_user_id: this.connectorUserId,
      context,
      idempotency_key: this.idempotencyKey,
      wait_ms: this.waitMs,
      wait_until: this.waitUntil,
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
