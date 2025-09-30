import app from "../../gpt_trainer.app.mjs";

export default {
  key: "gpt_trainer-create-message",
  name: "Create Message",
  description: "Create a session message for a chatbot session specified by session UUID. [See the documentation](https://guide.gpt-trainer.com/api-reference/messages/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    chatbotUuid: {
      propDefinition: [
        app,
        "chatbotUuid",
      ],
    },
    sessionUuid: {
      propDefinition: [
        app,
        "sessionUuid",
        ({ chatbotUuid }) => ({
          chatbotUuid,
        }),
      ],
    },
    query: {
      type: "string",
      label: "Message Query",
      description: "The query message to send to the chatbot session",
    },
  },
  methods: {
    createSessionMessage({
      sessionUuid, ...args
    } = {}) {
      return this.app.post({
        path: `/session/${sessionUuid}/message/stream`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createSessionMessage,
      sessionUuid,
      query,
    } = this;

    const response = await createSessionMessage({
      $,
      sessionUuid,
      data: {
        query,
      },
    });

    $.export("$summary", "Successfully created message.");
    return response;
  },
};
