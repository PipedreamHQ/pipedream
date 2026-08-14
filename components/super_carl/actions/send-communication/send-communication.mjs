// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import superCarl from "../../super_carl.app.mjs";
import {
  buildCommunicationPayload,
  parseObjectProp,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-send-communication",
  name: "Send Communication",
  description: "Create a Super Carl outbound communication and optionally send it through Gmail, LinkedIn, X, Instagram, or Super Carl channels. Dry Run defaults to true; set it to false only after **Check Communication Capabilities** passes and the user approves live delivery. [See the documentation](https://supercarl.ai/docs#endpoints-communications)",
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
    if (this.channel === "gmail_send" && !this.subject?.trim()) {
      throw new ConfigurationError("Subject is required when Channel is `gmail_send`.");
    }
    if (this.channel === "supercarl_referral_request" && !this.connectorUserId?.trim()) {
      throw new ConfigurationError("Connector User ID is required when Channel is `supercarl_referral_request`.");
    }
    const data = buildCommunicationPayload({
      channel: this.channel,
      message: this.message,
      subject: this.subject,
      targetUserId: this.targetUserId,
      linkedinProfileUrl: this.linkedinProfileUrl,
      linkedinUsername: this.linkedinUsername,
      xProfileUrl: this.xProfileUrl,
      xUsername: this.xUsername,
      instagramProfileUrl: this.instagramProfileUrl,
      instagramUsername: this.instagramUsername,
      recipientEmail: this.recipientEmail,
      connectorUserId: this.connectorUserId,
      context,
      idempotencyKey: this.idempotencyKey,
      delegateUserId: this.delegateUserId,
    }, {
      dry_run: this.dryRun,
      wait_ms: this.waitMs,
      wait_until: this.waitUntil,
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
