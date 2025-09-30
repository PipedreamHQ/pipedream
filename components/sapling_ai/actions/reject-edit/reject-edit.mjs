import app from "../../sapling_ai.app.mjs";

export default {
  key: "sapling_ai-reject-edit",
  name: "Reject Edit",
  description: "Have Sapling not recommend the same edit anymore. Each suggested edit has an edit UUID. You can pass this information back to Sapling to indicate the edit suggestion was not helpful. [See the documentation here](https://sapling.ai/docs/api/edits-overview#reject-edit-post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    editId: {
      propDefinition: [
        app,
        "editId",
      ],
    },
    sessionId: {
      propDefinition: [
        app,
        "sessionId",
      ],
    },
  },
  methods: {
    rejectEdit({
      editId, ...args
    } = {}) {
      return this.app.post({
        path: `/edits/${editId}/reject`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      editId,
      sessionId,
    } = this;

    const response = await this.rejectEdit({
      step,
      editId,
      data: {
        session_id: sessionId,
      },
    });

    step.export("$summary", `Successfully rejected edit with ID ${editId}.`);

    return response;
  },
};
