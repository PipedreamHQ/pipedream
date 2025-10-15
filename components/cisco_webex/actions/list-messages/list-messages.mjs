import ciscoWebex from "../../cisco_webex.app.mjs";

export default {
  key: "cisco_webex-list-messages",
  name: "List Messages",
  description: "Retrieve messages in a specific room. [See the docs here](https://developer.webex.com/docs/api/v1/messages/list-messages)",
  type: "action",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    ciscoWebex,
    roomId: {
      propDefinition: [
        ciscoWebex,
        "roomId",
      ],
    },
    parentId: {
      propDefinition: [
        ciscoWebex,
        "messageId",
        ({ roomId }) => ({
          roomId,
        }),
      ],
      optional: true,
    },
    before: {
      type: "string",
      label: "Before",
      description: "List messages sent before a date and time.",
      optional: true,
    },
    max: {
      type: "integer",
      label: "Max",
      description: "The maximum number of messages to return per page. Defaults to `50`.",
      optional: true,
    },
    maxResources: {
      type: "integer",
      label: "Max Resources",
      description: "The maximum number of resources to return in total. Defaults to `100`.",
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      roomId,
      parentId,
      before,
      max,
      maxResources,
    } = this;

    const messages = [];

    const resourcesStream =
      await this.ciscoWebex.getResourcesStream({
        resourceFn: this.ciscoWebex.listMessages,
        resourceFnArgs: {
          $,
          params: {
            roomId,
            parentId,
            before,
            max,
          },
        },
        maxResources,
      });

    for await (const message of resourcesStream) {
      messages.push(message);
    }

    // eslint-disable-next-line multiline-ternary
    $.export("$summary", `Successfully fetched ${messages.length} ${messages.length === 1 ? "message" : "messages"}`);

    return messages;
  },
};
