import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-delete-list",
  name: "Delete a List",
  description: "Deletes a specified list in Findymail. [See the documentation](https://app.findymail.com/docs/#contacts-deleteapi-lists--id-)",
  version: "0.0.3",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    findymail,
    listId: {
      propDefinition: [
        findymail,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.findymail.deleteList({
      listId: this.listId,
    });

    $.export("$summary", `Successfully deleted list with ID: ${this.listId}`);

    return response;
  },
};
