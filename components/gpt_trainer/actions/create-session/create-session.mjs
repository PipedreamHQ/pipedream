import app from "../../gpt_trainer.app.mjs";

export default {
  key: "gpt_trainer-create-session",
  name: "Create Chat Session",
  description: "Create a chat session for a chatbot specified by chatbot UUID. [See the documentation](https://guide.gpt-trainer.com/api-reference/sessions/create)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    uuid: {
      propDefinition: [
        app,
        "chatbotUuid",
      ],
    },
  },
  methods: {
    createChatSession({
      uuid, ...args
    } = {}) {
      return this.app.post({
        path: `/chatbot/${uuid}/session/create`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      createChatSession,
      uuid,
    } = this;

    const response = await createChatSession({
      $,
      uuid,
    });

    $.export("$summary", `Successfully created chat session with UUID \`${response.uuid}\``);
    return response;
  },
};
