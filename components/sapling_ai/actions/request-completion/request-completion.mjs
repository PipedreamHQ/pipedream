import app from "../../sapling_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sapling_ai-request-completion",
  name: "Request Completion",
  description: "Provides predictions of the next few characters or words given the current context in a particular editable. The predictions are based on the previous text. [See the documentation here](https://sapling.ai/docs/api/autocomplete#request-completion-post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
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
  },
  methods: {
    requestCompletion(args = {}) {
      return this.app.post({
        path: "/complete",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      sessionId: id,
      query,
    } = this;

    const sessionId =  utils.generateSessionId(id);

    const response = await this.requestCompletion({
      step,
      data: {
        session_id: sessionId,
        query,
      },
    });

    if (response?.hash) {
      step.export("$summary", `Successfully requested completion with hash ${response.hash}.`);
      return {
        ...response,
        sessionId,
      };
    }

    step.export("$summary", "No response was returned.");
    return {
      success: false,
      sessionId,
    };
  },
};
