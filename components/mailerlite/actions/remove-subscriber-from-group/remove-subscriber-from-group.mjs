import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-remove-subscriber-from-group",
  name: "Remove Subscriber From Group",
  description: "Removes single subscriber from specified group. [See the docs here](https://developers.mailerlite.com/reference/remove-subscriber)",
  version: "0.0.1",
  type: "action",
  props: {
    mailerlite,
    group: {
      propDefinition: [
        mailerlite,
        "group",
      ],
      description: "Group to remove subscriber from",
    },
    type: {
      propDefinition: [
        mailerlite,
        "type",
        () => ({
          type: "subscriber",
        }),
      ],
    },
    subscriber: {
      propDefinition: [
        mailerlite,
        "subscriber",
        (c) => ({
          group: c.group,
          type: c.type,
        }),
      ],
      description: "Subscriber to remove from group",
    },
  },
  async run({ $ }) {
    await this.mailerlite.removeSubscriberFromGroup(this.group, this.subscriber);
    $.export("$summary", "Removed subscriber from group");
    // nothing to return
  },
};
