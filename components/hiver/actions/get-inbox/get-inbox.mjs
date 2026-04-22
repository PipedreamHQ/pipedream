import hiver from "../../hiver.app.mjs";

export default {
  key: "hiver-get-inbox",
  name: "Get Inbox",
  description: "Get an inbox by ID. [See the documentation](https://developer.hiverhq.com/hiver-api/inbox/get-an-inbox-by-id)",
  version: "0.0.2",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    hiver,
    inboxId: {
      propDefinition: [
        hiver,
        "inboxId",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.hiver.getInbox({
      $,
      inboxId: this.inboxId,
    });
    $.export("$summary", `Successfully retrieved inbox ${this.inboxId}`);
    return response;
  },
};
