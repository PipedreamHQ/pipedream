import { randomUUID } from "crypto";
import { ConfigurationError } from "@pipedream/platform";
import superCarl from "../../super_carl.app.mjs";
import {
  buildCommunicationPayload,
  parseObjectProp,
  requireCommunicationTarget,
} from "../../common/utils.mjs";

export default {
  key: "super_carl-create-communication-draft",
  name: "Create Communication Draft",
  description: "Save a durable Super Carl communication draft without sending it. Use **Check Communication Capabilities** first to pick the channel and target fields — the target must resolve to a known Super Carl person record, or the draft will be rejected. Use **Send Communication** only after a user has approved live delivery. [See the documentation](https://supercarl.ai/docs#endpoints-communications)",
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
    agentSessionId: {
      type: "string",
      label: "Agent Session ID",
      description: "Identifies the agent session that generated this draft, for example `agent_session_uuid`. Auto-generated when left blank — most callers have no reason to supply one.",
      optional: true,
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
      mode: "draft",
      draft: true,
      // Draft mode requires a session identifier to store the draft for
      // later review — generate one when the caller doesn't supply it.
      agent_session_id: this.agentSessionId || randomUUID(),
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
