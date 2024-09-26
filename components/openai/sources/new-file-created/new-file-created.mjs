import common from "../common/common.mjs";
import sampleEmit from "./test-event.mjs";

export default {
  ...common,
  key: "openai-new-file-created",
  name: "New File Created",
  description: "Emit new event when a new file is created in OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/list)",
  version: "0.0.9",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    purpose: {
      propDefinition: [
        common.props.openai,
        "purpose",
      ],
      description: "If specified, events will only be emitted for files with the specified purpose.",
      optional: true,
    },
  },
  methods: {
    ...common.methods,
    getData() {
      return this.openai.listFiles({
        purpose: this.purpose,
      });
    },
    getMeta(item) {
      return {
        id: item.id,
        summary: `New File: ${item.filename}`,
        ts: item.created_at * 1000,
      };
    },
  },
  sampleEmit,
};
