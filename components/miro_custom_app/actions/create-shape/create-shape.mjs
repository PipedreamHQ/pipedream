import { axios } from "@pipedream/platform";

export default {
  name: "Create Shape",
  version: "0.0.8",
  key: "create-shape",
  description: "Creates a shape on a Miro board",
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
    shapeType: {
      type: "string",
      description: "Shape type (rectangle, circle, star, etc.)",
      optional: false,
    },
    content: {
      type: "string",
      description: "Text content for shape",
      optional: true,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "post",
        url: `https://api.miro.com/v2/boards/${this.boardId}/shapes`,
        data: {
          "data": {
            shape: this.shapeType,
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
