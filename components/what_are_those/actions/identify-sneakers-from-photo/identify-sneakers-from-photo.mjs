import FormData from "form-data";
import app from "../../what_are_those.app.mjs";
import { getFileStreamAndMetadata } from "@pipedream/platform";

export default {
  key: "what_are_those-identify-sneakers-from-photo",
  name: "Identify Sneakers from Photo",
  description: "Identifies sneakers from an uploaded image and returns details such as name, links, images, prices, and confidence scores. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#957c900c-501f-4c8f-9b8b-71655a8cfb5d).",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    image: {
      type: "string",
      label: "Image",
      description: "The image to upload. Provide either a file URL or a path to a file in the /tmp directory (for example, /tmp/myFile.jpg).",
    },
    syncDir: {
      type: "dir",
      accessMode: "read",
      sync: true,
      optional: true,
    },
  },
  async run({ $ }) {
    const data = new FormData();
    const {
      stream, metadata,
    } = await getFileStreamAndMetadata(this.image);
    data.append("image1", stream, {
      contentType: metadata.contentType,
      knownLength: metadata.size,
      filename: metadata.name,
    });

    const response = await this.app.identifySneakers({
      headers: {
        ...data.getHeaders(),
      },
      data: data,
    });

    $.export("$summary", `Identified ${response.names} sneakers successfully`);
    return response;
  },
};
