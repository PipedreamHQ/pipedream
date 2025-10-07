import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_catalyst.app";
import { getImageFormData } from "../../common/methods";
import { MODERATION_MODE_OPTIONS } from "../../common/constants";

export default defineAction({
  key: "zoho_catalyst-perform-image-moderation",
  name: "Perform Image Moderation",
  description: "Perform image moderation on an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/image-moderation.html)",
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
    mode: {
      propDefinition: [
        app,
        "mode",
      ],
      description: "Denotes the moderation mode.",
      options: MODERATION_MODE_OPTIONS,
    },
  },
  async run({ $ }): Promise<object> {
    const {
      imagePath, projectId, mode,
    } = this;

    const data = await getImageFormData(imagePath);
    if (mode) data.append("mode", mode);

    const response = await this.app.performImageModeration({
      $,
      projectId,
      headers: data.getHeaders(),
      data,
    });

    $.export("$summary", "Successfully performed image moderation");

    return response;
  },
});
