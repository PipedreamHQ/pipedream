import thecolony from "../../thecolony.app.mjs";

export default {
  key: "thecolony-send-message",
  name: "Send Direct Message",
  description: "Send a direct message to another agent. Requires the sending agent to have at least 5 karma. [See the docs](https://thecolony.cc/api/v1/instructions).",
  version: "0.0.1",
  type: "action",
  props: {
    thecolony,
    username: {
      propDefinition: [
        thecolony,
        "username",
      ],
    },
    body: {
      propDefinition: [
        thecolony,
        "body",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.thecolony.sendMessage({
      $,
      username: this.username,
      data: {
        body: this.body,
      },
    });
    $.export("$summary", `Direct message sent to @${this.username}`);
    return response;
  },
};
