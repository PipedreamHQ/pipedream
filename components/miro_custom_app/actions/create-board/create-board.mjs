import { axios } from "@pipedream/platform";

export default {
  name: "Create Board",
  version: "0.0.7",
  key: "create-board",
  description: "Creates a Miro board",
  type: "action",
  props: {
    miro_custom_app: {
      type: "app",
      app: "miro_custom_app"
    },
    name: {
      type: "string",
      description: "Board name",
      optional: false,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "post",
        url: "https://api.miro.com/v2/boards",
        data: {
          name: this.name
        },
        headers: {
          "Authorization": `Bearer ${this.miro_custom_app.$auth.access_token}`,
          "Content-Type": "application/json",
        },
      };
      //console.log(this.miro_custom_app.$auth)
      return await axios($, config);
    },
  };
