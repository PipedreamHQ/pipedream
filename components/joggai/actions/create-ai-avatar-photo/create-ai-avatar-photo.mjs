import {
  AGE_OPTIONS,
  ASPECT_RATIO_OPTIONS,
  AVATAR_STYLE_OPTIONS,
  ETHNICITY_OPTIONS,
  GENDER_OPTIONS,
  MODEL_OPTIONS,
} from "../../common/constants.mjs";
import { checkResponse } from "../../common/utils.mjs";
import joggai from "../../joggai.app.mjs";

export default {
  key: "joggai-create-ai-avatar-photo",
  name: "Create AI Avatar Photo",
  description: "Creates an AI avatar photo using JoggAI API. [See the documentation](https://docs.jogg.ai/api-reference/Avatar/GenerateAIAvatarPhoto)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    joggai,
    age: {
      type: "string",
      label: "Age",
      description: "Age of the avatar.",
      options: AGE_OPTIONS,
    },
    aspectRatio: {
      type: "string",
      label: "Aspect Ratio",
      description: "Aspect ratio of the avatar.",
      options: ASPECT_RATIO_OPTIONS,
    },
    avatarStyle: {
      type: "string",
      label: "Avatar Style",
      description: "Style of the avatar.",
      options: AVATAR_STYLE_OPTIONS,
    },
    gender: {
      type: "string",
      label: "Gender",
      description: "Gender of the avatar.",
      options: GENDER_OPTIONS,
    },
    model: {
      type: "string",
      label: "Model",
      description: "Model of the avatar.",
      options: MODEL_OPTIONS,
    },
    appearance: {
      type: "string",
      label: "Appearance",
      description: "Appearance of the avatar.",
      optional: true,
    },
    background: {
      type: "string",
      label: "Background",
      description: "Background of the avatar.",
      optional: true,
    },
    ethnicity: {
      type: "string",
      label: "Ethnicity",
      description: "Ethnicity of the avatar.",
      options: ETHNICITY_OPTIONS,
      optional: true,
    },
    imageUrl: {
      type: "string",
      label: "Image URL",
      description: "URL of the image to use for the avatar.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.joggai.createAIAvatarPhoto({
      $,
      data: {
        age: this.age,
        aspect_ratio: this.aspectRatio && parseInt(this.aspectRatio),
        avatar_style: this.avatarStyle,
        gender: this.gender,
        model: this.model,
        appearance: this.appearance,
        background: this.background,
        image_url: this.imageUrl,
        ethnicity: this.ethnicity,
      },
    });

    checkResponse(response);

    $.export("$summary", "AI avatar photo created successfully");
    return response;
  },
};
