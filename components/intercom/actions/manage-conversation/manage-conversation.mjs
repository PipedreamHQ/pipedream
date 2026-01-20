import {
  MESSAGE_TYPE_OPTIONS,
  TYPE_OPTIONS,
} from "../../common/constants.mjs";
import intercom from "../../intercom.app.mjs";

export default {
  key: "intercom-manage-conversation",
  name: "Manage A Conversation",
  description: "Close/Snooze/Open/Assign a conversation by its ID. [See the documentation](https://developers.intercom.com/docs/references/2.12/rest-api/api.intercom.io/conversations/manageconversation).",
  version: "0.0.1",
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
      description: "The kind of message being created.",
      reloadProps: true,
      options: MESSAGE_TYPE_OPTIONS,
    },
    type: {
      type: "string",
      label: "Type",
      description: "The type of the message being created.",
      options: TYPE_OPTIONS,
      reloadProps: true,
      hidden: true,
    },
    adminId: {
      propDefinition: [
        intercom,
        "adminId",
      ],
    },
    assigneeId: {
      propDefinition: [
        intercom,
        "adminId",
      ],
      label: "Assignee ID",
      description: "The `id` of the `admin` which will be assigned the conversation. A conversation can be assigned both an admin and a team.\nSet `0` if you want this assign to no admin (ie. Unassigned).",
      hidden: true,
    },
    teamAssigneeId: {
      propDefinition: [
        intercom,
        "teamAssigneeId",
      ],
      hidden: true,
    },
    body: {
      type: "string",
      label: "Body",
      description: "The text body of the comment.",
      hidden: true,
      optional: true,
    },
    snoozedUntil: {
      type: "string",
      label: "Snoozed Until",
      description: "The date and time the conversation will be snoozed until. Format: YYYY-MM-DDTHH:MM:SSZ",
      hidden: true,
      optional: true,
    },
  },
  additionalProps(props) {
    props.type.hidden = true;
    props.body.hidden = true;
    props.snoozedUntil.hidden = true;
    props.assigneeId.hidden = true;

    switch (this.messageType) {
    case "snoozed":
      props.snoozedUntil.hidden = false;
      break;
    case "close":
      props.body.hidden = false;
      break;
    case "assignment":
      props.type.hidden = false;
      props.body.hidden = false;
      props.assigneeId.hidden = false;

      if (this.type === "team") {
        props.teamAssigneeId.hidden = false;
        props.assigneeId.hidden = true;
      } else if (this.type === "admin") {
        props.teamAssigneeId.hidden = true;
        props.assigneeId.hidden = false;
      }
      break;
    }
    return {};
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
        assignee_id: assigneeId,
      },
    });

    $.export("$summary", "Conversation managed successfully");
    return response;
  },
};
