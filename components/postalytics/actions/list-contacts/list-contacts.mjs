import postalytics from "../../postalytics.app.mjs";

export default {
  key: "postalytics-list-contacts",
  name: "List Contacts",
  description: "Displays a list of contacts in Postalytics. [See the documentation](https://postalytics.docs.apiary.io/#reference/contact-api/contact-collection/get-all-contacts-on-a-list)",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    postalytics,
    listId: {
      propDefinition: [
        postalytics,
        "listId",
      ],
    },
  },
  async run({ $ }) {
    const response = this.postalytics.paginate({
      fn: this.postalytics.listContacts,
      listId: this.listId,
    });

    const responseArray = [];
    for await (const item of response) {
      responseArray.push(item);
    }

    $.export("$summary", `Successfully listed ${responseArray.length} contacts!`);
    return responseArray;
  },
};

