import findymail from "../../findymail.app.mjs";

export default {
  key: "findymail-create-list",
  name: "Create List",
  description: "Creates a new list of contacts in Findymail. [See the documentation](https://app.findymail.com/docs/#contacts-postapi-lists)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    findymail,
    listName: {
      propDefinition: [
        findymail,
        "listName",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.findymail.createNewList({
      listName: this.listName,
    });

    $.export("$summary", `Successfully created a new list with name '${this.listName}'`);

    return response;
  },
};
