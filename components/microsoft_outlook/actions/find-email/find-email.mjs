import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description: "Search for an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "0.0.8",
  type: "action",
  props: {
    microsoftOutlook,
    info: {
      type: "alert",
      alertType: "info",
      content: "When you specify `$filter`, the service infers a sort order for the results. If you use both `$orderby` and `$filter` to get messages, because the server always infers a sort order for the results of a `$filter`, you must [specify properties in certain ways](https://learn.microsoft.com/en-us/graph/api/user-list-messages#using-filter-and-orderby-in-the-same-query).",
    },
    search: {
      type: "string",
      label: "Search",
      description: "Search for an email in Microsoft Outlook. Can search for specific message properties such as `to:example@example.com` or `subject:example`. If the property is excluded, the search targets the default propertes `from`, `subject`, and `body`. For example, `pizza` will search for messages with the word `pizza` in the subject, body, or from address, but `to:example@example.com` will only search for messages to `example@example.com`.",
      optional: true,
    },
    filter: {
      type: "string",
      label: "Filter",
      description: "Filters results. For example, `contains(subject, 'meet for lunch?')` will include messages whose subject contains ‘meet for lunch?’. [See documentation](https://learn.microsoft.com/en-us/graph/filter-query-parameter) for the full list of operations.",
      optional: true,
    },
    orderBy: {
      type: "string",
      label: "Order By",
      description: "Order results by a property. For example, `receivedDateTime desc` will order messages by the received date in descending order.",
      optional: true,
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
    },
  },
  async run({ $ }) {
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listMessages,
      args: {
        $,
        params: {
          "$search": this.search,
          "$filter": this.filter,
          "$orderby": this.orderBy,
        },
      },
      max: this.maxResults,
    });

    const emails = [];
    for await (const item of items) {
      emails.push(item);
    }

    $.export("$summary", `Successfully retrieved ${emails.length} message${emails.length != 1
      ? "s"
      : ""}.`);
    return emails;
  },
};
