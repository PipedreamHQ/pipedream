import setsmart from "../../setsmart.app.mjs";

export default {
  key: "setsmart-list-scheduled-messages",
  name: "List Scheduled Messages",
  description: "List the messages that are scheduled but not sent yet. [See the documentation](https://setsmart.io/api-documentation)",
  version: "0.0.1",
  type: "action",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: true,
  },
  props: {
    setsmart,
  },
  async run({ $ }) {
    const response = await this.setsmart.listScheduledMessages({
      $,
    });

    $.export("$summary", `Successfully retrieved ${response?.length ?? 0} scheduled message(s)`);
    return response;
  },
};
