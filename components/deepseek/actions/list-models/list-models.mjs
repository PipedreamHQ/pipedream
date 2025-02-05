import deepseek from "../../deepseek.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "deepseek-list-models",
  name: "List Models",
  description: "Lists the currently available models, and provides basic information about each one such as the owner and availability. [See the documentation](https://api-docs.deepseek.com/)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    deepseek: {
      type: "app",
      app: "deepseek",
    },
  },
  async run({ $ }) {
    const models = await this.deepseek.listModels();
    $.export("$summary", "Successfully listed models");
    return models;
  },
};
