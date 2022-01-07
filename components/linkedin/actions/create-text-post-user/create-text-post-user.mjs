import axios from "axios";

export default {
  key: "linkedin_create-text-post-user",
  name: "Create a Text Post (User)",
  description: "Create shares on LinkedIn using text, URLs, and images. [See the docs](https://docs.microsoft.com/en-us/linkedin/consumer/integrations/self-serve/share-on-linkedin#creating-a-share-on-linkedin) for more information",
  version: "0.0.11",
  type: "action",
  props: {
    name: {
      type: "string",
      label: "Text",
      description: "Text to be posted on LinkedIn timeline",
    },
    linkedin: {
      label: "LinkedIn",
      description: "LinkedIn Integration",
      type: "app",
      app: "linkedin",
    },
  },
  async run({ $ }) {
    const data = {
      "author": `urn:li:person:${this.linkedin.$auth.oauth_uid}`,
      "lifecycleState": "PUBLISHED",
      "specificContent": {
        "com.linkedin.ugc.ShareContent": {
          "shareCommentary": {
            "text": this.name,
          },
          "shareMediaCategory": "NONE",
        },
      },
      "visibility": {
        "com.linkedin.ugc.MemberNetworkVisibility": "PUBLIC",
      },
    };
    try {
      await axios.post("https://api.linkedin.com/v2/ugcPosts", data, {
        headers: {
          "Authorization": `Bearer ${this.linkedin.$auth.oauth_access_token}`,
          "X-Restli-Protocol-Version": "2.0.0",
        },
      });
      $.export("$summary", "Successfully created a new Text Post as User");
    } catch (err) {
      console.error(err);
      $.export("$summary", "It wasn't posible to create Post");
    }
  },
};
