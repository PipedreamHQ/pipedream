import { axios } from "@pipedream/platform";
import FormData from "form-data";
import fs from "node:fs";

export default {
  type: "app",
  app: "api4ai",
  propDefinitions: {
    image: {
      type: "string",
      label: "Image",
      description: "Input image. Various types are accepted:\n  * a **path** to a file\n  * a **URL** to a file\n  * a file's content encoded as a **base64** string\n  * a file's content as a **Buffer** encoded in JSON\n  * a file's content as an **Array** of bytes",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },

    /**
     * Make HTTP request.
     *
     * @param {Object} $ - Pipedream.
     * @param {string} url - API Endpoint URL.
     * @param {*} image - Input image.
     *     Various types are accepted:
     *       - a path to a file
     *       - a URL to a file
     *       - a file's content encoded as a base64 string
     *       - a file's content as a Buffer encoded in JSON
     *       - a file's content as an Array of bytes
     * @param {Object} params - Query parameters.
     * @returns Axios response.
     */
    async makeRequest($, url, image, params = {}) {
      // Prepare form data.
      const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
      const urlregex = /^(http|ftp)s?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&//=]*)/;
      const form = new FormData();
      if (urlregex.test(image)) {
        console.log("Input image considered as URL");
        form.append("url", image);
      }
      else {
        let buf;
        if (image instanceof Buffer) {
          console.log("Input image considered as Buffer");
          buf = image;
        }
        else if ((image instanceof Object) && image.type === "Buffer") {
          console.log("Input image considered as JSON object with Buffer");
          buf = Buffer.from(image);
        }
        else if (image instanceof Array) {
          console.log("Input image considered as Array");
          buf = Buffer.from(image);
        }
        else if (base64regex.test(image)) {
          console.log("Input image considered as base64 string");
          buf = Buffer.from(image, "base64");
        }
        else {
          console.log("Input image considered as file path");
          buf = fs.readFileSync(image);
        }
        form.append("image", buf);
      }

      // Prepare headers.
      const headers = {
        "Content-Type": "multipart/form-data",
        "X-RapidAPI-Key": this.$auth.api_key,
        "A4A-CLIENT-USER-ID": "pipedream.com",
      };

      // Perfrom POST reqest.
      const response = await axios($, {
        url,
        method: "post",
        data: form,
        headers,
        params,
      });

      // Return response.
      return response;
    },
  },
};
