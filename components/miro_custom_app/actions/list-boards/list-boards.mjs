import { axios } from "@pipedream/platform";

export default {
  name: "List Boards",
  version: "0.0.1",
  key: "list-boards",
  description: "Returns a user's Miro boards",
  type: "action",
  props: {
    miro_custom_app: {
      type: "app",
      app: "miro_custom_app"
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "get",
        url: "https://api.miro.com/v2/boards",
        headers: {
          "Authorization": `Bearer ${this.miro_custom_app.$auth.access_token}`,
          "Content-Type": "application/json",
        },
      };
      //console.log(this.miro_custom_app.$auth)
      return await axios($, config);
    },
  };
