import app from "../../imgbb.app.mjs";
import { stringify } from "qs";

export default {
  key: "imgbb-upload-picture",
  name: "Upload picture",
  description: "Upload a picture to imgbb. [See the docs here](https://api.imgbb.com/)",
  version: "0.2.2",
  type: "action",
  props: {
    app,
    image: {
      label: "Image",
      type: "string",
      description: "A binary file, base64 data, or a URL for an image. (up to 16MB)",
    },
    name: {
      label: "Name",
      type: "string",
      description: "The name of the file, this is automatically detected if uploading a file with a POST and multipart / form-data",
      optional: true,
    },
  },
  async run({ $ }) {
    const data = {
      image: this.image,
      name: this.name,
    };
    const res = await this.app.uploadPicture($, stringify(data));
    $.export("$summary", "Successfully uploaded picture");
    return res;
  },
};
