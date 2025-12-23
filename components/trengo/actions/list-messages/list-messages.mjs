import utils from "../../common/utils.mjs";
import app from "../../trengo.app.mjs";

export default {
  key: "trengo-list-messages",
  name: "List Messages",
  description: "List messages from a ticket. [See the documentation](https://developers.trengo.com/reference/list-all-messages)",
  version: "0.0.7",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  type: "action",
  props: {
    app,
    ticketId: {
      propDefinition: [
        app,
        "ticketId",
      ],
    },
    maxResults: {
      type: "integer",
      label: "Max Results",
      description: "Maximum number of messages to return (if not specified, all results will be returned)",
      optional: true,
    },
  },
  async run({ $ }) {
    const messages = [];
    const resourcesStream = utils.getResourcesStream({
      resourceFn: this.app.getMessages,
      resourceFnArgs: {
        ticketId: this.ticketId,
      },
    });
    for await (const item of resourcesStream) {
      messages.push(item);
      if (this.maxResults && messages.length >= this.maxResults) {
        break;
      }
    }
    const length = messages.length;
    $.export("$summary", `Successfully retrieved ${length} message${length === 1
      ? ""
      : "s"}`);
    return messages;
  },
};
