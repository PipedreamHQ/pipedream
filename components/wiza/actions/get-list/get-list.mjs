import app from "../../wiza.app.mjs";

export default {
  key: "wiza-get-list",
  name: "Get List",
  description: "Get the list with the given id. [See the documentation](https://wiza.co/api-docs#/paths/~1api~1lists~1%7Bid%7D/get)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    id: {
      propDefinition: [
        app,
        "id",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.app.getList({
      $,
      id: this.id,
    });

    $.export("$summary", `The status of your list is: '${response.data.status}'`);

    return response;
  },
};
