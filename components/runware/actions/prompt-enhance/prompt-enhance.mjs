import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "runware-prompt-enhance",
  name: "Prompt Enhance",
  description: "Request a prompt enhance task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/utilities/prompt-enhancer).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    prompt: {
      type: "string",
      label: "Prompt",
      description: "The prompt that you intend to enhance.",
    },
    promptMaxLength: {
      type: "integer",
      label: "Prompt Max Length",
      description: "Represents the maximum length of the enhanced prompt that you intend to receive. Min `12`, Max `400`.",
      min: 12,
      max: 400,
    },
    promptVersions: {
      type: "integer",
      label: "Prompt Versions",
      description: "The number of prompt versions that will be received. Min `1`, Max `5`.",
      min: 1,
      max: 5,
    },
    includeCost: {
      propDefinition: [
        app,
        "includeCost",
      ],
    },
  },
  async run({ $ }) {
    const {
      app,
      prompt,
      promptMaxLength,
      promptVersions,
      includeCost,
    } = this;

    const response = await app.post({
      $,
      data: [
        {
          taskUUID: uuid(),
          taskType: constants.TASK_TYPE.PROMPT_ENHANCE.value,
          prompt,
          promptMaxLength,
          promptVersions,
          includeCost,
        },
      ],
    });

    $.export("$summary", `Successfully requested prompt enhance task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
