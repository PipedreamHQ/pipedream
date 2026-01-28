import app from "../../marketo.app.mjs";

export default {
  key: "marketo-add-lead-to-list",
  name: "Add Lead to List",
  description: "Adds a lead to a specified list in Marketo. [See the documentation](https://developer.adobe.com/marketo-apis/api/mapi/#tag/Static-Lists/operation/addLeadsToListUsingPOST)",
  version: "0.0.1",
  type: "action",
  props: {
    app,
    leadId: {
      propDefinition: [
        app,
        "leadId",
      ],
    },
    listId: {
      propDefinition: [
        app,
        "listId",
      ],
    },
  },
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  async run({ $ }) {
    const {
      app,
      leadId,
      listId,
    } = this;

    const response = await app.addLeadsToList({
      $,
      listId,
      params: {
        id: leadId,
      },
    });

    $.export("$summary", `Successfully added lead ${leadId} to list ${listId}`);
    return response;
  },
};
