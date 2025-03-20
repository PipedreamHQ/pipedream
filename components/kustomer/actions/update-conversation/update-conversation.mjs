import kustomer from "../../kustomer.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "kustomer-update-conversation",
  name: "Update Conversation",
  description: "Updates an existing conversation in Kustomer. [See the documentation]().",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    kustomer,
    conversationId: {
      propDefinition: [
        kustomer,
        "conversationId",
      ],
    },
    externalId: {
      propDefinition: [
        kustomer,
        "externalId",
      ],
      optional: true,
    },
    name: {
      propDefinition: [
        kustomer,
        "name",
      ],
      optional: true,
    },
    direction: {
      propDefinition: [
        kustomer,
        "direction",
      ],
      optional: true,
    },
    priority: {
      propDefinition: [
        kustomer,
        "priority",
      ],
      optional: true,
    },
    satisfaction: {
      propDefinition: [
        kustomer,
        "satisfaction",
      ],
      optional: true,
    },
    satisfactionLevel: {
      propDefinition: [
        kustomer,
        "satisfactionLevel",
      ],
      optional: true,
    },
    suggestedShortcuts: {
      propDefinition: [
        kustomer,
        "suggestedShortcuts",
      ],
      optional: true,
    },
    status: {
      propDefinition: [
        kustomer,
        "status",
      ],
      optional: true,
    },
    replyChannel: {
      propDefinition: [
        kustomer,
        "replyChannel",
      ],
      optional: true,
    },
    subStatus: {
      propDefinition: [
        kustomer,
        "subStatus",
      ],
      optional: true,
    },
    snooze: {
      propDefinition: [
        kustomer,
        "snooze",
      ],
      optional: true,
    },
    tags: {
      propDefinition: [
        kustomer,
        "tags",
      ],
      optional: true,
    },
    suggestedTags: {
      propDefinition: [
        kustomer,
        "suggestedTags",
      ],
      optional: true,
    },
    sentiment: {
      propDefinition: [
        kustomer,
        "sentiment",
      ],
      optional: true,
    },
    assignedUsers: {
      propDefinition: [
        kustomer,
        "assignedUsers",
      ],
      optional: true,
    },
    assignedTeams: {
      propDefinition: [
        kustomer,
        "assignedTeams",
      ],
      optional: true,
    },
    deleted: {
      propDefinition: [
        kustomer,
        "deleted",
      ],
      optional: true,
    },
    ended: {
      propDefinition: [
        kustomer,
        "ended",
      ],
      optional: true,
    },
    endedAt: {
      propDefinition: [
        kustomer,
        "endedAt",
      ],
      optional: true,
    },
    endedReason: {
      propDefinition: [
        kustomer,
        "endedReason",
      ],
      optional: true,
    },
    endedBy: {
      propDefinition: [
        kustomer,
        "endedBy",
      ],
      optional: true,
    },
    endedByType: {
      propDefinition: [
        kustomer,
        "endedByType",
      ],
      optional: true,
    },
    locked: {
      propDefinition: [
        kustomer,
        "locked",
      ],
      optional: true,
    },
    rev: {
      propDefinition: [
        kustomer,
        "rev",
      ],
      optional: true,
    },
    defaultLang: {
      propDefinition: [
        kustomer,
        "defaultLang",
      ],
      optional: true,
    },
    queue: {
      propDefinition: [
        kustomer,
        "queue",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.kustomer.updateConversation({
      conversationId: this.conversationId,
      externalId: this.externalId,
      name: this.name,
      direction: this.direction,
      priority: this.priority,
      satisfaction: this.satisfaction,
      satisfactionLevel: this.satisfactionLevel,
      suggestedShortcuts: this.suggestedShortcuts,
      status: this.status,
      replyChannel: this.replyChannel,
      subStatus: this.subStatus,
      snooze: this.snooze,
      tags: this.tags,
      suggestedTags: this.suggestedTags,
      sentiment: this.sentiment,
      assignedUsers: this.assignedUsers,
      assignedTeams: this.assignedTeams,
      deleted: this.deleted,
      ended: this.ended,
      endedAt: this.endedAt,
      endedReason: this.endedReason,
      endedBy: this.endedBy,
      endedByType: this.endedByType,
      locked: this.locked,
      rev: this.rev,
      defaultLang: this.defaultLang,
      queue: this.queue,
    });

    $.export("$summary", `Conversation ${this.conversationId} updated successfully`);
    return response;
  },
};
