import acymailing from "../../acymailing.app.mjs";
import { parseObject } from "../../common/utils.mjs";

export default {
  key: "acymailing-subscribe-user",
  name: "Subscribe User to Lists",
  description: "Subscribes a user to one or more specified lists in AcyMailing. [See the documentation](https://docs.acymailing.com/v/rest-api/subscription#subscribe-users-to-lists)",
  version: "0.0.1",
  type: "action",
  props: {
    acymailing,
    emails: {
      propDefinition: [
        acymailing,
        "emails",
      ],
    },
    listIds: {
      propDefinition: [
        acymailing,
        "listIds",
      ],
    },
    sendWelcomeEmail: {
      type: "boolean",
      label: "Send Welcome Email",
      description: "Defaults to true. If true, the welcome emails will be sent if the lists have one.",
      optional: true,
    },
    trigger: {
      type: "boolean",
      label: "Trigger",
      description: "Defaults to true. If you want to trigger or not the automation or follow-up when subscribing the user.",
      optional: true,
    },
  },
  async run({ $ }) {
    const response = await this.acymailing.subscribeUserToLists({
      $,
      data: {
        emails: parseObject(this.emails),
        listIds: parseObject(this.listIds),
        sendWelcomeEmail: this.sendWelcomeEmail,
        trigger: this.trigger,
      },
    });

    $.export("$summary", `Successfully subscribed ${this.emails.length} users to lists ${this.listIds.length} lists`);
    return response;
  },
};
