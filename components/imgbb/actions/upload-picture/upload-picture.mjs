// legacy_hash_id: a_K5i2KK
import { axios } from "@pipedream/platform";
import { stringify } from "qs";

export default {
  key: "imgbb-upload-picture",
  name: "Upload picture",
  version: "0.2.1",
  type: "action",
  props: {
    imgbb: {
      type: "app",
      app: "imgbb",
    },
    image: {
      type: "string",
      description: "A binary file, base64 data, or a URL for an image. (up to 16MB)",
    },
    name: {
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
    const config = {
      method: "post",
      url: `https://api.imgbb.com/1/upload?key=${this.imgbb.$auth.api_key}`,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      data: stringify(data),
    };
    return await axios($, config);
  },
};
