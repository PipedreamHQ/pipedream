import { ConfigurationError } from "@pipedream/platform";
import {
  PRIORITY_OPTIONS,
  STATUS_OPTIONS,
} from "../../common/constants.mjs";
import app from "../../unthread.app.mjs";

export default {
  key: "unthread-create-conversation",
  name: "Create Conversation",
  description: "Create a new Conversation. [See the documentation](https://docs.unthread.io/api-introduction/using-api#create-conversation)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    type: {
      type: "string",
      label: "Type",
      description: "Type of the conversation",
      options: [
        "triage",
        "email",
      ],
      reloadProps: true,
    },
    markdown: {
      type: "string",
      label: "Markdown",
      description: "Markdown of the conversation",
    },
    status: {
      type: "string",
      label: "Status",
      description: "Status of the conversation",
      options: STATUS_OPTIONS,
    },
    assignedToUserId: {
      propDefinition: [
        app,
        "userId",
      ],
      optional: true,
    },
    customerId: {
      propDefinition: [
        app,
        "customerId",
      ],
      optional: true,
    },
    priority: {
      type: "integer",
      label: "Priority",
      description: "Priority of the conversation",
      options: PRIORITY_OPTIONS,
      optional: true,
    },
    triageChannelId: {
      propDefinition: [
        app,
        "triageChannelId",
      ],
      hidden: true,
    },
    notes: {
      type: "string",
      label: "Notes",
      description: "Notes of the conversation",
      optional: true,
    },
    title: {
      type: "string",
      label: "Title",
      description: "Title of the conversation",
      optional: true,
    },
    excludeAnalytics: {
      type: "boolean",
      label: "Exclude Analytics",
      description: "Exclude Analytics for this conversation",
      optional: true,
    },
    emailInboxId: {
      type: "string",
      label: "Email Inbox Id",
      description: "ID of the Email Inbox",
      hidden: true,
    },
    onBehalfOfEmail: {
      type: "string",
      label: "On Behalf Of Email",
      description: "Email on behalf of which the conversation is created",
      optional: true,
    },
    onBehalfOfName: {
      type: "string",
      label: "On Behalf Of Name",
      description: "Name on behalf of which the conversation is created",
      optional: true,
    },
    onBehalfOfId: {
      type: "string",
      label: "On Behalf Of ID",
      description: "ID on behalf of which the conversation is created",
      optional: true,
    },
  },
  async additionalProps(props) {
    const isTriage = this.type === "triage";
    props.triageChannelId.hidden = !isTriage;
    props.emailInboxId.hidden = isTriage;

    return {};
  },
  async run({ $ }) {
    if (this.type === "email" && (!this.onBehalfOfEmail && !this.onBehalfOfId)) {
      throw new ConfigurationError("You must provide either 'On Behalf Of Email' or 'On Behalf Of ID' when creating an email conversation");
    }
    const {
      app,
      onBehalfOfEmail,
      onBehalfOfName,
      onBehalfOfId,
      ...data
    } = this;

    const onBehalfOf = {};

    if (onBehalfOfEmail) onBehalfOf.email = onBehalfOfEmail;
    if (onBehalfOfName) onBehalfOf.name = onBehalfOfName;
    if (onBehalfOfId) onBehalfOf.id = onBehalfOfId;

    const response = await app.createConversation({
      $,
      data: {
        ...data,
        onBehalfOf,
      },
    });

    $.export("$summary", `Successfully created Conversation with ID '${response.id}'`);

    return response;
  },
};
