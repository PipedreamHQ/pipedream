import { axios } from "@pipedream/platform";
import { defineAction } from "@pipedream/types";

export default defineAction({
  key: "zoho_catalyst-extract-text-from-image",
  name: "Extract Text from Image",
  description: `Extract text from an image. [See the documentation](https://catalyst.zoho.com/help/api/zia/ocr.html)`,
  version: "0.0.1",
  type: "action",
  props: {
    zoho: {
      type: "app",
      app: "zoho",
    },
    imageData: {
      type: "string",
      label: "Image Data",
      description: "The data of the image to extract text from",
    },
  },
  async run({ $ }) {
    const url = 'https://catalyst.zoho.com/api/v1/zia/ocr';     
    const headers = {
      'Authorization': `Zoho-oauthtoken ${this.zoho.$auth.oauth_access_token}`,
      'Content-Type': 'multipart/form-data'
    };

    let formData = new FormData();
    formData.append('file', this.imageData);

    try {
      const response = await axios($, {
        method: "POST",
        url: url,
        data: formData,
        headers: headers
      });
      return response;
    } catch (error) {
      console.error(error);
    }
  },
});