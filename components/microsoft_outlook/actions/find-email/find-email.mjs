import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-find-email",
  name: "Find Email",
  description: "Search for an email in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "0.0.12",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    info: {
      type: "alert",
      alertType: "info",
      content: "When you specify `$filter`, the service infers a sort order for the results. If you use both `$orderby` and `$filter` to get messages, because the server always infers a sort order for the results of a `$filter`, you must [specify properties in certain ways](https://learn.microsoft.com/en-us/graph/api/user-list-messages#using-filter-and-orderby-in-the-same-query).",
    },
    search: {
      propDefinition: [
        microsoftOutlook,
        "search",
      ],
    },
    filter: {
      propDefinition: [
        microsoftOutlook,
        "filter",
      ],
    },
    orderBy: {
      propDefinition: [
        microsoftOutlook,
        "orderBy",
      ],
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
