import sendoso from "../../sendoso.app.mjs";

export default {
  key: "sendoso-list-sent-gifts",
  name: "List Sent Gifts",
  description: "List all sent gifts. [See the documentation](https://developer.sendoso.com/rest-api/sends/list-sent-gifts)",
  version: "0.0.1",
  type: "action",
  props: {
    sendoso,
  },
  async run({ $ }) {
    const response = await this.sendoso.listSendGifts();
    $.export("$summary", `Successfully retrieved ${response.length} sent gifts`);
    return response;
  },
};
