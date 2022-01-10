export default {
  type: "app",
  app: "linkedin",
  propDefinitions: {
    name: {
      type: "string",
      label: "Text",
      description: "Text to be posted on LinkedIn timeline",
    },
  },
  methods: {
    // this.$auth contains connected account data
    authKeys() {
      console.log(Object.keys(this.$auth));
    },
    getPayload(shareMediaCategory, text) {
      if (![
        "NONE",
        "ARTICLE",
        "IMAGE",
      ].includes(shareMediaCategory)) {
        throw new Error("invalid shareMediaCategory");
      }
      return {
        "author": `urn:li:person:${this.$auth.oauth_uid}`,
        "lifecycleState": "PUBLISHED",
        "specificContent": {
          "com.linkedin.ugc.ShareContent": {
            "shareCommentary": {
              text,
            },
            shareMediaCategory,
          },
        },
        "visibility": {
          "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
        },
      };
    },
    getRequestConfig(data) {
      return {
        url: "https://api.linkedin.com/v2/ugcPosts",
        method: "POST",
        data,
        headers: {
          "Authorization": `Bearer ${this.$auth.oauth_access_token}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      };
    },
  },
};
