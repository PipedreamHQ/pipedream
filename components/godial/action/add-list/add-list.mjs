import godial from "../../app/godial.app.mjs";

export default {
  name: "Add List",
  version: "0.0.1",
  key: "godial-add-list",
  description: "Adds a list. [See docs here](https://godial.stoplight.io/docs/godial/b3A6MzAzMTY2OA-lists-add)",
  type: "action",
  props: {
    godial,
    teamsId: {
      label: "Teams ID",
      type: "string[]",
      propDefinition: [
        godial,
        "teamId",
      ],
    },
    name: {
      type: "string",
      label: "Name",
      description: "The name of the list to add",
    },
    description: {
      type: "string",
      label: "Description",
      description: "The description of the list to add",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.godial.addList({
      $,
      data: {
        teamsId: this.teamsId,
        name: this.name,
        desc: this.description,
      },
    });

    if (response) {
      $.export("$summary", `Successfully added list with ID ${response.id}`);
    }

    return response;
  },
};
