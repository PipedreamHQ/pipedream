import ultramsg from "../../ultramsg.app.mjs";

export default {
  name: "Send a Link",
  description: "Send a link to a specified number. [See the docs here](https://docs.ultramsg.com/api/post/messages/link)",
  key: "ultramsg-send-link",
  version: "0.0.1",
  type: "action",
  props: {
    ultramsg,
    to: {
      propDefinition: [
        ultramsg,
        "to",
      ],
    },
    link: {
      type: "string",
      label: "Link",
      description: "Link to be sent. (e.g., `https://example.com/`)",
    },
  },
  async run({ $ }) {
    const {
      to,
      link,
    } = this;

    const data = {
      to,
      link,
    };
    const res = await this.ultramsg.sendLink(data, $);
    $.export("$summary", `Link successfully sent to "${to}"`);

    return res;
  },
};
