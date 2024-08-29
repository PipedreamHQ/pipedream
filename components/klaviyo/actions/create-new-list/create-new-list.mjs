import klaviyo from "../../klaviyo.app.mjs";

export default {
  key: "klaviyo-create-new-list",
  name: "Create New List",
  description: "Creates a new list in an account. [See the docs here](https://developers.klaviyo.com/en/v1-2/reference/create-list)",
  version: "0.0.2",
  type: "action",
  props: {
    klaviyo,
    listName: {
      propDefinition: [
        klaviyo,
        "listName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.klaviyo.newList({
      data: {
        type: "list",
        attributes: {
          name: this.listName,
        },
      },
    });

    $.export("$summary", `"${this.listName}" successfully created!`);
    return response.body;
  },
};
