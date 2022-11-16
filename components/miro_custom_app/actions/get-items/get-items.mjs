import { axios } from "@pipedream/platform";

export default {
  name: "Get Items",
  version: "0.0.1",
  key: "get-items",
  description: "Returns items on a Miro board",
  type: "action",
  props: {
    miro_custom_app: {
      type: "app",
      app: "miro_custom_app"
    },
    boardId: {
      type: "string",
      description: "Board ID",
      optional: false,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "get",
        url: `https://api.miro.com/v2/boards/${this.boardId}/items`,
        headers: {
          "Authorization": `Bearer ${this.miro_custom_app.$auth.access_token}`,
          "Content-Type": "application/json",
        },
      };
      //console.log(this.miro_custom_app.$auth)
      return await axios($, config);
    },
  };
