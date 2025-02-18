import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import app from "../../what_are_those.app.mjs";

export default {
  key: "what_are_those-find-sneakers-by-sku",
  name: "Find Sneakers by SKU",
  description: "Identifies sneakers from a size tag photo and returns sneaker name and details. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#4f6a49f9-3393-42cd-8474-3856a79888af)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    sizeTagImage: {
      type: "string",
      label: "Size Tag Image",
      description: "The path to the size tag image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
  },
  async run({ $ }) {
    const data = fs.readFileSync(checkTmp(this.sizeTagImage));
    const base64Image = Buffer.from(data, "binary").toString("base64");

    const response = await this.app.identifySneakersFromSizeTag({
      $,
      data: base64Image,
    });

    $.export("$summary", `Identified sneaker: ${response}`);
    return response;
  },
};
