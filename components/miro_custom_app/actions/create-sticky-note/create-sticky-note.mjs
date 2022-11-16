import { axios } from "@pipedream/platform";

export default {
  name: "Create Sticky Note",
  version: "0.0.2",
  key: "create-sticky-note",
  description: "Creates a sticky note on a Miro board",
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
    content: {
      type: "string",
      description: "Text content for sticky note",
      optional: true,
    }
  },
  async run({ $ }) {
    //See the API docs developers.miro.com
      const config = {
        method: "post",
        url: `https://api.miro.com/v2/boards/${this.boardId}/sticky_notes`,
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
