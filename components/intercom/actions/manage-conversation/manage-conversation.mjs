import {
  MESSAGE_TYPE_OPTIONS,
  TYPE_OPTIONS,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-manage-conversation",
  name: "Manage A Conversation",
  description: "Close, snooze, open, or assign a conversation by its ID. Which of the optional props apply depends on **Message Type**: `close` uses **Body**, `snoozed` uses **Snoozed Until**, `assignment` uses **Type** together with **Assignee ID** or **Team Assignee ID**, and `open` uses none of them. [See the documentation](https://developers.intercom.com/docs/references/2.12/rest-api/api.intercom.io/conversations/manageconversation).",
  version: "0.1.0",
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
      description: "The kind of message being created, which determines the operation performed on the conversation.",
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
      description: "The date and time the conversation will be snoozed until. Only used when **Message Type** is `snoozed`. Format: YYYY-MM-DDTHH:MM:SSZ",
      optional: true,
    },
  },
  methods: {
    manageConversation({
      conversationId, ...args
    } = {}) {
      return this.intercom.makeRequest({
        method: "POST",
        endpoint: `conversations/${conversationId}/parts`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      manageConversation,
      conversationId,
      body,
      type,
      adminId,
      messageType,
      snoozedUntil,
      assigneeId,
      teamAssigneeId,
    } = this;

    const response = await manageConversation({
      $,
      conversationId,
      data: {
        body,
        admin_id: adminId,
        message_type: messageType,
        type: messageType === "close"
          ? "admin"
          : type,
        snoozed_until: snoozedUntil && Date.parse(snoozedUntil) / 1000,
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
