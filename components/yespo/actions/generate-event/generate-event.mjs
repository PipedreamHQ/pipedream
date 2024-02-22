import yespo from "../../yespo.app.mjs";
import { axios } from "@pipedream/platform";

export default {
  key: "yespo-generate-event",
  name: "Generate Event",
  description: "Sends an event to the specified user. [See the documentation](https://docs.yespo.io/reference/registerevent-1)",
  version: "0.0.{{ts}}",
  type: "action",
  props: {
    yespo,
    eventtypekey: yespo.propDefinitions.eventtypekey,
    segment: {
      propDefinition: [
        yespo,
        "segment",
      ],
    },
    channels: {
      propDefinition: [
        yespo,
        "channels",
      ],
    },
    recipientEmail: {
      propDefinition: [
        yespo,
        "recipientEmail",
        (c) => ({
          segment: c.segment,
        }),
      ],
    },
    messageSubject: {
      propDefinition: [
        yespo,
        "messageSubject",
        (c) => ({
          segment: c.segment,
        }),
      ],
    },
    messageBody: {
      propDefinition: [
        yespo,
        "messageBody",
        (c) => ({
          segment: c.segment,
        }),
      ],
    },
  },
  async run({ $ }) {
    const response = await this.yespo.registerEvent({
      eventtypekey: this.eventtypekey,
      segment: this.segment,
      channels: this.channels.map(JSON.parse),
      recipientEmail: this.recipientEmail,
      messageSubject: this.messageSubject,
      messageBody: this.messageBody,
    });

    $.export("$summary", `Successfully generated event with type key: ${this.eventtypekey}`);
    return response;
  },
};
