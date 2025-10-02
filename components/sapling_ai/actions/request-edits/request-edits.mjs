import app from "../../sapling_ai.app.mjs";
import utils from "../../common/utils.mjs";

export default {
  key: "sapling_ai-request-edits",
  name: "Request Edits",
  description: "Provides grammar, spelling, and stylistic edits for text. It is customizable through a dictionary and custom mappings; for custom language models, please contact [sapling.ai](https://sapling.ai/). Sapling has prebuilt models for applications such as healthcare/medicine. [See the documentation here](https://sapling.ai/docs/api/edits-overview#request-edits-post).",
  type: "action",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  props: {
    app,
    text: {
      propDefinition: [
        app,
        "text",
      ],
    },
    sessionId: {
      optional: true,
      propDefinition: [
        app,
        "sessionId",
      ],
    },
  },
  methods: {
    requestEdits(args = {}) {
      return this.app.post({
        path: "/edits",
        ...args,
      });
    },
  },
  async run({ $: step }) {
    const {
      text,
      sessionId,
    } = this;

    const response = await this.requestEdits({
      step,
      data: {
        text,
        session_id: utils.generateSessionId(sessionId),
      },
    });

    step.export("$summary", `Successfully requested ${response.edits.length} edit(s).`);

    return response;
  },
};
