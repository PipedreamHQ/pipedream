import app from "../../onedesk.app.mjs";

export default {
  key: "onedesk-create-message",
  name: "Create Message",
  description: "Creates a message or comment. [See the documentation](https://www.onedesk.com/dev/).",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    conversationExternalId: {
      propDefinition: [
        app,
        "conversationExternalId",
      ],
    },
    content: {
      type: "string",
      label: "Content",
      description: "Content of the conversation message",
    },
  },
  methods: {
    createMessage(args = {}) {
      return this.app.post({
        path: "/conversation-messages/",
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createMessage,
      conversationExternalId,
      content,
    } = this;

    const response = await createMessage({
      $,
      data: {
        conversationExternalId,
        content,
      },
    });

    $.export("$summary", `Successfully created message with ID \`${response.data}\`.`);

    return response;
  },
};
