import salesmsg from "../../salesmsg.app.mjs";

export default {
  key: "salesmsg-get-user-conversations",
  name: "Get User Conversations",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieves the list of all the conversations of a specific contact id. [See the documentation](https://documenter.getpostman.com/view/13798866/2s935uHgXp#27602c5c-e171-4009-b11c-3d19904d7dcd)",
  type: "action",
  props: {
    salesmsg,
  },
  async run({ $ }) {
    const items = this.salesmsg.paginate({
      fn: this.salesmsg.listConversations,
    });
    const responseArray = [];

    for await (const item of items) {
      responseArray.push(item);
    }

    $.export("$summary", `${responseArray.length} conversation${responseArray.length > 1
      ? "s were"
      : " was"} successfully fetched!`);
    return responseArray;
  },
};
