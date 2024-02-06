import common from "../common/base.mjs";

export default {
  ...common,
  key: "cohere_platform-choose-best-completion",
  name: "Choose Best Completion",
  version: "0.0.2",
  description: "This action chooses the best completion conditioned on a given examples. [See the docs here](https://docs.cohere.ai/reference/generate)",
  type: "action",
  props: {
    ...common.props,
    prompt: {
      propDefinition: [
        common.props.coherePlatform,
        "prompt",
      ],
      type: "string[]",
    },
  },
  methods: {
    ...common.methods,
    prepareAdditionalData({ prompt }) {
      return {
        prompt: prompt.toString(),
      };
    },
  },
};
