import { v4 as uuid } from "uuid";
import app from "../../runware.app.mjs";
import constants from "../../common/constants.mjs";

export default {
  key: "runware-image-caption",
  name: "Image Caption",
  description: "Request an image caption task to be processed by the Runware API. [See the documentation](https://docs.runware.ai/en/utilities/image-to-text).",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    inputImage: {
      propDefinition: [
        app,
        "inputImage",
      ],
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
      inputImage,
      includeCost,
    } = this;

    const response = await app.post({
      $,
      data: [
        {
          taskType: constants.TASK_TYPE.IMAGE_CAPTION.value,
          taskUUID: uuid(),
          inputImage,
          includeCost,
        },
      ],
    });

    $.export("$summary", `Successfully requested image caption task with UUID \`${response.data[0].taskUUID}\`.`);
    return response;
  },
};
