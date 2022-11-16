import { axios } from "@pipedream/platform";

export default {
  name: "Update Shape",
  version: "0.0.2",
  key: "update-shape",
  description: "Updates content of an existing shape on a Miro board",
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
    itemId: {
      type: "string",
      description: "Shape (item) ID",
      optional: false,
    },
    content: {
      type: "string",
      description: "Text content for shape",
      optional: false,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "patch",
        url: `https://api.miro.com/v2/boards/${this.boardId}/shapes/${this.itemId}`,
        data: {
          "data": {
            content: this.content
          }
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
