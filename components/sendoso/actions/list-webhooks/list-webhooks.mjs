import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-webhooks",
  name: "List Webhooks",
  version: "0.0.1",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  description: "Retrieve a list of all webhooks. [See the documentation](https://sendoso.docs.apiary.io/#reference/webhook-management)",
  type: "action",
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.listWebhooks({
      $
    });

    const count = Array.isArray(response) ?
      response.length :
      (response.data?.length || 0);
    $.export("$summary", `Successfully retrieved ${count} webhook(s)`);
    return response;
  },
};

