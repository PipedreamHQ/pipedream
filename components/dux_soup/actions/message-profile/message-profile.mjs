import duxSoup from "../../dux_soup.app.mjs";

export default {
  key: "dux_soup-message-profile",
  name: "Message Profile",
  description: "Queues a direct message that will be sent to the targeted profile. [See the documentation](https://support.dux-soup.com/article/115-remote-control-by-example)",
  version: "0.0.3",
  annotations: {
    destructiveHint: false,
    openWorldHint: true,
    readOnlyHint: false,
  },
  type: "action",
  props: {
    duxSoup,
    targetProfileUrl: {
      propDefinition: [
        duxSoup,
        "targetProfileUrl",
      ],
    },
    message: {
      propDefinition: [
        duxSoup,
        "message",
      ],
    },
  },
  async run({ $ }) {
    const response = await this.duxSoup.makeRequest({
      $,
      requestBody: {
        command: "message",
        params: {
          profile: this.targetProfileUrl,
          messagetext: this.message,
        },
      },
    });
    $.export("$summary", `Message queued to profile ${this.targetProfileUrl}`);
    return response;
  },
};
