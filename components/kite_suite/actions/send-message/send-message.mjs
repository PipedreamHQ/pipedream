import kiteSuite from "../../kite_suite.app.mjs";
import { ConfigurationError } from "@pipedream/platform";

export default {
  key: "kite_suite-send-message",
  name: "Send Message",
  description: "Sends a message to a user or project group using Kite Suite. [See the documentation](https://api.kitesuite.com/swagger/#/Chat/post_api_v1_chat_message)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    kiteSuite,
    workspace: {
      propDefinition: [
        kiteSuite,
        "workspace",
      ],
    },
    projectId: {
      propDefinition: [
        kiteSuite,
        "projectId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
      optional: true,
    },
    userId: {
      propDefinition: [
        kiteSuite,
        "userId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
      label: "User",
      description: "User to send a message to",
      optional: true,
    },
    message: {
      type: "string",
      label: "Message",
      description: "The message to send",
    },
    taggedMessage: {
      propDefinition: [
        kiteSuite,
        "messageId",
        (c) => ({
          workspace: c.workspace,
          projectId: c.projectId,
        }),
      ],
      label: "Tagged Message",
      description: "Identifier of a message to tag",
    },
    taggedUsers: {
      propDefinition: [
        kiteSuite,
        "userId",
        (c) => ({
          workspace: c.workspace,
        }),
      ],
      type: "string[]",
      label: "Tagged Users",
      description: "An array of identifiers of users to tag",
    },
    links: {
      type: "string[]",
      label: "Links",
      description: "An array of links to send with the message",
      optional: true,
    },
  },
  async run({ $ }) {
    if ((!this.projectId && !this.userId)) {
      throw new ConfigurationError("One of `projectId` or `userId` should be entered.");
    }

    const data = {
      message: this.message,
      taggedMessage: this.taggedMessage,
      taggedUsers: this.taggedUsers,
      links: this.links,
    };

    if (this.userId) {
      data.userID = this.userId;
    } else {
      data.projectID = this.projectId;
    }

    const args = {
      workspace: this.workspace,
      data,
      $,
    };

    const response = this.userId
      ? await this.kiteSuite.sendMessageToUser(args)
      : await this.kiteSuite.sendMessageToGroup(args);

    if (response.data._id) {
      $.export("$summary", `Successfully sent message with ID ${response.data._id}.`);
    }

    return response;
  },
};
