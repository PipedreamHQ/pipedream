import { axios } from "@pipedream/platform";

export default defineComponent({
  props: {
    gmail: {
      type: "app",
      app: "gmail",
    },
    maxResults: {
      type: "integer",
      default: 5,
    }
  },
  async run({ $ }) {
    return await axios($, {
      url: `https://gmail.googleapis.com/gmail/v1/users/me/messages`,
      headers: {
        Authorization: `Bearer ${this.gmail.$auth.oauth_access_token}`,
      },
      params: {
        maxResults: this.maxResults,
      }
    });
  },
});
