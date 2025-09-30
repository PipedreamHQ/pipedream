import { streamToBuffer } from "../../common/utils.mjs";
import app from "../../what_are_those.app.mjs";
import { getFileStream } from "@pipedream/platform";

export default {
  key: "what_are_those-find-sneakers-by-sku",
  name: "Find Sneakers by SKU",
  description: "Identifies sneakers from a size tag photo and returns sneaker name and details. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#4f6a49f9-3393-42cd-8474-3856a79888af)",
  version: "0.0.4",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
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
    const stream = await getFileStream(this.sizeTagImage);
    const buffer = await streamToBuffer(stream);
    const base64Image = buffer.toString("base64");

    const response = await this.app.identifySneakersFromSizeTag({
      $,
      data: base64Image,
    });

    $.export("$summary", `Identified sneaker: ${response}`);
    return response;
  },
};
