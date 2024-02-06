import { axios } from "@pipedream/platform";
import FormData from "form-data";

export default {
  type: "app",
  app: "imgur",
  propDefinitions: {},
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    /**
     * Upload a screenshot to Imgur
     *
     * @param {String} screenshot
     * @returns
     */
    uploadImage(screenshot) {
      const formData = new FormData();
      formData.append("image", screenshot);

      return axios(this, {
        method: "POST",
        maxBodyLength: Infinity,
        url: "https://api.imgur.com/3/image",
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          ...formData.getHeaders(),
        },
        data: formData,
      });
    },
  },
};
