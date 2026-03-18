import microsoftOutlook from "../../microsoft_outlook.app.mjs";

export default {
  key: "microsoft_outlook-list-important-mail",
  name: "List Important Mail",
  description: "Get the most important mail from the user's Inbox. [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http)",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    microsoftOutlook,
    userId: {
      propDefinition: [
        microsoftOutlook,
        "userId",
      ],
      optional: true,
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox.",
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
      description: "The maximum number of messages to return.",
    },
  },
  async run({ $ }) {
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listInboxMessages,
      args: {
        $,
        userId: this.userId,
        params: {
          $filter: "importance eq 'high' or flag/flagStatus eq 'flagged'",
          $select: "id,subject,sender,receivedDateTime",
          $orderby: "receivedDateTime desc",
        },
      },
      max: this.maxResults,
    });

    const messages = [];
    for await (const item of items) {
      messages.push({
        id: item.id,
        subject: item.subject,
        sender: item?.sender?.emailAddress?.name,
        receivedDateTime: item.receivedDateTime,
      });
    }

    $.export("$summary", `Successfully retrieved ${messages.length} message${messages.length === 1
      ? ""
      : "s"}.`);
    return {
      data: messages,
    };
  },
};

