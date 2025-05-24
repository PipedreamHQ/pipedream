import drift from "../../drift.app.mjs";

export default {
  key: "drift-new-conversation",
  name: "New Conversation",
  description: "Emit new event when a new convesation is started in Drift. [See the documentation](https://devdocs.drift.com/docs/webhook-events-1).",
  version: "0.0.1",
  type: "source",
  props: {
    drift,
    http: "$.interface.http",
  },
  async run(event) {

    const { body } = event;

    if (body?.type !== "new_conversation") {
      console.log("Ignored non-new_conversation event:", body?.type);
      return;
    }

    this.$emit(body, {
      summary: `New conversation from contact ID "${body.data?.contactId}"`,
      id: body.data?.contactId,
      ts: body.data?.createdAt,
    });
  },
};
