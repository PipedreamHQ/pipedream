import help_scout from "../help_scout.app.mjs";

export default {
  name: "List Conversations",
  version: "0.0.1",
  key: "help_scout-list-conversations",
  description: "Emit events on new conversations",
  props: {
    help_scout,
  },
  type: "source",
  methods: {},
  async run({ $ }) {
    const data = await this.help_scout.listConversations({
      $,
    });

    console.log(data._embedded.conversations.length);

    data?._embedded?.conversations?.forEach((conversation) => {
      this.$emit(
        {
          event: conversation,
        },
        {
          summary: conversation.subject,
          ts: Date.now(),
        },
      );
    });
  },
};
