import { axios } from "@pipedream/platform";

export default {
  methods: {
    async createBitlink($, payload, oauth_access_token) {
      return await axios($, {
        method: "post",
        url: "https://api-ssl.bitly.com/v4/bitlinks",
        headers: {
          Authorization: `Bearer ${oauth_access_token}`,
          "Content-Type": "application/json",
        },
        data: payload,
      });
    },
    formatDeepLink(deeplinks) {
      const updatedDeepLink = [];
      const deepLinkErrors = [];
      if (deeplinks.length) {
        for (let i = 0; i < deeplinks.length; i++) {
          if (deeplinks[i]) {
            try {
              const obj = JSON.parse(deeplinks[i]);
              Object.keys(obj).forEach((key) => {
                if (
                  ![
                    "app_id",
                    "app_uri_path",
                    "install_url",
                    "install_type",
                  ].includes(key)
                ) {
                  this.deepLinkErrors.push(
                    `deeplinks[${i}]error: ${key} is not present or allowed in object`
                  );
                }
              });
              updatedDeepLink.push(obj);
            } catch (error) {
              throw new Error(`Object is malformed on deeplinks[${i}]`);
            }
          }
        }
      }
      if (deepLinkErrors.length) {
        throw new Error(
          deepLinkErrors.join(",") +
            ". Allowed keys are app_id,app_uri_path,install_url,install_type"
        );
      }
      return updatedDeepLink;
    },
  },
};
