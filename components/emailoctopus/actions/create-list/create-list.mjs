import app from "../../emailoctopus.app.mjs";

export default {
  key: "emailoctopus-create-list",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  name: "Create List",
  description: "Create a list, [See the docs here](https://emailoctopus.com/api-documentation/lists/create)",
  props: {
    app,
    name: {
      type: "string",
      label: "Name",
      description: "List Name",
    },
  },
  async run ({ $ }) {
    const resp = await this.app.createList({
      $,
      data: {
        name: this.name,
      },
    });
    $.export("$summary", `List(ID:${resp.id}) has been created successfully.`);
    return resp;
  },
};
