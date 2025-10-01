import app from "../../sapling_ai.app.mjs";

export default {
  key: "sapling_ai-accept-edit",
  name: "Accept Edit",
  description: "Have Sapling adapt its system over time. Each suggested edit has an edit UUID. You can pass this information back to Sapling to indicate the edit suggestion was helpful. [See the documentation here](https://sapling.ai/docs/api/edits-overview#accept-edit-post).",
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
    acceptEdit({
      editId, ...args
    } = {}) {
      return this.app.post({
        path: `/edits/${editId}/accept`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      editId,
      sessionId,
    } = this;

    const response = await this.acceptEdit({
      step,
      editId,
      data: {
        session_id: sessionId,
      },
    });

    step.export("$summary", `Successfully accepted edit with ID ${editId}.`);

    return response;
  },
};
