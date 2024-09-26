import app from "../../trello.app.mjs";

export default {
  key: "trello-create-label",
  name: "Create Label",
  description: "Creates a new label on the specified board. [See the documentation](https://developer.atlassian.com/cloud/trello/rest/api-group-labels/#api-labels-post).",
  version: "0.2.0",
  type: "action",
  props: {
    app,
    idBoard: {
      type: "string",
      label: "Board ID",
      description: "The ID of the board to create the label on.",
      propDefinition: [
        app,
        "board",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "Name for the label.",
    },
    color: {
      type: "string",
      label: "Color",
      description: "The color for the label. One of: yellow, purple, blue, red, green, orange, black, sky, pink, lime, null (null means no color, and the label will not show on the front of cards)",
      options: [
        "yellow",
        "purple",
        "blue",
        "red",
        "green",
        "orange",
        "black",
        "sky",
        "pink",
        "lime",
        "null",
      ],
    },
  },
  methods: {
    createLabel(args = {}) {
      return this.app.post({
        path: "/labels",
        ...args,
      });
    },
  },
  async run({ $ }) {

    const {
      createLabel,
      idBoard,
      name,
      color,
    } = this;

    const response = await createLabel({
      $,
      params: {
        idBoard,
        name,
        color,
      },
    });

    $.export("$summary", "Successfully created a label");

    return response;
  },
};
