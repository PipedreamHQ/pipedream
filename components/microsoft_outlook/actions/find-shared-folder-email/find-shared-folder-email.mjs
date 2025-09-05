import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-find-shared-folder-email",
  name: "Find Shared Folder Email",
  description: "Search for an email in a shared folder in Microsoft Outlook. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages)",
  version: "0.0.1",
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
    },
    sharedFolderId: {
      propDefinition: [
        microsoftOutlook,
        "sharedFolderId",
        ({ userId }) => ({
          userId,
        }),
      ],
    },
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
      fn: this.microsoftOutlook.listSharedFolderMessages,
      args: {
        $,
        userId: this.userId,
        sharedFolderId: this.sharedFolderId,
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

    $.export("$summary", `Successfully retrieved ${emails.length} shared folder message${emails.length != 1
      ? "s"
      : ""}.`);
    return emails;
  },
};
