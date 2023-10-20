import { ConfigurationError } from "@pipedream/platform";
import coherePlatform from "../../cohere_platform.app.mjs";
import { clearObj } from "../../common/utils.mjs";

export default {
  props: {
    coherePlatform,
    prompt: {
      propDefinition: [
        coherePlatform,
        "prompt",
      ],
    },
    model: {
      propDefinition: [
        coherePlatform,
        "model",
      ],
    },
    numGenerations: {
      propDefinition: [
        coherePlatform,
        "numGenerations",
      ],
    },
    maxTokens: {
      propDefinition: [
        coherePlatform,
        "maxTokens",
      ],
    },
    preset: {
      propDefinition: [
        coherePlatform,
        "preset",
      ],
    },
    temperature: {
      propDefinition: [
        coherePlatform,
        "temperature",
      ],
    },
    k: {
      propDefinition: [
        coherePlatform,
        "k",
      ],
    },
    p: {
      propDefinition: [
        coherePlatform,
        "p",
      ],
    },
    frequencyPenalty: {
      propDefinition: [
        coherePlatform,
        "frequencyPenalty",
      ],
    },
    endSequences: {
      propDefinition: [
        coherePlatform,
        "endSequences",
      ],
    },
    stopSequences: {
      propDefinition: [
        coherePlatform,
        "stopSequences",
      ],
    },
    returnLikelihoods: {
      propDefinition: [
        coherePlatform,
        "returnLikelihoods",
      ],
    },
    logitBias: {
      propDefinition: [
        coherePlatform,
        "logitBias",
      ],
    },
    truncate: {
      propDefinition: [
        coherePlatform,
        "truncate",
      ],
    },
  },
  methods: {
    prepareData({
      numGenerations,
      maxTokens,
      temperature,
      p,
      frequencyPenalty,
      endSequences,
      stopSequences,
      returnLikelihoods,
      logitBias,
      ...data
    }) {
      return {
        num_generations: numGenerations,
        max_tokens: maxTokens,
        temperature: temperature && parseFloat(temperature),
        p: p && parseFloat(p),
        frequency_penalty: frequencyPenalty && parseFloat(frequencyPenalty),
        end_sequences: endSequences,
        stop_sequences: stopSequences,
        retur_likelihoods: returnLikelihoods,
        logit_bias: logitBias && Object.entries(logitBias).reduce((p, [
          k,
          v,
        ]) => ({
          ...p,
          [k]: parseInt(v),
        }), {}),
        ...data,
      };
    },
    prepareAdditionalData() {
      return {};
    },
  },
  async run({ $ }) {
    const {
      coherePlatform,
      prepareData,
      prepareAdditionalData,
      ...data
    } = this;

    const response = await coherePlatform.generateText(clearObj({
      ...prepareData(data),
      ...prepareAdditionalData(data),
    }));

    if (response.statusCode != "200") throw new ConfigurationError(response.body.message);

    $.export("$summary", "The text was successfully generated!");
    return response;
  },
};
