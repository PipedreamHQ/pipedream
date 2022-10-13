import mailerlite from "../../mailerlite.app.mjs";

export default {
  key: "mailerlite-subscribe-to-group",
  name: "Subscribe to MailerLite Group",
  description: "Add a subscriber to a group. [See the docs here](https://developers.mailerlite.com/docs/groups.html#assign-subscriber-to-a-group)",
  version: "0.3.1",
  type: "action",
  props: {
    mailerlite,
    group: {
      propDefinition: [
        mailerlite,
        "group",
      ],
    },
    email: {
      propDefinition: [
        mailerlite,
        "subscriber",
      ],
      description: "Email of the active subscriber to add to group",
    },
  },
  async run({ $ }) {
    const data = {
      email: this.email,
    };
    const resp = await this.mailerlite.addSubscriberToGroup(data, this.group);
    $.export("$summary", "Added subscriber to group");
    return resp;
  },
};
