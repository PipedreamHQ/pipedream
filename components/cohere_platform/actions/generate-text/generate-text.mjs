import common from "../common/base.mjs";

export default {
  ...common,
  key: "cohere_platform-generate-text",
  name: "Generate Text",
  version: "0.0.2",
  description: "This action generates realistic text conditioned on a given input. [See the docs here](https://docs.cohere.ai/reference/generate)",
  type: "action",
};
