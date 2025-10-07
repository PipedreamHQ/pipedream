import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_catalyst.app";
import { getImageFormData } from "../../common/methods";

export default defineAction({
  key: "zoho_catalyst-detect-objects-in-image",
  name: "Detect Objects in Image",
  description: "Detect or recognize objects in an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/or.html)",
  version: "0.1.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
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
  },
  async run({ $ }): Promise<object> {
    const {
      imagePath, projectId,
    } = this;

    const data = await getImageFormData(imagePath);

    const response = await this.app.detectObjectsInImage({
      $,
      projectId,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully processed image for object detection");

    return response;
  },
});
