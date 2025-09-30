import salesmsg from "../../salesmsg.app.mjs";

export default {
  key: "salesmsg-search-conversations",
  name: "Search Conversations",
  version: "0.0.2",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Search active conversations in conversation history. [See the documentation](https://documenter.getpostman.com/view/13798866/2s935uHgXp#c9f078a9-931a-45c0-81c7-14d2b745ca5b)",
  type: "action",
  props: {
    salesmsg,
    term: {
      type: "string",
      label: "Term",
      description: "Search term (first/last name, email, number, formatted_number, tag)",
    },
    type: {
      type: "string",
      label: "Type",
      description: "Define search type.",
      options: [
        "contacts",
        "messages",
      ],
      optional: true,
    },
  },
  async run({ $ }) {
    const {
      salesmsg,
      ...params
    } = this;
    const items = salesmsg.paginate({
      fn: salesmsg.searchConversations,
      perPage: true,
      params,
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
