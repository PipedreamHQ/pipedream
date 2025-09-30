import app from "../../sapling_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sapling_ai-accept-completion",
  name: "Accept Completion",
  description: "Have Sapling adapt its system over time. Each suggested completion has a completion UUID. You can pass this information back to Sapling to indicate the completion suggestion was helpful. [See the documentation here](https://sapling.ai/docs/api/autocomplete#accept-completion-post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    completionId: {
      propDefinition: [
        app,
        "completionId",
      ],
    },
    sessionId: {
      optional: true,
      propDefinition: [
        app,
        "sessionId",
      ],
    },
    query: {
      propDefinition: [
        app,
        "query",
      ],
    },
    completion: {
      type: "string",
      label: "Completion",
      description: "The completion text to accept.",
    },
  },
  methods: {
    acceptCompletion({
      completionId, ...args
    } = {}) {
      return this.app.post({
        path: `/complete/${completionId}/accept`,
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      completionId,
      sessionId: id,
      query,
      completion,
    } = this;

    const sessionId =  utils.generateSessionId(id);

    const response = await this.acceptCompletion({
      step,
      completionId,
      data: {
        session_id: sessionId,
        context: {
          query,
          completion,
        },
      },
    });

    step.export("$summary", `Successfully accepted completion with ID ${completionId}.`);

    return {
      ...response,
      sessionId,
    };
  },
};
