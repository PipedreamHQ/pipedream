import sidetracker from "../../sidetracker.app.mjs";

export default {
  key: "sidetracker-get-list",
  name: "Get List",
  description: "Retrieve a list from Sidetracker. [See the documentation](https://app.sidetracker.io/api/schema/redoc#tag/Lists/operation/ListRetrievalById)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    sidetracker,
    listId: {
      propDefinition: [
        sidetracker,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.sidetracker.getList({
      $,
      listId: this.listId,
    });
    $.export("$summary", `Successfully retrieved list ${this.listId}`);
    return response;
  },
};
