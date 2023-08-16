import { defineAction } from "@pipedream/types";
import app from "../../app/zoho_catalyst.app";
import fs from "fs";
import FormData from "form-data";

export default defineAction({
  key: "zoho_catalyst-extract-text-from-image",
  name: "Extract Text from Image",
  description: "Extract text from an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/ocr.html)",
  version: "0.0.1",
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
      type: "string",
      label: "Image Path",
      description:
        "A file path in the `/tmp` directory. [See the documentation on working with files.](https://pipedream.com/docs/code/nodejs/working-with-files/)",
      optional: false,
    },
  },
  async run({ $ }): Promise<object> {
    const { imagePath, projectId } = this;
    const content = await fs.promises.readFile(imagePath.startsWith('/tmp') ? imagePath : `/tmp/${imagePath}`.replace(/\/\//g, '/'));

    const data = new FormData();
    data.append("image", content);

    const response = await this.app.extractTextFromImage({
      $,
      projectId,
      data,
    });

    $.export("$summary", "Successfully processed image");

    return response;
  },
});
