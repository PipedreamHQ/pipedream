import app from "../../botpress.app.mjs";

export default {
  key: "botpress-add-participant",
  name: "Add Participant To Conversation",
  description: "Adds a participant to a conversation. [See the documentation](https://botpress.com/docs/api-documentation/#add-participant)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    conversationId: {
      propDefinition: [
        app,
        "conversationId",
      ],
    },
    userId: {
      propDefinition: [
        app,
        "userId",
      ],
    },
  },
  methods: {
    addParticipant({
      conversationId, ...args
    } = {}) {
      return this.app.post({
        path: `/chat/conversations/${conversationId}/participants`,
        ...args,
      });
    },
  },
  async run({ $ }) {
    const {
      addParticipant,
      conversationId,
      userId,
    } = this;

    const response = await addParticipant({
      $,
      conversationId,
      data: {
        userId,
      },
    });

    $.export("$summary", `Successfully added participant with ID \`${response.participant?.id}\` to the conversation.`);

    return response;
  },
};
