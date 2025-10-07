import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_catalyst.app";
import { getImageFormData } from "../../common/methods";
import { FACE_ANALYTICS_MODE_OPTIONS } from "../../common/constants";

export default defineAction({
  key: "zoho_catalyst-perform-face-detection-and-analysis",
  name: "Perform Face Detection and Analysis",
  description: "Perform face detection and analysis on an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/face-analytics.html)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    app,
    projectId: {
      propDefinition: [
        app,
        "projectId",
      ],
    },
    imagePath: {
      propDefinition: [
        app,
        "imagePath",
      ],
    },
    mode: {
      propDefinition: [
        app,
        "mode",
      ],
      description: "Denotes the number of facial landmarks to be detected in a face.",
      options: FACE_ANALYTICS_MODE_OPTIONS,
    },
    emotion: {
      type: "boolean",
      label: "Emotion",
      description: "Whether to detect emotion.",
      optional: true,
      default: true,
    },
    age: {
      type: "boolean",
      label: "Age",
      description: "Whether to detect age.",
      optional: true,
      default: true,
    },
    gender: {
      type: "boolean",
      label: "Gender",
      description: "Whether to detect gender.",
      optional: true,
      default: true,
    },
  },
  async run({ $ }): Promise<object> {
    const {
      imagePath, projectId,
    } = this;

    const data = await getImageFormData(imagePath);
    for (const prop of [
      "mode",
      "emotion",
      "age",
      "gender",
    ]) {
      if (this[prop]) {
        data.append(prop, this[prop].toString());
      }
    }

    const response = await this.app.performImageFaceDetection({
      $,
      projectId,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully performed image face detection");

    return response;
  },
});
