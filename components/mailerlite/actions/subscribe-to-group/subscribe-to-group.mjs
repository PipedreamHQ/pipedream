import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-subscribe-to-group",
  name: "Subscribe to MailerLite Group",
  description: "Add a subscriber to a group. [See the documentation](https://developers.mailerlite.com/docs/groups.html#assign-subscriber-to-a-group)",
  version: "0.3.4",
  annotations: {
    destructiveHint: true,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    mailerlite,
    group: {
      propDefinition: [
        mailerlite,
        "group",
      ],
    },
    subscriber: {
      propDefinition: [
        mailerlite,
        "subscriber",
      ],
      description: "ID of the active subscriber to add to group",
    },
  },
  async run({ $ }) {
    const resp = await this.mailerlite.addSubscriberToGroup({
      $,
      subscriber: this.subscriber,
      group: this.group,
    });
    $.export("$summary", "Added subscriber to group");
    return resp;
  },
};
