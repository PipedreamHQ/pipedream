import FormData from "form-data";
import fs from "fs";
import { checkTmp } from "../../common/utils.mjs";
import app from "../../what_are_those.app.mjs";

export default {
  key: "what_are_those-identify-sneakers-from-photo",
  name: "Identify Sneakers from Photo",
  description: "Identifies sneakers from an uploaded image and returns details such as name, links, images, prices, and confidence scores. [See the documentation](https://documenter.getpostman.com/view/3847098/2sAY4rDQDs#957c900c-501f-4c8f-9b8b-71655a8cfb5d).",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    image: {
      type: "string",
      label: "Image",
      description: "The path to the size tag image in the `/tmp` directory. [See the documentation on working with files](https://pipedream.com/docs/code/nodejs/working-with-files/#writing-a-file-to-tmp).",
    },
  },
  async run({ $ }) {
    const data = new FormData();
    data.append("image1", fs.createReadStream(checkTmp(this.image)));

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
