import { axios } from "@pipedream/platform";

export default {
  name: "Update Board",
  version: "0.0.1",
  key: "update-board",
  description: "Updates a Miro board",
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
    },
    boardName: {
      type: "string",
      description: "Board Name",
      optional: true,
    },
    boardDescription: {
      type: "string",
      description: "Board Description",
      optional: true,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "patch",
        url: `https://api.miro.com/v2/boards/${this.boardId}`,
        data: {
          name: this.boardName,
          description: this.boardDescription
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
