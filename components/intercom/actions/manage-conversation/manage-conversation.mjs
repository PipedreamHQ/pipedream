// x-pd-ai: optimized
import { ConfigurationError } from "@pipedream/platform";
import {
  MESSAGE_TYPE_OPTIONS,
  TYPE_OPTIONS,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-manage-conversation",
  name: "Manage A Conversation",
  description: "Close, snooze, open, or assign a conversation by its ID. Which of the optional props apply depends on **Message Type**: `close` uses **Body**, `snoozed` uses **Snoozed Until**, `assignment` uses **Type** together with **Assignee ID** or **Team Assignee ID**, and `open` uses none of them. Example: set **Conversation ID** to `192783634529321`, **Message Type** to `close`, and **Body** to `Issue resolved` to close that conversation with a closing comment. [See the documentation](https://developers.intercom.com/docs/references/2.12/rest-api/api.intercom.io/conversations/manageconversation).",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    intercom,
    conversationId: {
      propDefinition: [
        intercom,
        "conversationId",
      ],
    },
    messageType: {
      type: "string",
      label: "Message Type",
      description: "The kind of message being created, which determines the operation performed on the conversation. Use `close` to close it, `snoozed` to snooze it, `open` to reopen it, or `assignment` to assign it.",
      options: MESSAGE_TYPE_OPTIONS,
    },
    adminId: {
      propDefinition: [
        intercom,
        "adminId",
      ],
    },
    type: {
      type: "string",
      label: "Type",
      description: "Whether an assignment targets an admin or a team. Only used when **Message Type** is `assignment`. Set `admin` to assign using **Assignee ID**, or `team` to assign using **Team Assignee ID**.",
      options: TYPE_OPTIONS,
      optional: true,
    },
    assigneeId: {
      propDefinition: [
        intercom,
        "adminId",
      ],
      label: "Assignee ID",
      description: "The `id` of the `admin` which will be assigned the conversation. Only used when **Message Type** is `assignment` and **Type** is `admin`. Set `0` to assign to no admin (ie. Unassigned).",
      optional: true,
    },
    teamAssigneeId: {
      propDefinition: [
        intercom,
        "teamAssigneeId",
      ],
      label: "Team Assignee ID",
      description: "The `id` of the `team` which will be assigned the conversation. Only used when **Message Type** is `assignment` and **Type** is `team`. Set `0` to assign to no team (ie. Unassigned).",
      optional: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text body of the comment. Used when **Message Type** is `close` or `assignment`.",
      optional: true,
    },
    snoozedUntil: {
      type: "string",
      label: "Snoozed Until",
      description: "The date and time the conversation will be snoozed until, as an ISO 8601 timestamp — for example `2026-08-24T18:30:00Z`. Only used when **Message Type** is `snoozed`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      conversationId,
      body,
      type,
      adminId,
      messageType,
      snoozedUntil,
      assigneeId,
      teamAssigneeId,
    } = this;

    let snoozedUntilTimestamp;
    if (snoozedUntil) {
      const parsed = Date.parse(snoozedUntil);
      if (Number.isNaN(parsed)) {
        throw new ConfigurationError("`Snoozed Until` must be a valid ISO 8601 timestamp");
      }
      snoozedUntilTimestamp = parsed / 1000;
    }

    if (messageType === "assignment") {
      if (type !== "admin" && type !== "team") {
        throw new ConfigurationError("`Type` must be `admin` or `team` when `Message Type` is `assignment`");
      }
      if (type === "admin" && assigneeId === undefined) {
        throw new ConfigurationError("`Assignee ID` is required when `Type` is `admin`");
      }
      if (type === "team" && teamAssigneeId === undefined) {
        throw new ConfigurationError("`Team Assignee ID` is required when `Type` is `team`");
      }
    }

    const response = await this.intercom.manageConversation({
      $,
      conversationId,
      data: {
        body,
        admin_id: adminId,
        message_type: messageType,
        type: messageType === "close"
          ? "admin"
          : type,
        snoozed_until: snoozedUntilTimestamp,
        // A team assignment carries the team's id in `assignee_id`; the admin and
        // team ids come from different props because they list different options.
        assignee_id: type === "team"
          ? teamAssigneeId
          : assigneeId,
      },
    });

    $.export("$summary", `Conversation ${conversationId} updated with message type "${messageType}"`);
    return response;
  },
};
