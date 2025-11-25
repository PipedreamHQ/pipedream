import hubspot from "../../hubspot.app.mjs";

export default {
  key: "hubspot-get-inbox",
  name: "Get Inbox",
  description: "Retrieves a single inbox by its ID. [See the documentation](https://developers.hubspot.com/docs/api-reference/conversations-conversations-inbox-&-messages-v3/public-inbox/get-conversations-v3-conversations-inboxes-inboxId)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hubspot,
    inboxId: {
      propDefinition: [
        hubspot,
        "inboxId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hubspot.getInbox({
      $,
      inboxId: this.inboxId,
    });
    $.export("$summary", `Successfully retrieved inbox with ID ${this.inboxId}`);
    return response;
  },
};
