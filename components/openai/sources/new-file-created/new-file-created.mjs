import openai from "../../openai.app.mjs";
import common from "../common.mjs";

export default {
  ...common,
  key: "openai-new-file-created",
  name: "New File Created",
  description: "Emit new event when a new file is created in OpenAI. [See the documentation](https://platform.openai.com/docs/api-reference/files/list)",
  version: "0.0.1",
  type: "source",
  dedupe: "unique",
  props: {
    ...common.props,
    purpose: {
      propDefinition: [
        openai,
        "purpose",
      ],
      description: "If specified, events will only be emitted for files with the specified purpose.",
      optional: true,
    },
  },
  methods: {
    async getAndProcessItems() {
      const savedItems = this._getSavedItems();
      const { data } = await this.openai.listFiles({
        purpose: this.purpose,
      });
      data?.filter(({ id }) => !savedItems.includes(id)).forEach((file) => {
        this.$emit(file, {
          id: file.id,
          summary: `New File: ${file.filename}`,
          ts: file.created_at * 1000,
        });
        savedItems.push(file.id);
      });
      this._setSavedItems(savedItems);
    },
  },
};
