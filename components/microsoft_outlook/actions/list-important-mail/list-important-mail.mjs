import microsoftOutlook from "../../microsoft_outlook.app.mjs";
import {
  IMPORTANT_MAIL_FILTER, COUNT_QUERY_PARAM,
} from "../../common/constants.mjs";

export default {
  key: "microsoft_outlook-list-important-mail",
  name: "List Important Mail",
  description: "Get the most important mail from the user's Inbox (messages with high importance or flagged status). Returns `{ count, data }` where `count` is the true total matching message count reported by Microsoft Graph (`@odata.count` for the applied filter) and `data` is the array of retrieved messages (up to `maxResults`). [See the documentation](https://learn.microsoft.com/en-us/graph/api/user-list-messages?view=graph-rest-1.0&tabs=http)",
  version: "0.1.0",
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
      description: "The User ID of a shared mailbox. If not provided, defaults to the authenticated user's mailbox. Free-form string — use **Get Current User** or a directory lookup to find the ID.",
    },
    maxResults: {
      propDefinition: [
        microsoftOutlook,
        "maxResults",
      ],
      description: "Maximum number of messages to return. Min 1, max 1000.",
    },
  },
  async run({ $ }) {
    const meta = {};
    const items = this.microsoftOutlook.paginate({
      fn: this.microsoftOutlook.listInboxMessages,
      args: {
        $,
        userId: this.userId,
        params: {
          $filter: IMPORTANT_MAIL_FILTER,
          $select: "id,subject,sender,receivedDateTime",
          $count: COUNT_QUERY_PARAM,
        },
      },
      max: this.maxResults,
      meta,
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

    const count = meta["@odata.count"] ?? messages.length;
    $.export("$summary", `Found ${count} total important message${count === 1
      ? ""
      : "s"} (returned ${messages.length}).`);
    return {
      count,
      data: messages,
    };
  },
};

