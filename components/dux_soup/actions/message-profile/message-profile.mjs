import duxSoup from "../../dux_soup.app.mjs";

export default {
  key: "dux_soup-message-profile",
  name: "Message Profile",
  description: "Queues a direct message that will be sent to the targeted profile. [See the documentation](https://support.dux-soup.com/article/115-remote-control-by-example)",
  version: "0.0.1",
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
          profile: this.targetProfileURL,
          messagetext: this.message,
        },
      },
    });
    $.export("$summary", `Message queued to profile ${this.targetProfileUrl}`);
    return response;
  },
};
